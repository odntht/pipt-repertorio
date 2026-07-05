import { parseChordPro } from '@/lib/cifra-parser';
import type { Song } from '@/lib/cifra-parser/types';
import { parseFilename } from './slug';

/**
 * Vite/Astro `import.meta.glob` — resolve em build-time, lê o conteúdo
 * como string via `?raw`. Elimina fragilidade de path relativo.
 */
const rawFiles = import.meta.glob<string>('/../data/songs/*.pro', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export interface SongEntry {
  slug: string;
  tom: string;
  qualifiers: string[];
  song: Song;
  filename: string;
}

let cached: SongEntry[] | null = null;

/**
 * Lê todos os arquivos .pro em data/songs/ e retorna array com AST parseado.
 * Chamado em build-time pelas páginas Astro (via getStaticPaths).
 */
export function loadAllSongs(): SongEntry[] {
  if (cached) return cached;
  const entries: SongEntry[] = [];
  for (const [path, raw] of Object.entries(rawFiles)) {
    const filename = path.split('/').pop()!;
    const parsed = parseFilename(filename);
    const song = parseChordPro(raw);
    entries.push({ ...parsed, song, filename });
  }
  cached = entries;
  return entries;
}

/** Retorna todas as versões (tons) de uma slug específica. */
export function loadSongVersions(slug: string): SongEntry[] {
  return loadAllSongs().filter((s) => s.slug === slug);
}
