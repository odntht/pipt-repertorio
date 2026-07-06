#!/usr/bin/env node
// Plano B — migração do docx original.
//
// Uso:
//   node scripts/migrate-docx.mjs --phase 0 --docx <path>   # análise (default)
//   node scripts/migrate-docx.mjs --phase 1 --docx <path>   # gera .pro do canário
//
// Fase 0 escreve só relatório em docs/migration/.
// Fase 1 escreve .pro em data/songs/ (pula arquivos já existentes).
//
// Sem dependências externas — usa `unzip` do sistema + regex + XML parsing.
// Ver docs/superpowers/specs/2026-07-05-pipt-repertorio-design.md §8.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');

// ────────────────────────────────────────────────────────────────────────────
// 1. CLI

function parseArgs(argv) {
  const args = { docx: null, phase: '0' };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--docx') args.docx = argv[++i];
    else if (argv[i] === '--phase') args.phase = argv[++i];
  }
  if (!args.docx) {
    console.error(
      'Uso: node scripts/migrate-docx.mjs [--phase 0|1] --docx <caminho.docx>',
    );
    process.exit(2);
  }
  if (args.phase !== '0' && args.phase !== '1') {
    console.error(`--phase inválida: ${args.phase} (esperado 0 ou 1)`);
    process.exit(2);
  }
  return args;
}

// ────────────────────────────────────────────────────────────────────────────
// 2. Extração de texto do .docx (sem deps)

function extractDocxText(docxPath) {
  const xml = execFileSync('unzip', ['-p', docxPath, 'word/document.xml'], {
    maxBuffer: 64 * 1024 * 1024,
  }).toString('utf-8');

  const paragraphs = [];
  const paraRe = /<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g;
  const runRe = /<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g;
  let m;
  while ((m = paraRe.exec(xml)) !== null) {
    const body = m[1];
    let text = '';
    let r;
    while ((r = runRe.exec(body)) !== null) text += r[1];
    paragraphs.push(decodeXml(text));
  }
  return paragraphs;
}

