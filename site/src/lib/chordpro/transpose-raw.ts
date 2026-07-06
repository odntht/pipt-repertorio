import { semitonesBetween, transposeChordString } from './transpose';

/**
 * Lê o valor de um header ChordPro (`{name: value}`). Retorna `''` se não
 * existir. Não faz `trim` além dos espaços em volta do valor original.
 */
export function readHeader(raw: string, name: string): string {
  const m = raw.match(new RegExp(`^\\{${name}:\\s*([^}]*)\\}`, 'm'));
  return m ? m[1].trim() : '';
}

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
 * Upsert de um header ChordPro (`{name: value}`). Se já existir, substitui
 * o valor; se não existir, insere no topo do arquivo. `}` e quebras de linha
 * são removidos do valor pra não quebrar o formato.
 */
export function setHeader(raw: string, name: string, value: string): string {
  const clean = value.replace(/[}\r\n]/g, '').trim();
  const re = new RegExp(`^\\{${name}:\\s*[^}]*\\}`, 'm');
  const header = `{${name}: ${clean}}`;
  if (re.test(raw)) {
    return raw.replace(re, header);
  }
  return raw.length > 0 ? `${header}\n${raw}` : header;
}
