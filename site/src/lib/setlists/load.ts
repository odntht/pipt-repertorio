/**
 * Parser mínimo de setlist YAML. Escopo fixo (event / date / songs[])
 * evita depender de biblioteca cheia. Ver spec §5.4.
 */

export interface SetlistSong {
  slug: string;
  /** Qualifier do arquivo `.pro`, ex.: 'v2', 'arranjo-1'. Vazio se não há. */
  qualifier?: string;
  tom: string;
  notes?: string;
  /** Momentos do culto: 'manha', 'noite', 'ceia', 'preludio', 'posludio'. */
  moments?: string[];
}
export interface Setlist {
  /** ex.: `2026-07-12.yml` — nome do arquivo em `data/setlists/`. */
  filename: string;
  /** Slug pra URL: filename sem `.yml`. */
  slug: string;
  event: string;
  date: string; // ISO 'YYYY-MM-DD'
  /** Soft-delete: se true, some da listagem principal mas o arquivo fica. */
  hidden: boolean;
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
  let hidden = false;
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
    if ((m = line.match(/^hidden:\s*(.*)$/))) {
      hidden = /^true$/i.test(stripQuotes(m[1].trim()));
      continue;
    }
    if (/^songs:\s*$/.test(line)) continue;
    if ((m = line.match(/^\s*-\s*slug:\s*(.*)$/))) {
      if (current) songs.push(current as SetlistSong);
      current = { slug: stripQuotes(m[1].trim()) };
      continue;
    }
    if ((m = line.match(/^\s+(tom|notes|qualifier):\s*(.*)$/))) {
      if (current) {
        (current as Record<string, string>)[m[1]] = stripQuotes(m[2].trim());
      }
      continue;
    }
    if ((m = line.match(/^\s+moments:\s*\[(.*)\]\s*$/))) {
      if (current) {
        current.moments = m[1]
          .split(',')
          .map((x) => stripQuotes(x.trim()))
          .filter((x) => x.length > 0);
      }
      continue;
    }
  }
  if (current) songs.push(current as SetlistSong);
  return { event, date, hidden, songs };
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
