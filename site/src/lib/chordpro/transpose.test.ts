import { describe, it, expect } from 'vitest';
import { transposeSong, semitonesBetween } from './transpose';
import { parseChordPro } from '@/lib/cifra-parser';

const source = `{title: X}
{artist: Y}
{key: G}
{section: congregacional}
{status: aprovada}

[G]texto [D]outra [Em7]parte`;

describe('semitonesBetween (sempre positivo, módulo 12)', () => {
  const cases: [string, string, number][] = [
    ['G', 'A', 2],
    ['A', 'G', 10],     // musicalmente = descer 2 semitons; equivalente via módulo
    ['G', 'G', 0],
    ['C', 'G', 7],
    ['G', 'C', 5],      // = descer 7 semitons; equivalente
    ['F#m', 'G#m', 2],
    ['Bb', 'C', 2],     // Bb (=A#, idx 10) → C (idx 0) através da wrap
  ];
  it.each(cases)('%s → %s = %d semitones', (from, to, expected) => {
    expect(semitonesBetween(from, to)).toBe(expected);
  });
});

describe('transposeSong', () => {
  it('transposes G → A shifting each chord one whole tone up', () => {
    const song = parseChordPro(source);
    const transposed = transposeSong(song, 'A');
    expect(transposed.metadata.key).toBe('A');
    const lyricLine = transposed.lines.find((l) => l.kind === 'lyric-with-chords');
    const chords = lyricLine?.segments.map((s) => s.chord).filter(Boolean);
    expect(chords).toEqual(['A', 'E', 'F#m7']);
  });

  it('is idempotent when target key equals current key', () => {
    const song = parseChordPro(source);
    const transposed = transposeSong(song, 'G');
    const lyricLine = transposed.lines.find((l) => l.kind === 'lyric-with-chords');
    const chords = lyricLine?.segments.map((s) => s.chord).filter(Boolean);
    expect(chords).toEqual(['G', 'D', 'Em7']);
  });

  it('handles slash chords', () => {
    const src = `{title: X}\n{key: G}\n{section: congregacional}\n{status: aprovada}\n\n[D/F#]texto`;
    const song = parseChordPro(src);
    const transposed = transposeSong(song, 'A');
    const lyricLine = transposed.lines.find((l) => l.kind === 'lyric-with-chords');
    const chord = lyricLine?.segments[0].chord;
    expect(chord).toBe('E/G#');
  });

  it('preserves custom metadata (section, status, tags)', () => {
    const song = parseChordPro(source);
    const transposed = transposeSong(song, 'A');
    expect(transposed.metadata.section).toBe('congregacional');
    expect(transposed.metadata.status).toBe('aprovada');
    expect(transposed.metadata.title).toBe('X');
  });
});
