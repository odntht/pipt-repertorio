/**
 * Parser mínimo de setlist YAML. Escopo fixo (event / date / songs[])
 * evita depender de biblioteca cheia. Ver spec §5.4.
 */

export interface SetlistSong {
  slug: string;
  tom: string;
  notes?: string;
}
export interface Setlist {
  /** ex.: `2026-07-12.yml` — nome do arquivo em `data/setlists/`. */
  filename: string;
  /** Slug pra URL: filename sem `.yml`. */
  slug: string;
  event: string;
  date: string; // ISO 'YYYY-MM-DD'
  songs: SetlistSong[];
}

const rawFiles = import.meta.glob<string>('/../data/setlists/*.yml', {
  query: '?raw',
  import: 'default',
  eager: true,
});

function stripQuotes(s: string): string {
  if (s.length >= 2) {
    const first = s[0];
    const last = s[s.length - 1];
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return s.slice(1, -1).replace(/\\"/g, '"');
    }
  }
  return s;
}

function parseSetlist(raw: string): Omit<Setlist, 'filename' | 'slug'> {
  let event = '';
  let date = '';
  const songs: SetlistSong[] = [];
  let current: Partial<SetlistSong> | null = null;

  for (const rawLine of raw.split('\n')) {
    const line = rawLine.replace(/\r$/, '');
    const trimmed = line.trim();
    if (trimmed === '' || trimmed.startsWith('#')) continue;

    let m: RegExpMatchArray | null;
    if ((m = line.match(/^event:\s*(.*)$/))) {
      event = stripQuotes(m[1].trim());
      continue;
    }
    if ((m = line.match(/^date:\s*(.*)$/))) {
      date = stripQuotes(m[1].trim());
      continue;
    }
    if (/^songs:\s*$/.test(line)) continue;
    if ((m = line.match(/^\s*-\s*slug:\s*(.*)$/))) {
      if (current) songs.push(current as SetlistSong);
      current = { slug: stripQuotes(m[1].trim()) };
      continue;
    }
    if ((m = line.match(/^\s+(tom|notes):\s*(.*)$/))) {
      if (current) {
        (current as Record<string, string>)[m[1]] = stripQuotes(m[2].trim());
      }
      continue;
    }
  }
  if (current) songs.push(current as SetlistSong);
  return { event, date, songs };
}

let cached: Setlist[] | null = null;
export function loadAllSetlists(): Setlist[] {
  if (cached) return cached;
  const out: Setlist[] = [];
  for (const [path, raw] of Object.entries(rawFiles)) {
    const filename = path.split('/').pop()!;
    const slug = filename.replace(/\.yml$/, '');
    out.push({ filename, slug, ...parseSetlist(raw) });
  }
  out.sort((a, b) => b.date.localeCompare(a.date));
  cached = out;
  return out;
}
