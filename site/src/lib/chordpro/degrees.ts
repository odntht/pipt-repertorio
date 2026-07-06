/**
 * Converte acorde (ex.: "G", "Em7", "C9/E") em notação de grau (Roman numeral)
 * relativa a uma tonalidade — I, ii, iii, IV, V, vi, vii°, com variantes
 * alteradas (bII, #IV, etc.). Ver spec §4 (formato) e §5.2 (SongViewer).
 *
 * Regras:
 *   - Maiores em maiúscula (I, IV, V)
 *   - Menores em minúscula (ii, iii, vi)
 *   - Diminutos em minúscula com '°' (vii°)
 *   - Aumentados em maiúscula com '+'
 *   - Sufixos (7, 9, (11), sus, maj) preservados
 *   - Baixo /X mapeado pro grau correspondente
 */

const NOTES_SHARP = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
] as const;

// Normalização enarmônica — converte qualquer spelling de nota pra sharp/natural
// que existe em NOTES_SHARP.
const ENHARMONIC: Record<string, string> = {
  Db: 'C#', Eb: 'D#', Gb: 'F#', Ab: 'G#', Bb: 'A#',
  // Raros: notas alteradas que apontam pra naturais
  'E#': 'F', 'B#': 'C', Cb: 'B', Fb: 'E',
};

const MAJOR_DEGREE_MAP: Record<number, string> = {
  0: 'I',   1: 'bII',  2: 'II',
  3: 'bIII', 4: 'III',  5: 'IV',
  6: 'bV',  7: 'V',    8: 'bVI',
  9: 'VI',  10: 'bVII', 11: 'VII',
};

function normalizeRoot(root: string): string {
  return ENHARMONIC[root] ?? root;
}

function noteIndex(note: string): number {
  return (NOTES_SHARP as readonly string[]).indexOf(normalizeRoot(note));
}

export function chordToDegree(chord: string, keyTom: string): string {
  const keyMatch = keyTom.match(/^([A-G])(#|b)?/);
  if (!keyMatch) return chord;
  const idxKey = noteIndex(keyMatch[0]);
  if (idxKey === -1) return chord;

  // Parseia: root + acidente, resto do sufixo (tudo até `/`), e opcional
  // baixo. Deixa o "resto do sufixo" livre — cobre casos como `B7sus4`,
  // `Am7(11)`, `Cmaj7`, `Csus2`, etc. sem regex específica por sufixo.
  const m = chord.match(/^([A-G])(#|b)?([^\/]*)(?:\/([A-G])(#|b)?([^\/]*))?$/);
  if (!m) return chord;

  const root = m[1];
  const acc = m[2] ?? '';
  const suffix = m[3] ?? '';
  const bassRoot = m[4];
  const bassAcc = m[5] ?? '';

  const idxChord = noteIndex(root + acc);
  if (idxChord === -1) return chord;

  const interval = ((idxChord - idxKey) + 12) % 12;
  let degree = MAJOR_DEGREE_MAP[interval] ?? '?';

  // Qualidade principal do sufixo: só o começo importa pro case do numeral.
  const isMinor = /^m(?![a-z])/.test(suffix) || /^min\b/.test(suffix);
  const isDim = /^dim/.test(suffix) || /^[°º]/.test(suffix);
  if (isMinor || isDim) {
    degree = degree.replace(/[IVX]+/, (r) => r.toLowerCase());
  }

  // Normaliza o sufixo pra saída:
  //   `m` (sem letra depois) → '' (case do numeral já indica minor)
  //   `min` → ''
  //   `dim`/`º` → '°'
  //   `aug` → '+'
  //   Resto (`maj`, `sus`, números, tensões `(...)`) mantém.
  const cleanSuffix = suffix
    .replace(/^m(?![a-z])/, '')
    .replace(/^min\b/, '')
    .replace(/^dim/, '°')
    .replace(/^º/, '°')
    .replace(/^aug/, '+');

  let out = degree + cleanSuffix;

  if (bassRoot) {
    const idxBass = noteIndex(bassRoot + bassAcc);
    if (idxBass !== -1) {
      const bassInterval = ((idxBass - idxKey) + 12) % 12;
      out += '/' + (MAJOR_DEGREE_MAP[bassInterval] ?? '?');
    }
  }

  return out;
}
