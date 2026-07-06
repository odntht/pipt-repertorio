import { describe, it, expect } from 'vitest';
import {
  transposeRawChordPro,
  setHeader,
  readHeader,
} from './transpose-raw';

const sample = `{title: Exemplo}
{artist: Fulano}
{key: G}
{section: congregacional}
{status: aprovada}

[G]primeira [D]linha [Em7]da música
    [C]segunda [G/B]linha`;

describe('readHeader', () => {
  it('lê o valor de um header existente', () => {
    expect(readHeader(sample, 'title')).toBe('Exemplo');
    expect(readHeader(sample, 'artist')).toBe('Fulano');
    expect(readHeader(sample, 'key')).toBe('G');
  });

  it('retorna string vazia quando o header não existe', () => {
    expect(readHeader(sample, 'ccli')).toBe('');
  });
});

describe('transposeRawChordPro', () => {
  it('transpõe todos os acordes preservando o formato original', () => {
    const out = transposeRawChordPro(sample, 'A');
    expect(out).toContain('{key: A}');
    expect(out).toContain('[A]primeira [E]linha [F#m7]da música');
    expect(out).toContain('    [D]segunda [A/C#]linha');
  });

  it('preserva indentação, seções e headers não-key', () => {
    const out = transposeRawChordPro(sample, 'A');
    expect(out).toContain('{title: Exemplo}');
    expect(out).toContain('{section: congregacional}');
    expect(out).toContain('    [D]');
  });

  it('respeita a notação flat quando pedido', () => {
    const out = transposeRawChordPro(sample, 'Bb', 'flat');
    expect(out).toContain('{key: Bb}');
    expect(out).toContain('[Bb]primeira [F]linha [Gm7]da música');
  });

  it('é idempotente quando o tom-alvo é o mesmo', () => {
    const out = transposeRawChordPro(sample, 'G');
    expect(out).toContain('{key: G}');
    expect(out).toContain('[G]primeira [D]linha [Em7]da música');
  });

  it('funciona sem header {key:} (assume C como origem)', () => {
    const raw = '[C]a [G]b';
    const out = transposeRawChordPro(raw, 'D');
    expect(out).toBe('[D]a [A]b');
  });
});

describe('setHeader', () => {
  it('substitui um header existente', () => {
    const out = setHeader(sample, 'title', 'Novo título');
    expect(out).toContain('{title: Novo título}');
    expect(out).not.toContain('{title: Exemplo}');
  });

  it('insere o header no topo quando não existe', () => {
    const out = setHeader(sample, 'ccli', '12345');
    expect(out.startsWith('{ccli: 12345}\n')).toBe(true);
    expect(out).toContain('{title: Exemplo}');
  });

  it('remove `}` e quebras de linha do valor', () => {
    const out = setHeader(sample, 'title', 'A}B\nC\rD');
    expect(out).toContain('{title: ABCD}');
  });

  it('faz trim do valor', () => {
    const out = setHeader(sample, 'title', '   com espaço   ');
    expect(out).toContain('{title: com espaço}');
  });

  it('insere header em texto vazio', () => {
    expect(setHeader('', 'title', 'X')).toBe('{title: X}');
  });
});
