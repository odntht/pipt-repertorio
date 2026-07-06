#!/usr/bin/env node
// Analisa cada .pro em data/songs/ e sugere tags de tema a partir do
// título + letra. Preserva tags existentes (não sobrescreve seeds).
//
// Uso: node scripts/tag-songs.mjs [--dry-run]

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const SONGS_DIR = resolve(REPO_ROOT, 'data/songs');

// Vocabulário de temas inspirado no índice por assunto do Hinário Novo
// Cântico (novocantico.com.br/indice/assunto). Cada tema é uma lista de
// regexes globais que pontuam sempre que batem. Regex distintos aumentam
// especificidade — evita falso-positivo em palavras comuns.
const THEMES = {
  // ── Louvor e Adoração ────────────────────────────────────────────────
  adoracao: [
    /ador(a|o|ando|ar|amos|ai)/gi,
    /adorar-te/gi,
    /prostrado/gi,
    /me\s+curvo/gi,
    /te\s+exalt/gi,
    /exaltado\s+seja/gi,
  ],
  louvor: [
    /louv(o|a|ar|amos|ai|arei|aremos|ando)/gi,
    /aleluia/gi,
    /cantarei/gi,
    /cantai/gi,
    /glorificar/gi,
    /glor[íi]a\s+a\s+deus/gi,
  ],
  gratidao: [
    /gratid[ãa]o/gi,
    /grato/gi,
    /agradec/gi,
    /a[çc][õo]es\s+de\s+gra[çc]a/gi,
    /obrigado,?\s+jesus/gi,
    /obrigado,?\s+senhor/gi,
  ],
  'deus-trino': [
    /trindade/gi,
    /pai,?\s+filho\s+e\s+esp[íi]rito/gi,
    /trino/gi,
    /pai,\s+filho/gi,
  ],
  'deus-criador': [
    /criador/gi,
    /criaste/gi,
    /criou/gi,
    /toda\s+cria[çc][ãa]o/gi,
    /obra\s+de\s+tuas?\s+m[ãa]os/gi,
    /o\s+universo/gi,
    /os\s+c[ée]us\s+e\s+a\s+terra/gi,
  ],
  'deus-providente': [
    /prov[ée]/gi,
    /prov[êe]s/gi,
    /provedor/gi,
    /sustent/gi,
    /provid[êe]nci/gi,
  ],
  'deus-fiel': [
    /fiel/gi,
    /fidelidade/gi,
    /nunca\s+falha/gi,
    /n[ãa]o\s+falha/gi,
  ],
  'deus-soberano': [
    /soberano/gi,
    /soberania/gi,
    /senhor\s+dos\s+senhores/gi,
    /rei\s+dos\s+reis/gi,
    /todo-?poderoso/gi,
    /onipoten/gi,
  ],
  santidade: [
    /\bsanto\b/gi,
    /santidade/gi,
    /santifica/gi,
    /consagra-me/gi,
    /puro\s+cora[çc][ãa]o/gi,
  ],
  'poder-de-deus': [
    /\bpoder\b/gi,
    /grande\s+for[çc]a/gi,
    /forte\s+e\s+poderoso/gi,
  ],

  // ── Confissão ────────────────────────────────────────────────────────
  arrependimento: [
    /arrepen/gi,
    /peca[dt]/gi,
    /pecador/gi,
    /confess/gi,
    /contri[çc][ãa]o/gi,
    /contrito/gi,
  ],
  perdao: [
    /perd[ãa]o/gi,
    /perdoar/gi,
    /perdoa/gi,
    /perdoou/gi,
    /perdoaste/gi,
    /purifica/gi,
  ],

  // ── Edificação ───────────────────────────────────────────────────────
  'santo-espirito': [
    /esp[íi]rito\s+santo/gi,
    /santo\s+esp[íi]rito/gi,
    /consolador/gi,
    /vento\s+forte/gi,
    /esp[íi]rito\s+de\s+deus/gi,
  ],
  'amor-de-deus': [
    /amor\s+de\s+deus/gi,
    /teu\s+amor/gi,
    /seu\s+amor/gi,
    /me\s+ama/gi,
    /ama-me/gi,
    /amor\s+eterno/gi,
    /amor\s+incondicional/gi,
  ],
  fe: [
    /\bf[ée]\b/gi,
    /crer/gi,
    /confio/gi,
    /confian[çc]a/gi,
    /confiar/gi,
  ],
  salvacao: [
    /salva[çc][ãa]o/gi,
    /salvador/gi,
    /me\s+salvou/gi,
    /salvaste/gi,
    /redime/gi,
    /redimiu/gi,
    /redentor/gi,
  ],
  testemunho: [
    /testemunh/gi,
    /testific/gi,
    /contarei\s+ao\s+mundo/gi,
    /narrarei/gi,
    /publicar[ãa]/gi,
  ],
  'companhia-do-senhor': [
    /est[áa]s\s+comigo/gi,
    /junto\s+de\s+mim/gi,
    /ao\s+meu\s+lado/gi,
    /nunca\s+me\s+deixa/gi,
    /vais\s+comigo/gi,
    /caminha\s+comigo/gi,
  ],
  oracao: [
    /ora[çc][ãa]o/gi,
    /orar/gi,
    /orei/gi,
    /orando/gi,
    /joelhos/gi,
    /clamo\s+a\s+ti/gi,
    /aos\s+seus\s+p[ée]s/gi,
    /rogar/gi,
  ],
  protecao: [
    /ref[úu]gio/gi,
    /escudo/gi,
    /torre\s+forte/gi,
    /me\s+guardas/gi,
    /me\s+guarda/gi,
    /minha\s+rocha/gi,
    /abrigo/gi,
    /alta\s+torre/gi,
  ],
  esperanca: [
    /esperan[çc]a/gi,
    /aguardar\s+em\s+ti/gi,
    /esperar\s+no\s+senhor/gi,
  ],
  paz: [
    /\bpaz\b/gi,
    /aquieta/gi,
    /descanso\s+em\s+ti/gi,
  ],
  alegria: [
    /alegria/gi,
    /alegres?/gi,
    /regozij/gi,
    /rejubila/gi,
    /jubilos/gi,
  ],
  vitoria: [
    /vit[óo]ria/gi,
    /venci/gi,
    /vencedor/gi,
    /conquistar/gi,
    /triunfante/gi,
    /venceremos/gi,
  ],
  'lar-celestial': [
    /\bc[ée]u\b/gi,
    /nos?\s+c[ée]us/gi,
    /mans[ãa]o/gi,
    /jerusal[ée]m\s+celeste/gi,
    /eterna\s+morada/gi,
    /vida\s+eterna/gi,
    /nova\s+jerusal[ée]m/gi,
    /cidade\s+santa/gi,
  ],

  // ── Consagração / Apelo ──────────────────────────────────────────────
  consagracao: [
    /consagra/gi,
    /me\s+entrego/gi,
    /entrego-me/gi,
    /entrega\s+total/gi,
    /rendido/gi,
    /submisso/gi,
    /submet/gi,
  ],
  convite: [
    /vem\s+a\s+jesus/gi,
    /vinde\s+a\s+mim/gi,
    /venha\s+a\s+cristo/gi,
    /hoje\s+[ée]\s+o\s+dia/gi,
    /aceita/gi,
    /decide/gi,
    /decis[ãa]o/gi,
    /clamai\s+ao\s+senhor/gi,
  ],

  // ── Cristo — Sua Vida ────────────────────────────────────────────────
  advento: [
    /advento/gi,
    /vem,?\s+senhor/gi,
    /esperado\s+de\s+todas\s+as/gi,
  ],
  natal: [
    /natal/gi,
    /manjedoura/gi,
    /bel[ée]m/gi,
    /nasceu\s+jesus/gi,
    /jesus\s+nasceu/gi,
    /noite\s+feliz/gi,
    /menino\s+jesus/gi,
    /rei\s+dos\s+reis[^,\.\n]{0,20}nasceu/gi,
  ],
  paixao: [
    /paix[ãa]o/gi,
    /padeceu/gi,
    /sofreu/gi,
    /crucific/gi,
    /via\s+dolorosa/gi,
    /getsemani/gi,
  ],
  ressurreicao: [
    /ressur/gi,
    /ele\s+vive/gi,
    /venceu\s+a\s+morte/gi,
    /tumba\s+vazia/gi,
    /pascoa/gi,
    /p[áa]scoa/gi,
  ],
  'segunda-vinda': [
    /vir[áa]\s+outra\s+vez/gi,
    /volta\s+de\s+cristo/gi,
    /volta\s+de\s+jesus/gi,
    /segunda\s+vinda/gi,
    /trombeta/gi,
    /nas\s+nuvens/gi,
    /jesus\s+vem/gi,
    /voltar[áa]/gi,
  ],
  'grande-comissao': [
    /ide\s+por\s+todo/gi,
    /todas\s+as\s+na[çc][õo]es/gi,
    /grande\s+comiss[ãa]o/gi,
  ],

  // ── Igreja — Seu Ministério ──────────────────────────────────────────
  igreja: [
    /\bigreja\b/gi,
    /corpo\s+de\s+cristo/gi,
    /seu\s+povo/gi,
    /o\s+povo\s+de\s+deus/gi,
    /povo\s+eleito/gi,
  ],
  evangelizacao: [
    /evangelh?o/gi,
    /pregar\s+a/gi,
    /anunciar\s+a/gi,
    /levar\s+a\s+palavra/gi,
    /boas\s+novas/gi,
    /miss[ãa]o/gi,
    /almas\s+p[ea]/gi,
  ],
  discipulado: [
    /disc[íi]pulo/gi,
    /seguir\s+a\s+cristo/gi,
    /seguir\s+a\s+jesus/gi,
    /andar\s+com\s+jesus/gi,
  ],
  batismo: [
    /batism/gi,
    /batiza/gi,
    /nas\s+[áa]guas/gi,
  ],
  'santa-ceia': [
    /santa\s+ceia/gi,
    /ceia\s+do\s+senhor/gi,
    /p[ãa]o\s+partido/gi,
    /c[áa]lice/gi,
    /vinho\s+e\s+p[ãa]o/gi,
    /corpo\s+e\s+sangue/gi,
    /da\s+ceia/gi,
  ],
  'dia-do-senhor': [
    /dia\s+do\s+senhor/gi,
    /santo\s+domingo/gi,
    /culto\s+dominic/gi,
  ],
  'trabalho-cristao': [
    /trabalh(o|adores?|amos)\s+(no|na|para)/gi,
    /servos?\s+de\s+cristo/gi,
    /servos?\s+de\s+jesus/gi,
    /obra\s+do\s+senhor/gi,
    /vinha\s+do\s+senhor/gi,
  ],

  // ── Assuntos diversos ────────────────────────────────────────────────
  biblia: [
    /\bb[íi]blia\b/gi,
    /palavra\s+de\s+deus/gi,
    /tua\s+palavra/gi,
    /a\s+escritura/gi,
    /sagrada\s+escritura/gi,
  ],
  'ano-novo': [
    /ano\s+novo/gi,
    /come[çc]o\s+de\s+ano/gi,
    /novos\s+dias/gi,
  ],
  casamento: [
    /matrimonial/gi,
    /matrimônio/gi,
    /noivos/gi,
    /casal/gi,
    /esposa/gi,
    /esposo/gi,
  ],
  'lar-cristao': [
    /lar\s+crist[ãa]o/gi,
    /lar\s+feliz/gi,
    /aben[çc]oa[st]?\s+meu\s+lar/gi,
    /nosso\s+lar/gi,
  ],
  familia: [
    /fam[íi]lia/gi,
    /filhos/gi,
    /nossos\s+filhos/gi,
  ],
  mae: [
    /\bm[ãa]e\b/gi,
    /m[ãa]es/gi,
    /dia\s+das\s+m[ãa]es/gi,
  ],

  // ── Meta / mais gerais ───────────────────────────────────────────────
  cruz: [
    /\bcruz\b/gi,
    /\bcruzes\b/gi,
    /calv[áa]rio/gi,
  ],
  'sangue-de-jesus': [
    /sangue/gi,
  ],
  graca: [
    /gra[çc]a\b/gi,
    /gra[çc]as?\s+divin/gi,
    /pela\s+gra[çc]a/gi,
    /gra[çc]a\s+de\s+deus/gi,
  ],
  reino: [
    /\breino\b/gi,
    /reina/gi,
    /reinar[áa]/gi,
  ],
  'boas-novas': [
    /boas\s+novas/gi,
    /aos\s+cansados/gi,
    /aos\s+aflitos/gi,
    /aos\s+necessitados/gi,
    /por\s+quem\s+padec/gi,
  ],
};

