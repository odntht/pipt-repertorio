import { useEffect, useMemo, useState } from 'react';
import type { Song } from '@/lib/cifra-parser/types';
import SetlistPrintView, { type PrintItem } from './SetlistPrintView';
import {
  decodeSetlistFromUrl,
  getLocalSetlist,
  type LocalSetlist,
} from '@/lib/setlists/local';

interface SongPayload {
  slug: string;
  qualifier: string;
  tom: string;
  title: string;
  artist?: string;
  hinarioNum?: string;
  song: Song;
}

interface Props {
  songs: SongPayload[];
}

export default function LocalPrintLoader({ songs }: Props) {
  const [setlist, setSetlist] = useState<LocalSetlist | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const encoded = params.get('d');
    if (id) {
      const rec = getLocalSetlist(id);
      if (rec) setSetlist(rec);
      else setNotFound(true);
      return;
    }
    if (encoded) {
      const decoded = decodeSetlistFromUrl(encoded);
      if (decoded) {
        setSetlist({
          id: 'shared',
          updatedAt: new Date().toISOString(),
          ...decoded,
        });
      } else {
        setNotFound(true);
      }
      return;
    }
    setNotFound(true);
  }, []);

  const byFullKey = useMemo(() => {
    const m = new Map<string, SongPayload>();
    for (const s of songs) m.set(`${s.slug}::${s.qualifier}::${s.tom}`, s);
    return m;
  }, [songs]);

  const items: PrintItem[] = useMemo(() => {
    if (!setlist) return [];
    return setlist.songs.map((it) => {
      const qualifier = (it.qualifier ?? '').trim();
      const tom = it.tom.toLowerCase();
      const key = `${it.slug}::${qualifier}::${tom}`;
      const exact = byFullKey.get(key);
      const fallback = songs.find((s) => s.slug === it.slug);
      const meta = exact ?? fallback;
      return {
        slug: it.slug,
        qualifier,
        tom,
        notes: it.notes,
        moments: it.moments,
        title: meta?.title ?? it.slug,
        artist: meta?.artist,
        hinarioNum: meta?.hinarioNum,
        song: exact?.song ?? null,
      };
    });
  }, [setlist, byFullKey, songs]);

  if (notFound) {
    return (
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Setlist não encontrada. O link pode estar incompleto ou a setlist
        foi removida deste navegador.
      </p>
    );
  }

  if (!setlist) {
    return <p className="text-sm text-gray-500">Carregando…</p>;
  }

  return (
    <SetlistPrintView event={setlist.event} date={setlist.date} items={items} />
  );
}
