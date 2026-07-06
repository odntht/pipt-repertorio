import { describe, it, expect } from 'vitest';
import { chordToDegree } from './degrees';

describe('chordToDegree in G major', () => {
  const key = 'G';
  const cases: [string, string][] = [
    ['G', 'I'],
    ['Am', 'ii'],
    ['Bm', 'iii'],
    ['C', 'IV'],
    ['D', 'V'],
    ['Em', 'vi'],
    ['F#dim', 'vii°'],
    // Com sufixos
    ['Em7', 'vi7'],
    ['C9', 'IV9'],
    ['D7', 'V7'],
    ['Am7', 'ii7'],
    ['Em7(11)', 'vi7(11)'],
    // Slash
    ['G/B', 'I/III'],
    ['C9/E', 'IV9/VI'],
    ['D/F#', 'V/VII'],
    // Alterados
    ['Ab', 'bII'],
    ['Dbº', 'bv°'],
  ];
  it.each(cases)('%s → %s', (chord, expected) => {
    expect(chordToDegree(chord, key)).toBe(expected);
  });
});

describe('chordToDegree in different keys', () => {
  it('in D major, A is V', () => {
    expect(chordToDegree('A', 'D')).toBe('V');
  });
  it('in Bb major, Eb is IV', () => {
    expect(chordToDegree('Eb', 'Bb')).toBe('IV');
  });
});

describe('chordToDegree com sufixos após o número', () => {
  it('B7sus4 in E é V7sus4', () => {
    expect(chordToDegree('B7sus4', 'E')).toBe('V7sus4');
  });
  it('Csus4 in C é Isus4', () => {
    expect(chordToDegree('Csus4', 'C')).toBe('Isus4');
  });
  it('Cmaj7 in C é Imaj7', () => {
    expect(chordToDegree('Cmaj7', 'C')).toBe('Imaj7');
  });
  it('Am7add9 in G é ii7add9', () => {
    expect(chordToDegree('Am7add9', 'G')).toBe('ii7add9');
  });
  it('D7sus in G é V7sus', () => {
    expect(chordToDegree('D7sus', 'G')).toBe('V7sus');
  });
});

describe('chordToDegree com enarmônicos raros', () => {
  // E# = F. Em Ab (idx 8), F (idx 5) é vi natural.
  // Interval = (5-8+12)%12 = 9 → VI. Sem 'm' na string original, fica maiúsculo.
  it('E# in Ab é VI', () => {
    expect(chordToDegree('E#', 'Ab')).toBe('VI');
  });
  // E#m7(11) em Ab → vi7(11) (com minor)
  it('E#m7(11) in Ab é vi7(11)', () => {
    expect(chordToDegree('E#m7(11)', 'Ab')).toBe('vi7(11)');
  });
  // B# = C. Em G (idx 7), C (idx 0) é IV.
  it('B# in G é IV', () => {
    expect(chordToDegree('B#', 'G')).toBe('IV');
  });
});

