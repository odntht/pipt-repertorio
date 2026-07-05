import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { parseChordPro } from './parse';

const __dirname = dirname(fileURLToPath(import.meta.url));
const readFixture = (name: string): string =>
  readFileSync(join(__dirname, '__fixtures__', name), 'utf-8');

describe('parseChordPro', () => {
  it('parses a simple song fixture matching expected JSON', () => {
    const pro = readFixture('simple.pro');
    const expected = JSON.parse(readFixture('simple.expected.json'));
    const song = parseChordPro(pro);

    expect(song.metadata).toEqual(expected.metadata);
    expect(song.lines).toEqual(expected.lines);
    expect(song.raw).toBe(pro);
  });

  it('rejects when required metadata missing', () => {
    // REQUIRED = ['title', 'key', 'section', 'status'] — primeiro faltante é `key`
    expect(() => parseChordPro('{title: X}')).toThrow(/key/i);
    // Sem title, primeiro erro é title
    expect(() =>
      parseChordPro('{key: G}\n{section: congregacional}\n{status: aprovada}'),
    ).toThrow(/title/i);
  });

  it('accepts empty-value tags as placeholders', () => {
    const src = `{title: X}\n{artist: Y}\n{key: G}\n{section: congregacional}\n{status: aprovada}\n{tempo: }\n\n[G]texto`;
    const song = parseChordPro(src);
    expect(song.metadata.tempo).toBeNull();
  });

  it('parses multiple arrangement tags', () => {
    const src = `{title: X}\n{key: G}\n{section: congregacional}\n{status: aprovada}\n{arrangement: https://drive.google.com/a}\n{arrangement: https://drive.google.com/b | Live}\n\n[G]texto`;
    const song = parseChordPro(src);
    expect(song.metadata.arrangements).toHaveLength(2);
    expect(song.metadata.arrangements[1].label).toBe('Live');
  });

  it('preserves text without chords', () => {
    const src = `{title: X}\n{key: G}\n{section: congregacional}\n{status: aprovada}\n\nsó texto sem acordes`;
    const song = parseChordPro(src);
    expect(song.lines[1].kind).toBe('lyric-with-chords');
    expect(song.lines[1].segments).toEqual([{ text: 'só texto sem acordes' }]);
  });

  it('preserves leading whitespace before first chord (alignment)', () => {
    const src = `{title: X}\n{key: G}\n{section: congregacional}\n{status: aprovada}\n\n     [G]Teu sangue`;
    const song = parseChordPro(src);
    expect(song.lines[1].segments).toEqual([
      { text: '     ' },
      { chord: 'G', text: 'Teu sangue' },
    ]);
  });
});
