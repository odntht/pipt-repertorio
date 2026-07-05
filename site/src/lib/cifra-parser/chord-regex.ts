/**
 * Regex canônico de acorde. Fonte da verdade — usada pelo parser e pela UI
 * de submissão (Plano C). Ver spec §5.5.
 */
const CHORD_PATTERN =
  '^[A-G]' +
  '(#|b)?' +
  '(m(?![a-z])|maj|min|dim|aug|sus|º)?' +
  '[0-9]*' +
  '(\\((#|b)?[0-9]+([+-][0-9]+)?\\))?' +
  '(\\/[A-G](#|b)?)?' +
  '$';

export const CHORD_REGEX = new RegExp(CHORD_PATTERN);

export function isChord(token: string): boolean {
  if (!token || token.length === 0) return false;
  return CHORD_REGEX.test(token);
}
