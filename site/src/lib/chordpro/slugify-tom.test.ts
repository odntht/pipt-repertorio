import { describe, it, expect } from 'vitest';
import { slugifyTom, parseTom } from './slugify-tom';

describe('slugifyTom', () => {
  const cases: [string, string][] = [
    ['G', 'g'], ['A', 'a'], ['B', 'b'], ['C', 'c'],
    ['D', 'd'], ['E', 'e'], ['F', 'f'],
    ['G#', 'gs'], ['F#', 'fs'], ['C#', 'cs'],
    ['Bb', 'bb'], ['Ab', 'ab'], ['Eb', 'eb'],
    ['Am', 'am'], ['Bm', 'bm'], ['Gm', 'gm'],
    ['F#m', 'fsm'], ['C#m', 'csm'],
    ['Bbm', 'bbm'], ['Ebm', 'ebm'],
  ];
  it.each(cases)('slugifies %s → %s', (input, expected) => {
    expect(slugifyTom(input)).toBe(expected);
  });
});

describe('parseTom (inverso do slugify)', () => {
  it('recovers canonical tom from slug', () => {
    expect(parseTom('g')).toBe('G');
    expect(parseTom('bm')).toBe('Bm');
    expect(parseTom('fsm')).toBe('F#m');
    expect(parseTom('bb')).toBe('Bb');
    expect(parseTom('bbm')).toBe('Bbm');
  });
});
