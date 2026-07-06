import ChordSheetJS from 'chordsheetjs';
import type { Song, SongLine } from '@/lib/cifra-parser/types';

const NOTES_SHARP = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
] as const;
const FLAT_TO_SHARP: Record<string, string> = {
  Db: 'C#', Eb: 'D#', Gb: 'F#', Ab: 'G#', Bb: 'A#',
};

function normalizeRoot(root: string): string {
  return FLAT_TO_SHARP[root] ?? root;
}

function tonicRoot(tom: string): string {
  const m = tom.match(/^([A-G])(#|b)?/);
  return m ? (m[1] + (m[2] ?? '')) : tom;
}

/**
 * Diferença em semitons entre dois tons — sempre no intervalo [0, 11] (modulo 12).
 * Representa "quantos semitons subir a partir de `from` pra chegar em `to`".
 *
 * Musicalmente equivalente a delta negativo módulo 12 — o ChordSheetJS
 * aplica módulo internamente ao transpor, então +7 e -5 dão o mesmo resultado.
 */
export function semitonesBetween(from: string, to: string): number {
  const fromRoot = normalizeRoot(tonicRoot(from));
  const toRoot = normalizeRoot(tonicRoot(to));
  const idx1 = (NOTES_SHARP as readonly string[]).indexOf(fromRoot);
  const idx2 = (NOTES_SHARP as readonly string[]).indexOf(toRoot);
  if (idx1 === -1 || idx2 === -1) return 0;
  return ((idx2 - idx1) + 12) % 12;
}

/**
 * Transpõe um único acorde por `delta` semitons, aplicando notação (# ou b).
 * Exposto pra outros módulos (ex.: transposição do texto ChordPro cru).
 */
export function transposeChordString(
  chord: string,
  delta: number,
  notation: 'sharp' | 'flat' = 'sharp',
): string {
  const SHARP_TO_FLAT: Record<string, string> = {
    'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb',
    'E#': 'F', 'B#': 'C',
  };
  const FLAT_TO_SHARP_MAP: Record<string, string> = {
    Db: 'C#', Eb: 'D#', Gb: 'F#', Ab: 'G#', Bb: 'A#',
    Cb: 'B', Fb: 'E',
  };
  const applyNotation = (chordStr: string): string => {
    const map = notation === 'flat' ? SHARP_TO_FLAT : FLAT_TO_SHARP_MAP;
    return chordStr.replace(/([A-G])(#|b)/g, (match) => map[match] ?? match);
  };
  const manualTranspose = (input: string): string => {
    return input.replace(/([A-G])(#|b)?/g, (match) => {
      const idx = (NOTES_SHARP as readonly string[]).indexOf(normalizeRoot(match));
      if (idx === -1) return match;
      const newIdx = (idx + delta + 12) % 12;
      return NOTES_SHARP[newIdx];
    });
  };
  try {
    const parsed = (ChordSheetJS as any).Chord.parse(chord);
    if (!parsed) return applyNotation(manualTranspose(chord));
    const shifted = delta === 0 ? parsed : parsed.transpose(delta);
    if (!shifted) return applyNotation(manualTranspose(chord));
    const raw = (shifted as { toString: () => string }).toString();
    return applyNotation(raw);
  } catch {
    return applyNotation(manualTranspose(chord));
  }
}

/**
 * Transpõe uma Song pro tom-alvo, mutando in-place os acordes das segments.
 * Preserva 100% dos metadados (sem passar por Formatter/roundtrip).
 *
 * @param notation — 'sharp' (padrão) usa `#` pras notas alteradas; 'flat' usa `b`.
 *                   Reflete o gosto do usuário: subir tom → sharp, descer → flat.
 */
export function transposeSong(
  song: Song,
  targetKey: string,
  notation: 'sharp' | 'flat' = 'sharp',
): Song {
  const delta = semitonesBetween(song.metadata.key, targetKey);
  const transposeChord = (chord: string): string =>
    transposeChordString(chord, delta, notation);

  if (delta === 0) {
    // Mesmo com delta 0, ainda queremos aplicar notação (ex: G# → Ab se flat)
    const newLines: SongLine[] = song.lines.map((line) => {
      if (line.kind !== 'lyric-with-chords') return line;
      return {
        ...line,
        segments: line.segments.map((seg) =>
          seg.chord ? { ...seg, chord: transposeChord(seg.chord) } : seg,
        ),
      };
    });
    return { ...song, metadata: { ...song.metadata, key: targetKey }, lines: newLines };
  }

  const newLines: SongLine[] = song.lines.map((line) => {
    if (line.kind !== 'lyric-with-chords') return line;
    return {
      ...line,
      segments: line.segments.map((seg) =>
        seg.chord ? { ...seg, chord: transposeChord(seg.chord) } : seg,
      ),
    };
  });

  return {
    ...song,
    metadata: { ...song.metadata, key: targetKey },
    lines: newLines,
  };
}
