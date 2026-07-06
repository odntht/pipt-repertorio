// Storage client-side de setlists (sem GitHub). Persiste em localStorage
// e roda 100% no navegador — pra quem não tem conta GitHub ou quer só
// montar rápido sem publicar.

export interface LocalSetlist {
  id: string;
  event: string;
  date: string;
  songs: Array<{
    slug: string;
    qualifier?: string;
    tom: string;
    notes?: string;
  }>;
  updatedAt: string; // ISO datetime
}

const KEY = 'pipt.setlists';

export function loadLocalSetlists(): LocalSetlist[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as LocalSetlist[];
  } catch {
    return [];
  }
}

function persist(list: LocalSetlist[]): void {
  window.localStorage.setItem(KEY, JSON.stringify(list));
}

export function saveLocalSetlist(sl: Omit<LocalSetlist, 'id' | 'updatedAt'> & {
  id?: string;
}): LocalSetlist {
  const list = loadLocalSetlists();
  const id = sl.id ?? crypto.randomUUID();
  const record: LocalSetlist = {
    ...sl,
    id,
    updatedAt: new Date().toISOString(),
  };
  const idx = list.findIndex((x) => x.id === id);
  if (idx >= 0) list[idx] = record;
  else list.push(record);
  persist(list);
  return record;
}

export function getLocalSetlist(id: string): LocalSetlist | null {
  return loadLocalSetlists().find((x) => x.id === id) ?? null;
}

export function deleteLocalSetlist(id: string): void {
  persist(loadLocalSetlists().filter((x) => x.id !== id));
}

// ── Compartilhamento por URL ────────────────────────────────────────────
// Serialização compacta: JSON → URI-encode. Fits in URL até ~10 músicas
// tranquilamente; setlists muito grandes podem estourar limite de 8KB de
// alguns servidores/browsers, mas GitHub Pages e a maioria dos clients
// aguentam ~30KB.

export function encodeSetlistForUrl(
  sl: Omit<LocalSetlist, 'id' | 'updatedAt'>,
): string {
  return encodeURIComponent(JSON.stringify(sl));
}

export function decodeSetlistFromUrl(
  payload: string,
): Omit<LocalSetlist, 'id' | 'updatedAt'> | null {
  try {
    const parsed = JSON.parse(decodeURIComponent(payload));
    if (
      typeof parsed !== 'object' ||
      parsed == null ||
      typeof parsed.event !== 'string' ||
      typeof parsed.date !== 'string' ||
      !Array.isArray(parsed.songs)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