function decodeXml(s) {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

// ────────────────────────────────────────────────────────────────────────────
// 3. Segmentação em seções e músicas

const SECTION_HEADERS = [
  { re: /^1ª PARTE\b.*CONGREGACIONAIS$/i, section: 'congregacional' },
  { re: /^2ª PARTE\b.*HINOS DO HINÁRIO/i, section: 'hinario' },
  { re: /^3ª PARTE\b.*INFANTIS$/i, section: 'infantil' },
  { re: /^4ª PARTE\b.*INADEQUADAS/i, section: 'inadequada' },
];

// Cabeçalho de música: linha maiúscula terminando em ` – TOM` (com traço tipográfico
// ou hífen), opcionalmente seguido de parênteses. Tom = A-G, opcional #|b, opcional m.
// A regex é lenient de propósito — o script depois tenta parsear o tom e o título.
const SONG_HEADER_RE =
  /^[A-ZÁÉÍÓÚÂÊÔÃÕÇÜÑ0-9].*?[  ][–\-][  ][A-G][#b]?m?(?: ?\([^)]*\))?[  ]*$/;

// Extrai título, artista, tom e qualifiers de um cabeçalho de música.
function parseHeader(line) {
  // Casos que precisamos suportar:
  //   NADA ALÉM DO SANGUE (Fernandinho) – G
  //   HINO 010 – A CRIAÇÃO E SEU CRIADOR (versão) – D
  //   LOUVEMOS AO SENHOR – E (versão 2)
  //   FILHO DO DEUS VIVO – E (NIVEA SOARES)
  //   CHAMADO (MINISTÉRIO ZOE) – F(youtube)
  //   EM ESPIRITO, EM VERDADE (arranjo 2) – G
  //
  // Estratégia: pegar o último ` – X (...)` como tom+trailer, e tratar o resto
  // como corpo do título (que pode conter parênteses de artista/qualifier).
  const tomRe = /[  ][–\-][  ]([A-G][#b]?m?)(?: ?\(([^)]*)\))?[  ]*$/;
  const m = line.match(tomRe);
  if (!m) return null;
  const key = m[1];
  const trailer = m[2] ?? null;
  const bodyRaw = line.slice(0, m.index).trim();

  // Se ainda tem outro ` – ` no bodyRaw (caso hinário), é um pré-título.
  // Ex.: `HINO 010 – A CRIAÇÃO E SEU CRIADOR (versão)` → preTitle = "HINO 010",
  //      title = "A CRIAÇÃO E SEU CRIADOR", qualifier = "versão".
  let preTitle = null;
  let titleAndParen = bodyRaw;
  const preTitleMatch = bodyRaw.match(/^([A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9 .]+?)[  ][–\-][  ](.+)$/);
  if (preTitleMatch) {
    preTitle = preTitleMatch[1].trim();
    titleAndParen = preTitleMatch[2];
  }

  // Última parêntese no titleAndParen: pode ser artista ou qualifier.
  const parenMatch = titleAndParen.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  let title, parenContent;
  if (parenMatch) {
    title = parenMatch[1].trim();
    parenContent = parenMatch[2].trim();
  } else {
    title = titleAndParen.trim();
    parenContent = null;
  }

  return {
    title,
    preTitle,       // "HINO 010" etc.
    parenContent,   // artist ou qualifier bruto
    trailer,        // "versão 2", "NIVEA SOARES", "youtube", etc.
    key,
    raw: line,
  };
}

function splitIntoSongs(paragraphs) {
  const songs = [];
  let currentSection = null;
  let bodyStartIdx = null;
  // Pula o índice (TOC) — começa quando encontra o primeiro cabeçalho de seção
  // pela segunda vez (o primeiro é no sumário).
  let sectionSeen = 0;
  for (let i = 0; i < paragraphs.length; i++) {
    const line = paragraphs[i];
    for (const sh of SECTION_HEADERS) {
      if (sh.re.test(line)) {
        sectionSeen++;
        if (sectionSeen >= 5) {
          // As 4 primeiras ocorrências são no TOC; da 5ª em diante são o corpo.
          currentSection = sh.section;
          if (bodyStartIdx === null) bodyStartIdx = i;
        }
        break;
      }
    }
    if (bodyStartIdx !== null) break;
  }
  // Fallback: se por algum motivo não achamos 5 headers, começa no primeiro
  // "1ª PARTE" que aparece após uma linha em branco (empírico).
  if (bodyStartIdx === null) {
    for (let i = 200; i < paragraphs.length; i++) {
      if (SECTION_HEADERS[0].re.test(paragraphs[i])) {
        bodyStartIdx = i;
        currentSection = 'congregacional';
        break;
      }
    }
  }
  if (bodyStartIdx === null) {
    throw new Error('Não consegui encontrar o início do corpo do documento.');
  }

  let current = null;
  for (let i = bodyStartIdx; i < paragraphs.length; i++) {
    const line = paragraphs[i];
    const sectionSwitch = SECTION_HEADERS.find((sh) => sh.re.test(line));
    if (sectionSwitch) {
      currentSection = sectionSwitch.section;
      if (current) { songs.push(current); current = null; }
      continue;
    }
    if (SONG_HEADER_RE.test(line)) {
      const parsed = parseHeader(line);
      if (parsed) {
        if (current) songs.push(current);
        current = {
          section: currentSection ?? 'congregacional',
          header: parsed,
          bodyLines: [],
          lineNumber: i + 1,
        };
        continue;
      }
    }
    if (current) current.bodyLines.push(line);
  }
  if (current) songs.push(current);
  return songs;
}

// ────────────────────────────────────────────────────────────────────────────
// 4. Extração de features por música

// Uma linha é "chord-only" se todos os tokens não-vazios são acordes válidos.
// Aceita sufixos comuns (m, M, maj, min, dim, aug, sus, °, º), extensões
// numéricas, parênteses opcionais e baixo via `/`.
const CHORD_TOKEN_RE =
  /^[A-G][#b]?(?:[mM]|maj|min|dim|aug|sus|[°º0-9])*(?:\([^)]*\))?(?:\/[A-G][#b]?(?:[mM]|[°º0-9])*)?$/;
function isChordOnlyLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return false;
  const tokens = trimmed.split(/\s+/);
  if (tokens.length === 0) return false;
  return tokens.every((t) => CHORD_TOKEN_RE.test(t));
}

function extractFeatures(song) {
  let numSeparators = 0;
  let numChordLines = 0;
  let numLyricLines = 0;
  let numBlank = 0;
  let hasIntro = false;
  let hasCapo = false;
  let hasBracketNotation = false;
  let hasYoutube = false;
  let hasDrive = false;
  let hasRepeatMarker = false;
  const urls = [];

  for (const line of song.bodyLines) {
    const t = line.trim();
    if (t === '') { numBlank++; continue; }
    if (/^-{3,}$/.test(t)) { numSeparators++; continue; }
    if (/https?:\/\/\S+/.test(t)) {
      const found = t.match(/https?:\/\/\S+/g) ?? [];
      urls.push(...found);
      if (found.some((u) => /youtube|youtu\.be/.test(u))) hasYoutube = true;
      if (found.some((u) => /drive\.google/.test(u))) hasDrive = true;
    }
    if (/^Intro[:\-]/i.test(t)) hasIntro = true;
    if (/^Capo/i.test(t)) hasCapo = true;
    if (/[\[\{].+?[\]\}]/.test(t)) hasBracketNotation = true;
    if (/(repete|refr[ãa]o|bis|x\s?2|x\s?3)/i.test(t)) hasRepeatMarker = true;
    if (isChordOnlyLine(line)) numChordLines++;
    else numLyricLines++;
  }

  // Qualifier heurístico baseado no `parenContent` e `trailer` do header.
  const qualifierBits = [];
  const hint = [song.header.parenContent, song.header.trailer]
    .filter(Boolean).join(' ').toLowerCase();
  if (/arranjo\s*\d/.test(hint)) qualifierBits.push('arranjo-numerado');
  if (/vers[ãa]o\s*\d/.test(hint)) qualifierBits.push('versao-numerada');
  if (/vers[ãa]o(?!\s*\d)/.test(hint)) qualifierBits.push('versao-generico');
  if (/simples/.test(hint)) qualifierBits.push('simples');
  if (/grande[\s-]?lucas/.test(hint)) qualifierBits.push('grande-lucas');
  if (/youtube/.test(hint)) qualifierBits.push('marcador-youtube');
  const hasQualifier = qualifierBits.length > 0;
  const hasArtist =
    song.header.parenContent !== null &&
    !hasQualifier &&
    song.header.preTitle === null;

  return {
    numSeparators,
    numChordLines,
    numLyricLines,
    numBlank,
    totalLines: song.bodyLines.length,
    hasIntro,
    hasCapo,
    hasBracketNotation,
    hasYoutube,
    hasDrive,
    hasRepeatMarker,
    hasQualifier,
    qualifierBits,
    hasArtist,
    hasPreTitle: song.header.preTitle !== null,
    urls,
  };
}

// ────────────────────────────────────────────────────────────────────────────
// 5. Clustering por bucket estrutural

function clusterOf(song, features) {
  if (song.section === 'hinario' || features.hasPreTitle) return 'H-hinario';
  if (song.section === 'infantil') return 'I-infantil';
  if (song.section === 'inadequada') return 'Z-inadequada';
  if (features.qualifierBits.length > 0) return 'D-com-qualifier';
  if (features.hasIntro) return 'C-com-intro';
  if (features.numSeparators >= 3) return 'B-multi-secao';
  if (features.numSeparators === 0) return 'A0-sem-separador';
  return 'A-simples';
}

// Sinaliza risco de falha para revisão manual no batch-canário.
function riskFlags(song, features) {
  const flags = [];
  if (features.totalLines < 5) flags.push('body-muito-curto');
  if (features.numLyricLines === 0) flags.push('sem-letra-detectada');
  if (features.numChordLines === 0) flags.push('sem-acordes-detectados');
  if (features.numChordLines > features.numLyricLines * 3) {
    flags.push('acordes-desbalanceado');
  }
  if (song.header.key.length > 3) flags.push('tom-suspeito');
  if (features.hasBracketNotation) flags.push('possivel-anotacao-especial');
  return flags;
}

// ────────────────────────────────────────────────────────────────────────────
// 6. Slugify (mesmo algoritmo do site — mantido inline pra não depender do TS)

function slugifyTitle(title) {
  return title
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ────────────────────────────────────────────────────────────────────────────
// 7. Escolha determinística do batch-canário

// FNV-1a 32-bit — hash estável, sem dep.
function stableHash(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h;
}

function pickCanaryBatch(songs) {
  const byCluster = new Map();
  for (const s of songs) {
    const arr = byCluster.get(s.cluster) ?? [];
    arr.push(s);
    byCluster.set(s.cluster, arr);
  }
  const sorted = [...byCluster.entries()].sort((a, b) => b[1].length - a[1].length);
  const canary = [];
  sorted.forEach(([, list], idx) => {
    // 3 amostras pros 4 maiores clusters, 1 pros demais.
    const n = idx < 4 ? 3 : 1;
    const chosen = list
      .slice()
      .sort((a, b) => stableHash(a.slug) - stableHash(b.slug))
      .slice(0, Math.min(n, list.length));
    canary.push(...chosen);
  });
  return canary;
}

// ────────────────────────────────────────────────────────────────────────────
// 8. Relatório

function renderReport({ songs, canary, docxPath }) {
  const byCluster = new Map();
  const bySection = new Map();
  const riskCounts = new Map();
  for (const s of songs) {
    byCluster.set(s.cluster, (byCluster.get(s.cluster) ?? 0) + 1);
    bySection.set(s.section, (bySection.get(s.section) ?? 0) + 1);
    for (const f of s.risks) riskCounts.set(f, (riskCounts.get(f) ?? 0) + 1);
  }

  const lines = [];
  lines.push('# Plano B — Fase 0: análise estrutural do docx');
  lines.push('');
  lines.push(`**Fonte:** \`${docxPath}\``);
  lines.push(`**Gerado por:** \`scripts/migrate-docx.mjs\``);
  lines.push('');
  lines.push('> Este relatório é gerado. Não edite à mão — regenere com o script.');
  lines.push('');
  lines.push('## Totais');
  lines.push('');
  lines.push(`- Total de músicas detectadas: **${songs.length}**`);
  lines.push('');
  lines.push('### Por seção');
  lines.push('');
  lines.push('| Seção | Qtd |');
  lines.push('|---|---:|');
  for (const [sec, n] of [...bySection.entries()].sort()) {
    lines.push(`| ${sec} | ${n} |`);
  }
  lines.push('');
  lines.push('### Por cluster estrutural');
  lines.push('');
  lines.push('| Cluster | Qtd | Descrição |');
  lines.push('|---|---:|---|');
  const clusterDesc = {
    'A-simples': '1-2 blocos separados por `---`. Formato comum.',
    'A0-sem-separador': 'Sem `---` no corpo. Provavelmente música curta ou muito colada.',
    'B-multi-secao': '3+ blocos separados por `---`. Estrutura rica (estrofe/refrão/ponte).',
    'C-com-intro': 'Marcador explícito `Intro:` no corpo.',
    'D-com-qualifier': 'Header traz `arranjo N`, `versão N`, `simples`, etc.',
    'H-hinario': 'Hinário Novo Cântico (`HINO NNN`).',
    'I-infantil': 'Seção infantil.',
    'Z-inadequada': 'Seção "inadequada ao culto público".',
  };
  for (const [cluster, n] of [...byCluster.entries()].sort()) {
    lines.push(`| \`${cluster}\` | ${n} | ${clusterDesc[cluster] ?? '(sem descrição)'} |`);
  }
  lines.push('');
  lines.push('### Flags de risco (podem precisar revisão manual)');
  lines.push('');
  if (riskCounts.size === 0) {
    lines.push('Nenhuma flag levantada.');
  } else {
    lines.push('| Flag | Qtd |');
    lines.push('|---|---:|');
    for (const [flag, n] of [...riskCounts.entries()].sort((a, b) => b[1] - a[1])) {
      lines.push(`| \`${flag}\` | ${n} |`);
    }
  }
  lines.push('');
  lines.push('## Batch-canário (Fase 1)');
  lines.push('');
  lines.push(
    `Amostragem determinística (hash estável do slug), ${canary.length} músicas ` +
    'cobrindo os principais clusters. Revisar com lupa antes de rodar Fase 2+.',
  );
  lines.push('');
  lines.push('| Cluster | Título | Seção | Tom | Linha docx |');
  lines.push('|---|---|---|---|---:|');
  for (const s of canary) {
    lines.push(
      `| \`${s.cluster}\` | ${s.header.title} | ${s.section} | ${s.header.key} | ${s.lineNumber} |`,
    );
  }
  lines.push('');
  lines.push('## Como usar este relatório');
  lines.push('');
  lines.push(
    '1. Revisar contagens acima e ajustar o parser em `scripts/migrate-docx.mjs`',
    'caso a distribuição por cluster pareça errada.',
  );
  lines.push(
    '2. Na Fase 1, o script vai gerar `.pro` só para as músicas do batch-canário e',
    'abrir uma branch `migration/batch-00` pra revisão manual.',
  );
  lines.push(
    '3. Falhas irrecuperáveis vão pra `docs/migration/failures.md`.',
  );
  lines.push('');
  return lines.join('\n') + '\n';
}

// ────────────────────────────────────────────────────────────────────────────
// 9. Fase 1 — conversão chord-over-lyrics → ChordPro

function slugifyTom(tom) {
  return tom.toLowerCase().replace('#', 's');
}

// Deriva o qualifier (arranjo-1, v2, simples, grande-lucas...) a partir do
// header. Retorna null se for artista puro. Usado no nome de arquivo.
function extractQualifier(header) {
  const bits = [header.parenContent, header.trailer]
    .filter(Boolean)
    .map((s) => s.toLowerCase());
  for (const b of bits) {
    const arranjo = b.match(/arranjo\s*(\d+)/);
    if (arranjo) return `arranjo-${arranjo[1]}`;
    const versao = b.match(/vers[ãa]o\s*(\d+)/);
    if (versao) return `v${versao[1]}`;
    if (/vers[ãa]o(?!\s*\d)/.test(b)) return 'versao';
    if (/simples/.test(b)) return 'simples';
    if (/grande[\s-]?lucas/.test(b)) return 'grande-lucas';
    if (/youtube/.test(b) && b === 'youtube') return null; // marcador, não qualifier
  }
  return null;
}

// Extrai artist do header quando parenContent não é qualifier.
function extractArtist(header) {
  if (header.parenContent && !extractQualifier(header)) {
    // Se preTitle existe (hinário), parenContent geralmente é "versão" — pulou
    // acima. Se não, é candidato a artista.
    if (!/^\s*youtube\s*$/i.test(header.parenContent)) {
      return header.parenContent;
    }
  }
  return null;
}

function extractHinarioNum(header) {
  if (!header.preTitle) return null;
  const m = header.preTitle.match(/HINO\s*(\d+)/i);
  return m ? m[1] : null;
}

// Casa uma linha de acordes com a linha de letra imediatamente abaixo. Cada
// acorde é inserido em `[chord]` na coluna correspondente. Se a letra é mais
// curta que a coluna do acorde, padeia com espaços.
function mergeChordOverLyric(chordLine, lyricLine) {
  const tokens = [];
  const re = /\S+/g;
  let m;
  while ((m = re.exec(chordLine)) !== null) {
    tokens.push({ col: m.index, chord: m[0] });
  }
  if (tokens.length === 0) return lyricLine;
  let out = '';
  let cursor = 0;
  let padded = lyricLine;
  const lastCol = tokens[tokens.length - 1].col;
  if (lastCol > padded.length) padded = padded.padEnd(lastCol, ' ');
  for (const { col, chord } of tokens) {
    out += padded.slice(cursor, col) + `[${chord}]`;
    cursor = col;
  }
  out += padded.slice(cursor);
  return out;
}

// Emite uma linha só com acordes como ChordPro (`[C] [G] [Am]`).
function chordLineToChordPro(chordLine) {
  const parts = [];
  const re = /\S+/g;
  let m;
  while ((m = re.exec(chordLine)) !== null) parts.push(`[${m[0]}]`);
  return parts.join(' ');
}

// Converte o corpo cru de uma música (linhas do docx) em linhas ChordPro.
// Regras:
//   - "Intro: X Y Z" → {comment: Intro: X Y Z}
//   - "-----" → linha em branco
//   - "(Repete Tudo)" ou similares → {comment: Repete Tudo}
//   - chord-only line + lyric line seguinte → merge posicional
//   - chord-only line isolada → linha `[C] [G] ...`
//   - lyric line sem chord acima → linha de letra sem acordes
function bodyToChordPro(bodyLines) {
  const out = [];
  let i = 0;
  while (i < bodyLines.length) {
    const line = bodyLines[i];
    const t = line.trim();

    if (t === '') { out.push(''); i++; continue; }
    if (/^-{3,}$/.test(t)) { out.push(''); i++; continue; }
    // "Intro: X Y Z" — extrai o rótulo como comment e os acordes como chord line.
    const intro = t.match(/^Intro[:\-]\s*(.*)$/i);
    if (intro) {
      const rest = intro[1].trim();
      if (rest === '') {
        out.push('{comment: Intro}');
      } else {
        const tokens = rest.split(/\s+/);
        if (tokens.every((tok) => CHORD_TOKEN_RE.test(tok))) {
          out.push('{comment: Intro}');
          out.push(tokens.map((tok) => `[${tok}]`).join(' '));
        } else {
          out.push(`{comment: ${t}}`);
        }
      }
      i++;
      continue;
    }
    // Linha só com `[Label]` (comum: `[Intro]`, `[Refrão]`, `[Ponte]`).
    const bareLabel = t.match(/^\[([^\]]+)\]\s*$/);
    if (bareLabel) {
      out.push(`{comment: ${bareLabel[1]}}`);
      i++;
      continue;
    }
    // Padrão `[Label] chord chord ...` (label seguido de acordes na mesma linha).
    const labelChords = t.match(/^\[([^\]]+)\]\s+(.+)$/);
    if (labelChords) {
      const rest = labelChords[2].trim();
      const tokens = rest.split(/\s+/);
      if (tokens.every((tok) => CHORD_TOKEN_RE.test(tok))) {
        out.push(`{comment: ${labelChords[1]}}`);
        out.push(tokens.map((tok) => `[${tok}]`).join(' '));
        i++;
        continue;
      }
    }
    if (/^\([^)]+\)$/.test(t) && t.length < 60) {
      out.push(`{comment: ${t.slice(1, -1)}}`);
      i++;
      continue;
    }
    if (isChordOnlyLine(line)) {
      const next = bodyLines[i + 1];
      if (next != null && next.trim() !== '' && !isChordOnlyLine(next) &&
          !/^-{3,}$/.test(next.trim())) {
        out.push(mergeChordOverLyric(line, next));
        i += 2;
        continue;
      }
      out.push(chordLineToChordPro(line));
      i++;
      continue;
    }
    out.push(line);
    i++;
  }
  // Remove blank lines no fim
  while (out.length && out[out.length - 1] === '') out.pop();
  return out;
}

// Monta o texto ChordPro completo de uma música.
function buildProContent(song, urls) {
  const { header } = song;
  const artist = extractArtist(header);
  const qualifier = extractQualifier(header);
  const hinarioNum = extractHinarioNum(header);
  const youtube = urls.find((u) => /youtube|youtu\.be/.test(u)) ?? null;

  const meta = [];
  meta.push(`{title: ${titleCase(header.title)}}`);
  if (artist) meta.push(`{artist: ${titleCase(artist)}}`);
  meta.push(`{key: ${header.key}}`);
  if (youtube) meta.push(`{youtube: ${youtube}}`);
  meta.push(`{section: ${song.section}}`);
  meta.push('{status: em-revisao}');
  if (hinarioNum) meta.push(`{hinario_num: ${hinarioNum}}`);
  if (qualifier) meta.push(`{notes: qualifier=${qualifier} (revisar)}`);
  meta.push(`{added: ${today()}}`);

  // Filtra as URLs do body (já viraram metadata) antes de converter
  const filteredBody = song.bodyLines.filter(
    (l) => !/https?:\/\/\S+/.test(l.trim()),
  );
  const body = bodyToChordPro(filteredBody);

  return meta.join('\n') + '\n\n' + body.join('\n') + '\n';
}

function titleCase(s) {
  return s
    .toLowerCase()
    .replace(/(^|[\s'-])(\p{L})/gu, (_, sep, ch) => sep + ch.toUpperCase());
}

function today() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function filenameFor(song) {
  const slug = song.slug;
  const qualifier = extractQualifier(song.header);
  const tomSlug = slugifyTom(song.header.key);
  const parts = [slug];
  if (qualifier) parts.push(qualifier);
  parts.push(tomSlug);
  return parts.join('.') + '.pro';
}

// ────────────────────────────────────────────────────────────────────────────
// 10. Main

function annotate(rawSongs) {
  return rawSongs.map((s) => {
    const features = extractFeatures(s);
    const cluster = clusterOf(s, features);
    const risks = riskFlags(s, features);
    return {
      ...s,
      slug: slugifyTitle(s.header.title),
      features,
      cluster,
      risks,
    };
  });
}

function runPhase0({ songs, canary, docxPath }) {
  const outDir = resolve(REPO_ROOT, 'docs/migration');
  mkdirSync(outDir, { recursive: true });
  const report = renderReport({ songs, canary, docxPath });
  writeFileSync(resolve(outDir, 'analysis-report.md'), report);
  writeFileSync(
    resolve(outDir, 'analysis-data.json'),
    JSON.stringify(
      songs.map((s) => ({
        slug: s.slug,
        section: s.section,
        cluster: s.cluster,
        risks: s.risks,
        lineNumber: s.lineNumber,
        header: s.header,
        features: s.features,
      })),
      null,
      2,
    ),
  );
  console.error(`Escrito: ${resolve(outDir, 'analysis-report.md')}`);
  console.error(`Escrito: ${resolve(outDir, 'analysis-data.json')}`);
}

function runPhase1({ canary }) {
  const outDir = resolve(REPO_ROOT, 'data/songs');
  mkdirSync(outDir, { recursive: true });
  const written = [];
  const skipped = [];
  for (const song of canary) {
    const filename = filenameFor(song);
    const target = resolve(outDir, filename);
    if (existsSync(target)) {
      skipped.push({ filename, reason: 'já existe' });
      continue;
    }
    const content = buildProContent(song, song.features.urls);
    writeFileSync(target, content);
    written.push(filename);
  }
  console.error(`Fase 1 — batch-canário:`);
  console.error(`  ${written.length} arquivos escritos em data/songs/`);
  console.error(`  ${skipped.length} pulados (já existiam)`);
  for (const w of written) console.error(`    + ${w}`);
  for (const s of skipped) console.error(`    ~ ${s.filename} (${s.reason})`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const docxPath = resolve(args.docx.replace(/^~/, process.env.HOME ?? ''));

  console.error(`Extraindo texto de ${docxPath}…`);
  const paragraphs = extractDocxText(docxPath);
  console.error(`  ${paragraphs.length} parágrafos.`);

  console.error('Segmentando em músicas…');
  const rawSongs = splitIntoSongs(paragraphs);
  console.error(`  ${rawSongs.length} músicas detectadas.`);

  const songs = annotate(rawSongs);
  const canary = pickCanaryBatch(songs);

  if (args.phase === '0') runPhase0({ songs, canary, docxPath });
  else runPhase1({ canary });
}

main();
