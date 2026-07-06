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

// Cada tema é uma lista de regexes que "pontuam" quando batem no texto.
// Regex globais (com /gi) — todas as ocorrências contam pra pontuação.
// Diacríticos ficam explícitos porque o texto original preserva acentos.
const THEMES = {
  adoracao: [
    /ador(a|o|ando|ar|amos|ai)/gi,
    /adorar-te/gi,
    /adorar[a-zãáâéêíóôõúç]*/gi,
    /prostrado/gi,
    /me\s+curvo/gi,
  ],
  louvor: [
    /louv(o|a|ar|amos|ai|arei|aremos|ando)/gi,
    /aleluia/gi,
    /cantarei/gi,
    /cantai/gi,
    /levanto\s+meu\s+louvor/gi,
    /glorificar/gi,
  ],
  gratidao: [
    /gratid[ãa]o/gi,
    /grato/gi,
    /agradec/gi,
    /a[çc][õo]es\s+de\s+gra[çc]a/gi,
    /obrigado,?\s+jesus/gi,
    /obrigado,?\s+senhor/gi,
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
  cruz: [
    /cruz/gi,
    /calv[áa]rio/gi,
    /crucific/gi,
  ],
  'sangue-de-jesus': [
    /sangue/gi,
  ],
  graca: [
    /gra[çc]a\b/gi,
    /gra[çc]as?\s+divin/gi,
    /pela\s+gra[çc]a/gi,
  ],
  'amor-de-deus': [
    /amor\s+de\s+deus/gi,
    /o\s+amor/gi,
    /me\s+ama/gi,
    /ama-me/gi,
    /amor\s+eterno/gi,
    /amor\s+incondicional/gi,
    /teu\s+amor/gi,
    /seu\s+amor/gi,
  ],
  fe: [
    /\bf[ée]\b/gi,
    /crer/gi,
    /confio/gi,
    /confiança/gi,
    /confiar/gi,
  ],
  esperanca: [
    /esperan[çc]a/gi,
    /esperar/gi,
  ],
  santidade: [
    /\bsanto\b/gi,
    /santidade/gi,
    /santifica/gi,
  ],
  'poder-de-deus': [
    /\bpoder\b/gi,
    /todo-?poderoso/gi,
    /onipoten/gi,
    /soberano/gi,
    /soberania/gi,
  ],
  vitoria: [
    /vit[óo]ria/gi,
    /venci/gi,
    /vencedor/gi,
    /conquistar/gi,
    /triunfante/gi,
  ],
  consagracao: [
    /consagra/gi,
    /me\s+entrego/gi,
    /entrego-me/gi,
    /entrega\s+total/gi,
    /rendido/gi,
    /rende-te/gi,
  ],
  arrependimento: [
    /arrepen/gi,
    /peca[dt]/gi,
    /pecador/gi,
    /confess/gi,
  ],
  perdao: [
    /perd[ãa]o/gi,
    /perdoar/gi,
    /perdoa/gi,
    /perdoou/gi,
    /perdoaste/gi,
  ],
  'santo-espirito': [
    /esp[íi]rito\s+santo/gi,
    /santo\s+esp[íi]rito/gi,
    /consolador/gi,
    /vento\s+forte/gi,
  ],
  natal: [
    /natal/gi,
    /manjedoura/gi,
    /bel[ée]m/gi,
    /nasceu\s+jesus/gi,
    /jesus\s+nasceu/gi,
    /noite\s+feliz/gi,
    /menino\s+jesus/gi,
    /rei\s+dos\s+reis[^,\.]*nasceu/gi,
  ],
  pascoa: [
    /p[áa]scoa/gi,
    /ressur/gi,
    /ele\s+vive/gi,
    /venceu\s+a\s+morte/gi,
    /tumba\s+vazia/gi,
    /venceu\s+a\s+cruz/gi,
  ],
  'segunda-vinda': [
    /virá\s+outra\s+vez/gi,
    /volta\s+de\s+cristo/gi,
    /volta\s+de\s+jesus/gi,
    /segunda\s+vinda/gi,
    /trombeta/gi,
    /nas\s+nuvens/gi,
    /vem\s+vindo/gi,
  ],
  oracao: [
    /ora[çc][ãa]o/gi,
    /orar/gi,
    /or(o|amos|ei)\b/gi,
    /joelhos/gi,
    /clamo\s+a\s+ti/gi,
    /aos\s+seus\s+p[ée]s/gi,
  ],
  paz: [
    /\bpaz\b/gi,
    /aquieta/gi,
    /descanso\s+em/gi,
  ],
  alegria: [
    /alegria/gi,
    /alegres?/gi,
    /regozij/gi,
    /rejubila/gi,
  ],
  'jesus-cristo': [
    /\bjesus\b/gi,
    /\bcristo\b/gi,
    /messias/gi,
    /cordeiro/gi,
    /emanuel/gi,
    /emmanuel/gi,
  ],
  reino: [
    /reino/gi,
    /reina/gi,
  ],
  familia: [
    /fam[íi]lia/gi,
    /lar\b/gi,
    /filhos/gi,
  ],
  'santa-ceia': [
    /santa\s+ceia/gi,
    /p[ãa]o\s+partido/gi,
    /c[áa]lice/gi,
    /vinho\s+e\s+p[ãa]o/gi,
    /corpo\s+e\s+sangue/gi,
  ],
  batismo: [
    /batism/gi,
    /batiza/gi,
    /nas\s+[áa]guas/gi,
  ],
  missoes: [
    /miss[ãa]o/gi,
    /ide\s+por\s+todo/gi,
    /todas\s+as\s+na[çc][õo]es/gi,
    /evangelh?o/gi,
    /pregar/gi,
    /anunciar\s+a/gi,
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

function hasExistingTags(content) {
  const m = content.match(/^\{tags:\s*([^}]*)\}/m);
  return !!m && m[1].trim().length > 0;
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

function insertTagsLine(content, tags) {
  const tagsLine = `{tags: ${tags.join(', ')}}`;
  // Insere antes de {added:...} (ancoragem estável). Fallback: no fim
  // do bloco de metadata.
  if (/^\{added:/m.test(content)) {
    return content.replace(/^(\{added:)/m, `${tagsLine}\n$1`);
  }
  // Insere depois da primeira linha em branco após o cabeçalho.
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
    if (hasExistingTags(content)) {
      skipped++;
      continue;
    }
    // Título entra no texto pra ajudar (2x peso implicitamente pq costuma
    // repetir na letra também).
    const titleMatch = content.match(/^\{title:\s*([^}]*)\}/m);
    const title = titleMatch ? titleMatch[1] : '';
    const lyrics = extractLyrics(content);
    const text = title + '\n' + lyrics;
    const tags = scoreThemes(text);
    if (tags.length === 0) {
      noTags++;
      continue;
    }
    for (const t of tags) distribution.set(t, (distribution.get(t) ?? 0) + 1);
    if (!dryRun) {
      const next = insertTagsLine(content, tags);
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
