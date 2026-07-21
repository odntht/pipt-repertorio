import { useEffect, useMemo, useState } from 'react';
import { saveLocalSetlist } from '@/lib/setlists/local';

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
  moments: string[];
}

const MOMENT_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'manha', label: 'Manhã' },
  { value: 'noite', label: 'Noite' },
  { value: 'ceia', label: 'Ceia' },
  { value: 'preludio', label: 'Prelúdio' },
  { value: 'posludio', label: 'Poslúdio' },
];

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
    if (it.moments.length > 0) {
      lines.push(`    moments: [${it.moments.join(', ')}]`);
    }
    if (it.notes.trim()) {
      lines.push(`    notes: "${it.notes.replace(/"/g, '\\"')}"`);
    }
  }
  return lines.join('\n') + '\n';
}

// Rótulo pra distinguir variantes na dropdown. v1 é default (sem rótulo);
// v2+ vira compacto "v2"; versao-<nome> vira "v. Nome".
function prettyQualifier(q: string): string {
  if (!q) return '';
  if (q === 'v1') return '';
  const mV = q.match(/^v(\d+)$/);
  if (mV) return `v${mV[1]}`;
  const mNamed = q.match(/^versao-(.+)$/);
  if (mNamed) {
    return `v. ${mNamed[1]
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')}`;
  }
  const mA = q.match(/^arranjo-(\d+)$/);
  if (mA) return `arranjo ${mA[1]}`;
  // 'versao' bare permanece rotulado — colide com variante sem qualifier.
  if (q === 'versao') return 'versão';
  return q.replace(/-/g, ' ');
}

// Padrões incluídos por default em qualquer setlist nova — usuário
// pode remover como qualquer outra música. Match com data/songs/triplice-amem*.
const DEFAULT_ITEMS: SetlistItem[] = [
  { slug: 'triplice-amem', qualifier: '', tom: 'g', notes: '', moments: [] },
  { slug: 'triplice-amem', qualifier: 'v2', tom: 'g', notes: '', moments: [] },
];