// Cada match conta como 1 ponto. Precisamos de pelo menos MIN_SCORE hits
// pro tema ser aceito — filtra menções passageiras.
const MIN_SCORE = 2;
// Limite de tags por música pra evitar spam.
const MAX_TAGS = 4;

// Extrai só o texto da letra (remove metadata, chord-only lines, [chord]
// markers e section-comments). Depois passa pra minúsculas + strip de
// acentos pra bater com regex.
function extractLyrics(content) {
  const lines = content.split('\n');
  const kept = [];
  for (const line of lines) {
    if (/^\s*\{/.test(line)) continue; // metadata ou comment
    // Remove [chord] markers
    const stripped = line.replace(/\[[^\]]+\]/g, '');
    if (stripped.trim() === '') continue;
    kept.push(stripped);
  }
  return kept.join('\n');
}

function isApproved(content) {
  return /^\{status:\s*aprovada\}/m.test(content);
}

function scoreThemes(text) {
  const scores = new Map();
  for (const [theme, regexes] of Object.entries(THEMES)) {
    let count = 0;
    for (const re of regexes) {
      const matches = text.match(re);
      if (matches) count += matches.length;
    }
    if (count >= MIN_SCORE) scores.set(theme, count);
  }
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_TAGS)
    .map(([t]) => t);
}

