/**
 * Converte tom canônico ("G", "F#m", "Bb") em slug ("g", "fsm", "bb").
 * Ver spec §4.4.
 *
 * Regra formal: tom.toLowerCase().replace('#', 's')
 * Nota: "Bb" fica "bb" (root duplicada); é o preço de determinismo.
 */
export function slugifyTom(tom: string): string {
  return tom.toLowerCase().replace('#', 's');
}

/**
 * Reverte um slug de tom pro formato canônico.
 * Regra: primeira letra maiúscula; "s" logo após a letra da tônica → "#";
 * "m" no final permanece; "b" imediatamente após tônica é bemol.
 */
export function parseTom(slug: string): string {
  if (!slug || slug.length === 0) return '';
  const chars = slug.split('');
  const tonic = chars[0].toUpperCase();
  let rest = chars.slice(1).join('');
  if (rest.startsWith('s')) {
    rest = '#' + rest.slice(1);
  }
  return tonic + rest;
}
