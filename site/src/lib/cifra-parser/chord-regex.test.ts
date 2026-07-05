import { describe, it, expect } from 'vitest';
import { CHORD_REGEX, isChord } from './chord-regex';

describe('CHORD_REGEX / isChord', () => {
  describe('accepts common chord notations', () => {
    const chords = [
      'C', 'D', 'E', 'F', 'G', 'A', 'B',
      'Cm', 'Dm', 'Em', 'Fm', 'Gm', 'Am', 'Bm',
      'C#', 'D#', 'F#', 'G#', 'A#',
      'Bb', 'Db', 'Eb', 'Gb', 'Ab',
      'F#m', 'G#m', 'C#m', 'D#m',
      'Bbm', 'Ebm',
      'C7', 'Dm7', 'G7', 'Cmaj7', 'Gmaj7', 'Am7',
      'C9', 'D9', 'G9',
      'Em7(11)', 'C9(11)', 'Am7(9-13)',
      'D/F#', 'G/B', 'C/E', 'A/C#',
      'C9/E', 'D9/F#', 'Em7/G',
      'Cdim', 'Ddim', 'Gsus', 'Csus4', 'Dsus2',
      'Caug', 'Cmin', 'Dbº',
    ];
    it.each(chords)('accepts "%s"', (chord) => {
      expect(isChord(chord)).toBe(true);
    });
  });

  describe('rejects non-chord tokens', () => {
    const nonChords = [
      'hello', 'the', 'and', 'sing',
      '123', '', ' ',
      'X', 'Y', 'Z',
      'CC', 'GG',
      'Cxyz', 'D-major',
      '/G', '(', ')',
    ];
    it.each(nonChords)('rejects "%s"', (token) => {
      expect(isChord(token)).toBe(false);
    });
  });
});
