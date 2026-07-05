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
