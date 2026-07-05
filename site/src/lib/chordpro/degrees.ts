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

const FLAT_TO_SHARP: Record<string, string> = {
  Db: 'C#', Eb: 'D#', Gb: 'F#', Ab: 'G#', Bb: 'A#',
};

const MAJOR_DEGREE_MAP: Record<number, string> = {
  0: 'I',   1: 'bII',  2: 'II',
  3: 'bIII', 4: 'III',  5: 'IV',
  6: 'bV',  7: 'V',    8: 'bVI',
  9: 'VI',  10: 'bVII', 11: 'VII',
};

function normalizeRoot(root: string): string {
  return FLAT_TO_SHARP[root] ?? root;
}

function noteIndex(note: string): number {
  return (NOTES_SHARP as readonly string[]).indexOf(normalizeRoot(note));
}

export function chordToDegree(chord: string, keyTom: string): string {
  const keyMatch = keyTom.match(/^([A-G])(#|b)?/);
  if (!keyMatch) return chord;
  const idxKey = noteIndex(keyMatch[0]);
  if (idxKey === -1) return chord;

  const m = chord.match(
    /^([A-G])(#|b)?(m(?![a-z])|maj|min|dim|aug|sus|º)?([0-9]+)?(\((#|b)?[0-9]+([+-][0-9]+)?\))?(\/([A-G])(#|b)?)?$/,
  );
  if (!m) return chord;

  const root = m[1];
  const acc = m[2] ?? '';
  const qual = m[3];
  const num = m[4];
  const tension = m[5];
  const bassRoot = m[9];
  const bassAcc = m[10];

  const idxChord = noteIndex(root + acc);
  if (idxChord === -1) return chord;

  const interval = ((idxChord - idxKey) + 12) % 12;
  let degree = MAJOR_DEGREE_MAP[interval] ?? '?';

  const isMinor = qual === 'm' || qual === 'min';
  const isDim = qual === 'dim' || qual === 'º';
  const isAug = qual === 'aug';
  const isMaj = qual === 'maj';
  const isSus = qual === 'sus';

  if (isMinor || isDim) {
    degree = degree.replace(/[IVX]+/, (r) => r.toLowerCase());
  }

  let out = degree;
  if (isDim) out += '°';
  else if (isAug) out += '+';
  else if (isSus) out += 'sus';
  else if (isMaj) out += 'maj';
  if (num) out += num;
  if (tension) out += tension;

  if (bassRoot) {
    const idxBass = noteIndex(bassRoot + (bassAcc ?? ''));
    if (idxBass !== -1) {
      const bassInterval = ((idxBass - idxKey) + 12) % 12;
      out += '/' + (MAJOR_DEGREE_MAP[bassInterval] ?? '?');
    }
  }

  return out;
}
