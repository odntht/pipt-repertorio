import { useMemo, useState } from 'react';

interface SongOption {
  slug: string;
  /** String vazia quando não há qualifier. Ex.: 'v2', 'arranjo-1', 'simples'. */
  qualifier: string;
  title: string;
  artist?: string;
  toms: string[];
  hinarioNum?: string;
  section: 'congregacional' | 'hinario' | 'infantil' | 'inadequada';
}

interface SetlistItem {
  slug: string;
  qualifier: string;
  tom: string;
  notes: string;
}

interface Props {
  base: string;
  songs: SongOption[];
}

const GITHUB_NEW_FILE =
  'https://github.com/odntht/pipt-repertorio/new/main/data/setlists';

function normalize(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function slugifyEvent(event: string): string {
  return normalize(event)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

function nextSunday(): string {
  const d = new Date();
  const day = d.getDay(); // 0=domingo
  const daysToAdd = day === 0 ? 0 : 7 - day;
  d.setDate(d.getDate() + daysToAdd);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function buildYaml(event: string, date: string, items: SetlistItem[]): string {
  const lines: string[] = [];
  lines.push(`event: "${event.replace(/"/g, '\\"')}"`);
  lines.push(`date: ${date}`);
  lines.push('songs:');
  for (const it of items) {
    lines.push(`  - slug: ${it.slug}`);
    if (it.qualifier) lines.push(`    qualifier: ${it.qualifier}`);
    lines.push(`    tom: ${it.tom.toLowerCase()}`);
    if (it.notes.trim()) {
      lines.push(`    notes: "${it.notes.replace(/"/g, '\\"')}"`);
    }
  }
  return lines.join('\n') + '\n';
}

// Rótulo pra distinguir variantes na dropdown (ex.: "v2" → "versão 2").
function prettyQualifier(q: string): string {
  if (!q) return '';
  const m1 = q.match(/^v(\d+)$/);
  if (m1) return `versão ${m1[1]}`;
  const m2 = q.match(/^arranjo-(\d+)$/);
  if (m2) return `arranjo ${m2[1]}`;
  if (q === 'versao') return 'versão';
  return q.replace(/-/g, ' ');
}

export default function SetlistEditor({ base, songs }: Props) {
  const [event, setEvent] = useState('Culto de Domingo');
  const [date, setDate] = useState(nextSunday());
  const [items, setItems] = useState<SetlistItem[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  const songByKey = useMemo(() => {
    const m = new Map<string, SongOption>();
    for (const s of songs) m.set(`${s.slug}::${s.qualifier}`, s);
    return m;
  }, [songs]);

  const searchResults = useMemo(() => {
    const q = normalize(search.trim());
    if (q === '') return [] as SongOption[];
    return songs
      .filter((s) => {
        const hay = normalize(
          `${s.title} ${s.artist ?? ''} ${s.hinarioNum ?? ''}`,
        );
        return hay.includes(q);
      })
      .slice(0, 12);
  }, [songs, search]);

  function addSong(s: SongOption) {
    setItems((prev) => [
      ...prev,
      { slug: s.slug, qualifier: s.qualifier, tom: s.toms[0], notes: '' },
    ]);
    setSearch('');
    setError(null);
  }

  function removeAt(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }
  function moveUp(idx: number) {
    if (idx === 0) return;
    setItems((prev) => {
      const next = prev.slice();
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  }
  function moveDown(idx: number) {
    setItems((prev) => {
      if (idx >= prev.length - 1) return prev;
      const next = prev.slice();
      [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
      return next;
    });
  }
  function updateItem(idx: number, patch: Partial<SetlistItem>) {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }

  const eventSlug = slugifyEvent(event);
  const filename =
    eventSlug && eventSlug !== 'culto-de-domingo'
      ? `${date}.${eventSlug}.yml`
      : `${date}.yml`;
  const yaml = buildYaml(event, date, items);

  function validate(): string | null {
    if (!event.trim()) return 'Preencha o nome do evento.';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return 'Data inválida.';
    if (items.length === 0) return 'Adicione pelo menos uma música.';
    for (const it of items) {
      if (!songByKey.has(`${it.slug}::${it.qualifier}`))
        return `Música desconhecida: ${it.slug}.`;
      if (!it.tom) return `Escolha um tom pra ${it.slug}.`;
    }
    return null;
  }

  function handleSave() {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    const url =
      `${GITHUB_NEW_FILE}?filename=${encodeURIComponent(filename)}` +
      `&value=${encodeURIComponent(yaml)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function handleDownload() {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    const blob = new Blob([yaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  const SECTION_LABEL: Record<SongOption['section'], string> = {
    congregacional: 'Congregacional',
    hinario: 'Hinário',
    infantil: 'Infantil',
    inadequada: 'Inadequada',
  };

  return (
    <div>
      <div className="grid gap-3 mb-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span>Evento</span>
          <input
            type="text"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            className="border rounded px-2 py-1 bg-white dark:bg-gray-800"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>Data</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded px-2 py-1 bg-white dark:bg-gray-800"
          />
        </label>
      </div>

      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
          Adicionar músicas
        </h2>
        <div className="relative">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar música pra adicionar…"
            className="w-full border rounded px-3 py-2 text-sm bg-white dark:bg-gray-800"
            aria-label="Buscar música pra adicionar"
          />
          {search && searchResults.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border rounded shadow-lg max-h-72 overflow-auto">
              {searchResults.map((s) => (
                <li key={`${s.slug}::${s.qualifier}`}>
                  <button
                    type="button"
                    onClick={() => addSong(s)}
                    className="flex justify-between w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <span>
                      <span className="font-semibold uppercase">
                        {s.hinarioNum && `HINO ${s.hinarioNum} – `}
                        {s.title}
                      </span>
                      {s.qualifier && (
                        <span className="text-xs text-mmu-green ml-2">
                          ({prettyQualifier(s.qualifier)})
                        </span>
                      )}
                      {s.artist && (
                        <span className="text-xs text-gray-500 ml-2">{s.artist}</span>
                      )}
                    </span>
                    <span className="text-xs text-gray-500">
                      {SECTION_LABEL[s.section]}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
        Ordem do culto ({items.length})
      </h2>
      {items.length === 0 ? (
        <p className="text-sm italic text-gray-500 mb-4">
          Nenhuma música ainda. Use a busca acima pra adicionar.
        </p>
      ) : (
        <ol className="space-y-2 mb-4">
          {items.map((it, idx) => {
            const song = songByKey.get(`${it.slug}::${it.qualifier}`);
            return (
              <li
                key={idx}
                className="border rounded p-3 flex flex-wrap items-start gap-3"
              >
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="px-2 py-1 text-xs border rounded disabled:opacity-30"
                    aria-label="Mover pra cima"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(idx)}
                    disabled={idx === items.length - 1}
                    className="px-2 py-1 text-xs border rounded disabled:opacity-30"
                    aria-label="Mover pra baixo"
                  >
                    ↓
                  </button>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <div className="font-semibold uppercase">
                    {song?.hinarioNum && `HINO ${song.hinarioNum} – `}
                    {song?.title ?? it.slug}
                    {it.qualifier && (
                      <span className="ml-2 text-xs text-mmu-green normal-case">
                        ({prettyQualifier(it.qualifier)})
                      </span>
                    )}
                  </div>
                  {song?.artist && (
                    <div className="text-xs text-gray-500">{song.artist}</div>
                  )}
                  <input
                    type="text"
                    value={it.notes}
                    onChange={(e) => updateItem(idx, { notes: e.target.value })}
                    placeholder="Observação (opcional): abertura, oferta, etc."
                    className="mt-2 w-full border rounded px-2 py-1 text-sm bg-white dark:bg-gray-800"
                  />
                </div>
                <label className="flex flex-col text-xs">
                  <span>Tom</span>
                  <select
                    value={it.tom}
                    onChange={(e) => updateItem(idx, { tom: e.target.value })}
                    className="border rounded px-2 py-1 bg-white dark:bg-gray-800"
                  >
                    {(song?.toms ?? [it.tom]).map((t) => (
                      <option key={t} value={t}>
                        {t.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  onClick={() => removeAt(idx)}
                  className="text-xs text-red-600 hover:underline"
                  aria-label="Remover"
                >
                  Remover
                </button>
              </li>
            );
          })}
        </ol>
      )}

      <details className="mb-4">
        <summary className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
          Ver YAML gerado ({filename})
        </summary>
        <pre className="mt-2 border rounded px-2 py-1 text-xs font-mono bg-gray-50 dark:bg-gray-900 overflow-auto">
          {yaml}
        </pre>
      </details>

      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400 mb-3">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3 items-center">
        <button
          onClick={handleSave}
          className="bg-mmu-green text-white px-4 py-2 rounded font-semibold hover:opacity-90"
        >
          Salvar no GitHub ↗
        </button>
        <button
          onClick={handleDownload}
          className="border rounded px-4 py-2"
        >
          Baixar .yml
        </button>
        <a
          href={`${base}setlists/`}
          className="text-sm text-gray-600 dark:text-gray-400 hover:underline ml-auto"
        >
          ← Voltar
        </a>
      </div>

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        “Salvar no GitHub” abre uma aba nova com o conteúdo pré-preenchido — você
        precisa estar logado no GitHub pra commitar (ou usar <em>Baixar .yml</em> e
        commit manual).
      </p>
    </div>
  );
}
