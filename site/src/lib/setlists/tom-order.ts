// Ordem cromática pra sortear tons no display de setlist. Enharmônicas
// (C#/Db, Eb/D#, etc.) recebem o mesmo índice. Modo (maior/menor, m)
// é ignorado — sort estável mantém a ordem de entrada como tiebreak.
const CHROMATIC: Record<string, number> = {
  c: 0, 'c#': 1, db: 1,
  d: 2, 'd#': 3, eb: 3,
  e: 4,
  f: 5, 'f#': 6, gb: 6,
  g: 7, 'g#': 8, ab: 8,
  a: 9, 'a#': 10, bb: 10,
  b: 11,
};

export function tomOrder(tom: string): number {
  const t = tom.toLowerCase();
  const m = t.match(/^([a-g][#b]?)/);
  if (!m) return 999;
  return CHROMATIC[m[1]] ?? 999;
}

export function sortByTom<T extends { tom: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => tomOrder(a.tom) - tomOrder(b.tom));
}
