import { describe, it, expect } from 'vitest';
import { renderChordsOverLyrics } from './render';
import type { SongLine } from '@/lib/cifra-parser/types';

describe('renderChordsOverLyrics', () => {
  it('renders single segment with chord above lyric', () => {
    const line: SongLine = {
      kind: 'lyric-with-chords',
      segments: [{ chord: 'G', text: 'Hello world' }],
    };
    const out = renderChordsOverLyrics([line]);
    expect(out).toContain('G');
    expect(out).toContain('Hello world');
    const chordIdx = out.indexOf('G');
    const lyricIdx = out.indexOf('Hello');
    expect(chordIdx).toBeLessThan(lyricIdx);
  });

  it('aligns chord to correct column', () => {
    const line: SongLine = {
      kind: 'lyric-with-chords',
      segments: [
        { chord: 'G', text: 'Hello ' },
        { chord: 'D', text: 'world' },
      ],
    };
    const out = renderChordsOverLyrics([line]);
    const lines = out.split('\n').filter(Boolean);
    const chordRow = lines.find((l) => l.includes('G') && l.includes('D'));
    expect(chordRow).toBeDefined();
    const lyricRow = lines[lines.indexOf(chordRow!) + 1];
    expect(chordRow!.indexOf('D')).toBe(lyricRow.indexOf('w'));
  });

  it('renders section-comment as its own row without chord-like brackets', () => {
    const line: SongLine = {
      kind: 'section-comment',
      segments: [],
      comment: 'Refrão',
    };
    const out = renderChordsOverLyrics([line]);
    expect(out).toContain('Refrão');
    expect(out).not.toMatch(/\[Refrão\]/);
  });

  it('renders blank line as an empty line in the output', () => {
    const line: SongLine = { kind: 'blank', segments: [] };
    const line2: SongLine = {
      kind: 'lyric-with-chords',
      segments: [{ text: 'depois' }],
    };
    const out = renderChordsOverLyrics([line, line2]);
    const rows = out.split('\n');
    expect(rows[0]).toBe('');
    expect(rows[rows.length - 1]).toBe('depois');
  });
});