export default function SetlistEditor({ base, songs }: Props) {
  const [event, setEvent] = useState('Culto de Domingo');
  const [date, setDate] = useState(nextSunday());
  const [items, setItems] = useState<SetlistItem[]>(DEFAULT_ITEMS);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [editingFilename, setEditingFilename] = useState<string | null>(null);
  const [editingLocalId, setEditingLocalId] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('setlist.edit');
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as {
        source?: 'committed' | 'local';
        filename?: string;
        id?: string;
        event: string;
        date: string;
        songs: Array<{
          slug: string;
          qualifier?: string;
          tom: string;
          notes?: string;
          moments?: string[];
        }>;
      };
      if (parsed.source === 'local' && parsed.id) {
        setEditingLocalId(parsed.id);
      } else if (parsed.filename) {
        setEditingFilename(parsed.filename);
      }
      setEvent(parsed.event);
      setDate(parsed.date);
      setItems(
        parsed.songs.map((s) => ({
          slug: s.slug,
          qualifier: s.qualifier ?? '',
          tom: s.tom,
          notes: s.notes ?? '',
          moments: Array.isArray(s.moments) ? s.moments : [],
        })),
      );
      sessionStorage.removeItem('setlist.edit');
    } catch {
      // silencia — usuário volta pra novo em branco
    }
  }, []);

  const songByKey = useMemo(() => {
    const m = new Map<string, SongOption>();
    for (const s of songs) m.set(`${s.slug}::${s.qualifier}`, s);
    return m;
  }, [songs]);

  // Chaves (slug::qualifier) já adicionadas — filtram só a versão exata da
  // busca. Outras versões do mesmo slug continuam aparecendo.
  const addedKeys = useMemo(
    () => new Set(items.map((it) => `${it.slug}::${it.qualifier}`)),
    [items],
  );

  const searchResults = useMemo(() => {
    const q = normalize(search.trim());
    if (q === '') return [] as SongOption[];
    return songs
      .filter((s) => {
        if (addedKeys.has(`${s.slug}::${s.qualifier}`)) return false;
        const hay = normalize(
          `${s.title} ${s.artist ?? ''} ${s.hinarioNum ?? ''}`,
        );
        return hay.includes(q);
      })
      .slice(0, 12);
  }, [songs, search, addedKeys]);

  function addSong(s: SongOption) {
    setItems((prev) => [
      ...prev,
      {
        slug: s.slug,
        qualifier: s.qualifier,
        tom: s.toms[0],
        notes: '',
        moments: [],
      },
    ]);
    setSearch('');
    setError(null);
  }

  function toggleMoment(idx: number, moment: string) {
    setItems((prev) =>
      prev.map((it, i) => {
        if (i !== idx) return it;
        const has = it.moments.includes(moment);
        return {
          ...it,
          moments: has
            ? it.moments.filter((m) => m !== moment)
            : [...it.moments, moment],
        };
      }),
    );
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

  function handleSaveLocal() {
    const err = validate();
    if (err) {
      setError(err);
      setHint(null);
      return;
    }
    setError(null);
    const record = saveLocalSetlist({
      id: editingLocalId ?? undefined,
      event,
      date,
      songs: items.map((it) => ({
        slug: it.slug,
        qualifier: it.qualifier || undefined,
        tom: it.tom.toLowerCase(),
        notes: it.notes.trim() || undefined,
        moments: it.moments.length > 0 ? it.moments : undefined,
      })),
    });
    window.location.href = `${base}setlists/local/?id=${encodeURIComponent(record.id)}`;
  }

  async function handleSave() {
    const err = validate();
    if (err) {
      setError(err);
      setHint(null);
      return;
    }
    setError(null);
    if (editingFilename) {
      // Edit mode: GitHub não aceita prefill em URL de edit. Copia o YAML
      // pro clipboard e abre a página de edit — usuário cola (Cmd+A → Cmd+V).
      try {
        await navigator.clipboard.writeText(yaml);
        setHint(
          `YAML copiado. Cole na aba do GitHub que abriu (Cmd+A pra selecionar tudo, depois Cmd+V).`,
        );
      } catch {
        setHint(
          `Copie o YAML manualmente do bloco acima e cole no editor do GitHub.`,
        );
      }
      window.open(
        `https://github.com/odntht/pipt-repertorio/edit/main/data/setlists/${editingFilename}`,
        '_blank',
        'noopener,noreferrer',
      );
      return;
    }
    // Create mode: usa o prefill de new file (funciona pra arquivos novos).
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
      {editingFilename && (
        <div className="mb-4 rounded border border-mmu-green bg-mmu-green/10 px-3 py-2 text-sm">
          Editando <strong>{editingFilename}</strong>. Ao salvar no GitHub, o
          YAML novo é copiado pro clipboard e a página de edit do arquivo abre
          — você cola por cima do conteúdo antigo.
        </div>
      )}
      {editingLocalId && (
        <div className="mb-4 rounded border border-mmu-green bg-mmu-green/10 px-3 py-2 text-sm">
          Editando setlist salva no seu navegador. Alterações ficam só neste
          dispositivo até você publicar no GitHub.
        </div>
      )}
      <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        <strong>Salvar no navegador</strong> guarda a setlist só neste
        dispositivo (não precisa de conta GitHub). <strong>Publicar no
        GitHub</strong> deixa disponível pra todo mundo depois do commit.
      </p>
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
              {searchResults.map((s) => {
                const qLabel = prettyQualifier(s.qualifier);
                return (
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
                      {qLabel && (
                        <span className="text-xs text-mmu-green ml-2">
                          ({qLabel})
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
                );
              })}
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
            const qLabel = prettyQualifier(it.qualifier);
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
                    {qLabel && (
                      <span className="ml-2 text-xs text-mmu-green normal-case">
                        ({qLabel})
                      </span>
                    )}
                  </div>
                  {song?.artist && (
                    <div className="text-xs text-gray-500">{song.artist}</div>
                  )}
                  <fieldset className="mt-2 flex flex-wrap gap-3 text-xs">
                    <legend className="sr-only">Momento do culto</legend>
                    {MOMENT_OPTIONS.map((opt) => (
                      <label
                        key={opt.value}
                        className="flex items-center gap-1 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={it.moments.includes(opt.value)}
                          onChange={() => toggleMoment(idx, opt.value)}
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </fieldset>
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
      {hint && (
        <p className="text-sm text-mmu-green mb-3">{hint}</p>
      )}

      <div className="flex flex-wrap gap-3 items-center">
        <button
          onClick={handleSaveLocal}
          className="bg-mmu-green text-white px-4 py-2 rounded font-semibold hover:opacity-90"
        >
          {editingLocalId ? 'Atualizar (navegador)' : 'Salvar no navegador'}
        </button>
        <button
          onClick={handleSave}
          className="border rounded px-4 py-2 text-sm"
        >
          {editingFilename ? 'Salvar edição no GitHub ↗' : 'Publicar no GitHub ↗'}
        </button>
        <button
          onClick={handleDownload}
          className="border rounded px-4 py-2 text-sm"
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
