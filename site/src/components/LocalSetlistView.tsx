import { useEffect, useMemo, useState } from 'react';
import {
  decodeSetlistFromUrl,
  deleteLocalSetlist,
  encodeSetlistForUrl,
  getLocalSetlist,
  saveLocalSetlist,
  type LocalSetlist,
} from '@/lib/setlists/local';

interface SongMeta {
  slug: string;
  qualifier: string;
  tom: string;
  title: string;
  hinarioNum?: string;
  artist?: string;
}

interface Props {
  base: string;
  songs: SongMeta[];
}

function formatDate(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

const MOMENT_LABELS: Record<string, string> = {
  manha: 'Manhã',
  noite: 'Noite',
  ceia: 'Ceia',
  preludio: 'Prelúdio',
  posludio: 'Poslúdio',
};

function buildYaml(sl: Omit<LocalSetlist, 'id' | 'updatedAt'>): string {
  const lines: string[] = [];
  lines.push(`event: "${sl.event.replace(/"/g, '\\"')}"`);
  lines.push(`date: ${sl.date}`);
  lines.push('songs:');
  for (const s of sl.songs) {
    lines.push(`  - slug: ${s.slug}`);
    if (s.qualifier) lines.push(`    qualifier: ${s.qualifier}`);
    lines.push(`    tom: ${s.tom.toLowerCase()}`);
    if (s.moments && s.moments.length > 0) {
      lines.push(`    moments: [${s.moments.join(', ')}]`);
    }
    if (s.notes) lines.push(`    notes: "${s.notes.replace(/"/g, '\\"')}"`);
  }
  return lines.join('\n') + '\n';
}

export default function LocalSetlistView({ base, songs }: Props) {
  const [setlist, setSetlist] = useState<LocalSetlist | null>(null);
  const [fromUrl, setFromUrl] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const encoded = params.get('d');
    if (id) {
      const record = getLocalSetlist(id);
      if (record) setSetlist(record);
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
        setFromUrl(true);
      } else {
        setNotFound(true);
      }
      return;
    }
    setNotFound(true);
  }, []);

  const songMap = useMemo(() => {
    const m = new Map<string, SongMeta>();
    for (const s of songs) m.set(`${s.slug}::${s.qualifier}::${s.tom}`, s);
    return m;
  }, [songs]);

  const resolvedItems = useMemo(() => {
    if (!setlist) return [];
    return setlist.songs.map((s) => {
      const key = `${s.slug}::${s.qualifier ?? ''}::${s.tom.toLowerCase()}`;
      const meta = songMap.get(key);
      // Fallback: qualquer versão com mesmo slug pra pelo menos exibir título.
      const fallback = meta
        ? undefined
        : songs.find((x) => x.slug === s.slug);
      return {
        ...s,
        title: meta?.title ?? fallback?.title ?? s.slug,
        hinarioNum: meta?.hinarioNum ?? fallback?.hinarioNum,
        artist: meta?.artist ?? fallback?.artist,
        hasFile: !!meta,
      };
    });
  }, [setlist, songMap, songs]);

  if (notFound) {
    return (
      <div className="text-sm text-gray-700 dark:text-gray-300">
        <p className="mb-4">
          Setlist não encontrada neste navegador. Ela pode ter sido removida ou
          o link está incompleto.
        </p>
        <a href={`${base}setlists/`} className="text-mmu-green hover:underline">
          Ver todas as setlists
        </a>
      </div>
    );
  }

  if (!setlist) {
    return <p className="text-sm text-gray-500">Carregando…</p>;
  }

  async function shareLink() {
    if (!setlist) return;
    const payload = encodeSetlistForUrl({
      event: setlist.event,
      date: setlist.date,
      songs: setlist.songs,
    });
    const url = `${window.location.origin}${base}setlists/local/?d=${payload}`;
    try {
      await navigator.clipboard.writeText(url);
      setHint('Link copiado. Cole em qualquer conversa — quem abrir vê a setlist sem precisar de conta GitHub.');
    } catch {
      setHint(`Link: ${url}`);
    }
  }

  function editHere() {
    if (!setlist) return;
    sessionStorage.setItem(
      'setlist.edit',
      JSON.stringify({
        source: 'local',
        id: setlist.id,
        event: setlist.event,
        date: setlist.date,
        songs: setlist.songs,
      }),
    );
    window.location.href = `${base}setlists/novo/`;
  }

  function saveToDevice() {
    if (!setlist) return;
    const record = saveLocalSetlist({
      event: setlist.event,
      date: setlist.date,
      songs: setlist.songs,
    });
    window.location.href = `${base}setlists/local/?id=${encodeURIComponent(record.id)}`;
  }

  function deleteHere() {
    if (!setlist) return;
    const ok = window.confirm(
      `Remover a setlist "${setlist.event}" (${setlist.date}) deste navegador?`,
    );
    if (!ok) return;
    deleteLocalSetlist(setlist.id);
    window.location.href = `${base}setlists/`;
  }

  // Link pra rota de print: preserva a origem (localStorage vs shared) via
  // query params — a rota de print decodifica igual à view atual.
  const printHref = (() => {
    if (!setlist) return `${base}setlists/`;
    if (fromUrl) {
      const payload = encodeSetlistForUrl({
        event: setlist.event,
        date: setlist.date,
        songs: setlist.songs,
      });
      return `${base}setlists/local-imprimir/?d=${payload}`;
    }
    return `${base}setlists/local-imprimir/?id=${encodeURIComponent(setlist.id)}`;
  })();

  function publishToGitHub() {
    if (!setlist) return;
    const yaml = buildYaml({
      event: setlist.event,
      date: setlist.date,
      songs: setlist.songs,
    });
    const filename = `${setlist.date}.yml`;
    const url =
      `https://github.com/odntht/pipt-repertorio/new/main/data/setlists` +
      `?filename=${encodeURIComponent(filename)}` +
      `&value=${encodeURIComponent(yaml)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <article>
      <header className="mb-4">
        <div className="flex flex-wrap items-baseline gap-2">
          <h1 className="text-2xl font-bold">{setlist.event}</h1>
          <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-mmu-green text-white no-print">
            {fromUrl ? 'Compartilhada' : 'Só neste navegador'}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(setlist.date)} · {setlist.songs.length} música
          {setlist.songs.length === 1 ? '' : 's'}
        </p>
        <a
          href={`${base}setlists/`}
          className="text-sm text-mmu-green hover:underline no-print"
        >
          ← Todas as setlists
        </a>
      </header>

      <ol className="space-y-3">
        {resolvedItems.map((item, i) => (
          <li key={i} className="border-b pb-3">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-gray-400 tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1">
                <a
                  href={
                    item.hasFile
                      ? `${base}musicas/${item.slug}/${item.tom.toLowerCase()}`
                      : '#'
                  }
                  className={
                    item.hasFile
                      ? 'font-semibold uppercase hover:text-mmu-green'
                      : 'font-semibold uppercase opacity-50'
                  }
                >
                  {item.hinarioNum && `HINO ${item.hinarioNum} – `}
                  {item.title}
                </a>
                <div className="text-sm text-gray-500 flex flex-wrap gap-2">
                  <span>
                    Tom: <strong>{item.tom.toUpperCase()}</strong>
                  </span>
                  {item.artist && <span>· {item.artist}</span>}
                  {!item.hasFile && (
                    <span className="text-red-600 dark:text-red-400">
                      ⚠ tom não encontrado
                    </span>
                  )}
                </div>
                {item.moments && item.moments.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.moments.map((m) => (
                      <span
                        key={m}
                        className="inline-block px-2 py-0.5 rounded text-xs bg-mmu-green/15 text-mmu-green"
                      >
                        {MOMENT_LABELS[m] ?? m}
                      </span>
                    ))}
                  </div>
                )}
                {item.notes && (
                  <p className="text-sm italic text-gray-600 dark:text-gray-400 mt-1">
                    {item.notes}
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-wrap gap-2 no-print">
        {fromUrl ? (
          <button
            onClick={saveToDevice}
            className="bg-mmu-green text-white px-3 py-2 rounded text-sm font-semibold hover:opacity-90"
          >
            Salvar neste navegador
          </button>
        ) : (
          <button
            onClick={editHere}
            className="text-sm border rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Editar
          </button>
        )}
        <a
          href={printHref}
          className="text-sm border rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Imprimir / PDF
        </a>
        <button
          onClick={shareLink}
          className="text-sm border rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Compartilhar link
        </button>
        <button
          onClick={publishToGitHub}
          className="text-sm border rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Publicar no GitHub ↗
        </button>
        {!fromUrl && (
          <button
            onClick={deleteHere}
            className="text-sm text-red-600 border border-red-300 dark:border-red-700 rounded px-3 py-2 hover:bg-red-50 dark:hover:bg-red-950"
          >
            Excluir
          </button>
        )}
      </div>
      {hint && (
        <p className="mt-3 text-sm text-mmu-green no-print break-all">{hint}</p>
      )}
    </article>
  );
}
