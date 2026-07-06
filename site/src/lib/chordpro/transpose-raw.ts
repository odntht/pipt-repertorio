import { semitonesBetween, transposeChordString } from './transpose';

/**
 * Transpõe o texto ChordPro cru pra um novo tom, preservando o formato
 * original (indentação, comments, seções). Só troca os acordes dentro de
 * `[...]` e o header `{key: X}`.
 */
export function transposeRawChordPro(
  raw: string,
  targetKey: string,
  notation: 'sharp' | 'flat' = 'sharp',
): string {
  const keyMatch = raw.match(/^\{key:\s*([^}]*)\}/m);
  const sourceKey = keyMatch ? keyMatch[1].trim() : 'C';
  const delta = semitonesBetween(sourceKey, targetKey);

  const out = raw.replace(/\[([^\]]+)\]/g, (_match, chord) => {
    return `[${transposeChordString(chord, delta, notation)}]`;
  });

  if (keyMatch) {
    return out.replace(/^\{key:\s*[^}]*\}/m, `{key: ${targetKey}}`);
  }
  return out;
}

/**
 * Substitui um valor de header ChordPro (`{name: value}`). Se o header não
 * existir, retorna o texto sem alteração — o editor é responsável por avisar.
 * `}` é removido do valor pra não quebrar a delimitação do header.
 */
export function setHeader(raw: string, name: string, value: string): string {
  const clean = value.replace(/[}]/g, '').trim();
  const re = new RegExp(`^\\{${name}:\\s*[^}]*\\}`, 'm');
  if (re.test(raw)) {
    return raw.replace(re, `{${name}: ${clean}}`);
  }
  return raw;
}
