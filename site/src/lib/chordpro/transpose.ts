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
 * Transpõe uma Song pro tom-alvo, mutando in-place os acordes das segments.
 * Preserva 100% dos metadados (sem passar por Formatter/roundtrip).
 */
export function transposeSong(song: Song, targetKey: string): Song {
  const delta = semitonesBetween(song.metadata.key, targetKey);

  if (delta === 0) {
    return { ...song, metadata: { ...song.metadata, key: targetKey } };
  }

  const transposeChord = (chord: string): string => {
    try {
      // ChordSheetJS Chord.parse retorna Chord ou null
      const parsed = (ChordSheetJS as any).Chord.parse(chord);
      if (!parsed) return chord;
      const shifted = parsed.transpose(delta);
      return shifted ? shifted.toString() : chord;
    } catch {
      return chord;
    }
  };

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