// Escreve `{tags: ...}` no arquivo: substitui a linha existente se houver,
// ou insere antes de `{added:...}`. Se `tags` vazio, remove a linha se
// existir e retorna o conteúdo sem tags.
function setTagsLine(content, tags) {
  const has = /^\{tags:[^}]*\}\n?/m.test(content);
  if (tags.length === 0) {
    return has ? content.replace(/^\{tags:[^}]*\}\n?/m, '') : content;
  }
  const tagsLine = `{tags: ${tags.join(', ')}}`;
  if (has) return content.replace(/^\{tags:[^}]*\}/m, tagsLine);
  if (/^\{added:/m.test(content)) {
    return content.replace(/^(\{added:)/m, `${tagsLine}\n$1`);
  }
  const idx = content.indexOf('\n\n');
  if (idx === -1) return content + '\n' + tagsLine;
  return content.slice(0, idx) + '\n' + tagsLine + content.slice(idx);
}

function main() {
  const dryRun = process.argv.includes('--dry-run');
  const files = readdirSync(SONGS_DIR).filter((f) => f.endsWith('.pro'));
  let updated = 0;
  let skipped = 0;
  let noTags = 0;
  const distribution = new Map();

  for (const filename of files) {
    const path = resolve(SONGS_DIR, filename);
    const content = readFileSync(path, 'utf-8');
    if (isApproved(content)) {
      skipped++;
      continue;
    }
    const titleMatch = content.match(/^\{title:\s*([^}]*)\}/m);
    const title = titleMatch ? titleMatch[1] : '';
    const lyrics = extractLyrics(content);
    const text = title + '\n' + lyrics;
    const tags = scoreThemes(text);
    if (tags.length === 0) noTags++;
    for (const t of tags) distribution.set(t, (distribution.get(t) ?? 0) + 1);
    if (!dryRun) {
      const next = setTagsLine(content, tags);
      writeFileSync(path, next);
    }
    updated++;
  }

  console.error(`Tag scan (${dryRun ? 'dry-run' : 'aplicado'}):`);
  console.error(`  ${updated} arquivos ${dryRun ? 'seriam atualizados' : 'atualizados'}`);
  console.error(`  ${skipped} pulados (já tinham tags)`);
  console.error(`  ${noTags} sem match (nenhum tema atingiu ${MIN_SCORE} hits)`);
  console.error('\nDistribuição de temas:');
  const sorted = [...distribution.entries()].sort((a, b) => b[1] - a[1]);
  for (const [t, n] of sorted) console.error(`  ${t.padEnd(20)} ${n}`);
}

main();
