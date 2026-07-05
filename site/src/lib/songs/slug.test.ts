import { describe, it, expect } from 'vitest';
import { parseFilename } from './slug';

describe('parseFilename', () => {
  it('handles simple slug + tom', () => {
    expect(parseFilename('nada-alem-do-sangue.g.pro')).toEqual({
      slug: 'nada-alem-do-sangue',
      tom: 'g',
      qualifiers: [],
    });
  });

  it('handles multiple qualifiers before tom', () => {
    expect(parseFilename('em-espirito-em-verdade.arranjo-2.g.pro')).toEqual({
      slug: 'em-espirito-em-verdade',
      tom: 'g',
      qualifiers: ['arranjo-2'],
    });
  });

  it('handles sharp tom slug', () => {
    expect(parseFilename('ainda-que-a-figueira.fernandinho.fsm.pro')).toEqual({
      slug: 'ainda-que-a-figueira',
      tom: 'fsm',
      qualifiers: ['fernandinho'],
    });
  });

  it('rejects filename without .pro extension', () => {
    expect(() => parseFilename('foo.txt')).toThrow();
  });
});
