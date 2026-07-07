#!/usr/bin/env node
// Passa em cada .pro em data/songs/ e converte linhas de acorde em texto plano
// (fora de brackets) para notação ChordPro `[chord]lyric`. Preserva metadata,
// comentários e linhas já bracketizadas.
//
// Motivação: migrate-docx.mjs deixou várias músicas com linhas do tipo
// `A7+  C7+  Bm7  A7+` seguidas de letra sem colchete porque o CHORD_TOKEN_RE
// original não aceitava `+` como parte da extensão. Este script roda pós-fato
// nos .pro já commitados, sem tocar em docx nem em tags/status manualmente
// ajustados.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const SONGS_DIR = join(REPO_ROOT, 'data/songs');

const CHORD_TOKEN_RE =
  /^[A-G][#b]?(?:[mM\-+]|maj|min|dim|aug|sus|[°º0-9])*(?:\([^)]*\))?(?:\/(?:[A-G][#b]?(?:[mM\-+]|[°º0-9])*|[0-9]+))?$/;

function normalizeChord(chord) {
  return chord
    .replace(/^([A-G][#b]?)-/, '$1')
    .replace(/\/([A-G][#b]?)-/, '/$1');
}

function isChordOnlyLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return false;
  // Não considera linha já bracketizada (com `[`) como chord-only plain-text.
  if (trimmed.includes('[')) return false;
  const tokens = trimmed.split(/\s+/);
  if (tokens.length === 0) return false;
  return tokens.every((t) => CHORD_TOKEN_RE.test(t));
}

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
    out += padded.slice(cursor, col) + `[${normalizeChord(chord)}]`;
    cursor = col;
  }
  out += padded.slice(cursor);
  return out;
}

function chordLineToChordPro(chordLine) {
  const parts = [];
  const re = /\S+/g;
  let m;
  while ((m = re.exec(chordLine)) !== null) {
    parts.push(`[${normalizeChord(m[0])}]`);
  }
  return parts.join(' ');
}

// Separa header (bloco de {tags}) do corpo. Mantém tudo do primeiro non-
// metadata line em diante.
function splitHeaderBody(src) {
  const lines = src.split('\n');
  let i = 0;
  const header = [];
  while (i < lines.length) {
    const t = lines[i].trim();
    if (t === '' || t.startsWith('{')) {
      header.push(lines[i]);
      i++;
    } else {
      break;
    }
  }
  return { header, body: lines.slice(i) };
}

function processBody(bodyLines) {
  const out = [];
  let i = 0;
  let changes = 0;
  while (i < bodyLines.length) {
    const line = bodyLines[i];

    // Preserva linhas já ChordPro ou vazias.
    if (line.trim() === '' || line.trim().startsWith('{') || line.includes('[')) {
      out.push(line);
      i++;
      continue;
    }

    if (isChordOnlyLine(line)) {
      const next = bodyLines[i + 1];
      const nextIsLyric =
        next != null &&
        next.trim() !== '' &&
        !next.trim().startsWith('{') &&
        !next.includes('[') &&
        !isChordOnlyLine(next);
      if (nextIsLyric) {
        out.push(mergeChordOverLyric(line, next));
        changes++;
        i += 2;
        continue;
      }
      out.push(chordLineToChordPro(line));
      changes++;
      i++;
      continue;
    }

    out.push(line);
    i++;
  }
  return { lines: out, changes };
}

function main() {
  const files = readdirSync(SONGS_DIR).filter((f) => f.endsWith('.pro'));
  let touched = 0;
  let totalChanges = 0;
  const affected = [];
  for (const f of files) {
    const path = join(SONGS_DIR, f);
    const src = readFileSync(path, 'utf8');
    const { header, body } = splitHeaderBody(src);
    const { lines: newBody, changes } = processBody(body);
    if (changes === 0) continue;
    const trailing = src.endsWith('\n') ? '\n' : '';
    const rebuilt = [...header, ...newBody].join('\n').replace(/\n+$/, '') + trailing;
    writeFileSync(path, rebuilt);
    touched++;
    totalChanges += changes;
    affected.push(`${f} (${changes} conversões)`);
  }
  console.log(`\nRe-chordify concluído.`);
  console.log(`Arquivos alterados: ${touched}/${files.length}`);
  console.log(`Linhas convertidas: ${totalChanges}`);
  if (affected.length > 0) {
    console.log('\nArquivos afetados:');
    for (const line of affected) console.log(`  - ${line}`);
  }
}

main();
