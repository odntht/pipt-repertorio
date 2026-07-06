import { useMemo, useRef, useState } from 'react';

type Section = 'congregacional' | 'hinario' | 'infantil' | 'inadequada';

interface Entry {
  slug: string;
  title: string;
  artist?: string;
  section: Section;
  tags: string[];
  toms: string[];
  hinarioNum?: string;
}

interface Props {
  entries: Entry[];
  base: string;
}

const SECTION_LABEL: Record<Section, string> = {
  congregacional: 'Congregacional',
  hinario: 'Hinário',
  infantil: 'Infantil',
  inadequada: 'Inadequada',
};

// Ordem canônica das categorias — bate com o design (§4.5) e com a estrutura
// do docx original: 1ª Congregacional, 2ª Hinário, 3ª Infantil, 4ª Inadequada.
const SECTION_ORDER: Record<Section, number> = {
  congregacional: 0,
  hinario: 1,
  infantil: 2,
  inadequada: 3,
};

const SECTION_BG: Record<Section, string> = {
  congregacional: 'bg-section-congregacional',
  hinario: 'bg-section-hinario',
  infantil: 'bg-section-infantil',
  inadequada: 'bg-section-inadequada',
};

// Ordem alfabética por título, ignorando acentos e "HINO NNN – " (o número
// não é o critério primário — títulos alfabetizam do jeito natural).
function sortKey(e: Entry): string {
  return e.title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

// Normaliza texto pra buscar tags (case + acento insensível).
function normalize(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

// Converte "santo-espirito" pra "Santo espirito" — só primeira letra em caps.
function prettyTag(tag: string): string {
  const label = tag.replace(/-/g, ' ');
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export default function MusicasList({ entries, base }: Props) {
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [tagQuery, setTagQuery] = useState('');
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);

  const allTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of entries) {
      for (const t of e.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0], 'pt-BR'));
  }, [entries]);

  const sectionCounts = useMemo(() => {
    const counts: Record<Section, number> = {
      congregacional: 0, hinario: 0, infantil: 0, inadequada: 0,
    };
    for (const e of entries) counts[e.section]++;
    return counts;
  }, [entries]);

  const filtered = useMemo(() => {
    let out = entries;
    if (selectedSection) out = out.filter((e) => e.section === selectedSection);
    if (selectedTags.size > 0) {
      out = out.filter((e) => e.tags.some((t) => selectedTags.has(t)));
    }
    return out.slice().sort((a, b) => {
      const bySection = SECTION_ORDER[a.section] - SECTION_ORDER[b.section];
      if (bySection !== 0) return bySection;
      return sortKey(a).localeCompare(sortKey(b), 'pt-BR');
    });
  }, [entries, selectedSection, selectedTags]);

  function addTag(t: string) {
    const next = new Set(selectedTags);
    next.add(t);
    setSelectedTags(next);
    setTagQuery('');
    setTagDropdownOpen(false);
    tagInputRef.current?.focus();
  }

  function removeTag(t: string) {
    const next = new Set(selectedTags);
    next.delete(t);
    setSelectedTags(next);
  }

  const tagSuggestions = useMemo(() => {
    const q = normalize(tagQuery.trim());
    return allTags
      .filter(([tag]) => !selectedTags.has(tag))
      .filter(([tag]) => (q === '' ? true : normalize(tag).includes(q)))
      .slice(0, 12);
  }, [allTags, selectedTags, tagQuery]);

  const sections: Section[] = ['congregacional', 'hinario', 'infantil', 'inadequada'];

  return (
    <div>
      <div className="mb-4 space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
            Categoria
          </h2>
          <div className="flex flex-wrap gap-2">
            <FilterChip
              active={selectedSection === null}
              onClick={() => setSelectedSection(null)}
            >
              Todas ({entries.length})
            </FilterChip>
            {sections.map((s) => (
              <FilterChip
                key={s}
                active={selectedSection === s}
                onClick={() =>
                  setSelectedSection(selectedSection === s ? null : s)
                }
                colorClass={SECTION_BG[s]}
              >
                {SECTION_LABEL[s]} ({sectionCounts[s]})
              </FilterChip>
            ))}
          </div>
        </div>

        {allTags.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Temas
            </h2>
            <div className="relative">
              <input
                ref={tagInputRef}
                type="text"
                value={tagQuery}
                onChange={(e) => {
                  setTagQuery(e.target.value);
                  setTagDropdownOpen(true);
                }}
                onFocus={() => setTagDropdownOpen(true)}
                onBlur={() => setTimeout(() => setTagDropdownOpen(false), 150)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && tagSuggestions.length > 0) {
                    e.preventDefault();
                    addTag(tagSuggestions[0][0]);
                  } else if (e.key === 'Escape') {
                    setTagDropdownOpen(false);
                  }
                }}
                placeholder="Buscar tema…"
                className="w-full max-w-md border rounded px-3 py-2 text-sm bg-white dark:bg-gray-800"
                aria-label="Filtrar por tema"
              />
              {tagDropdownOpen && tagSuggestions.length > 0 && (
                <ul
                  className="absolute z-10 mt-1 w-full max-w-md bg-white dark:bg-gray-800 border rounded shadow-lg max-h-64 overflow-auto"
                  role="listbox"
                >
                  {tagSuggestions.map(([tag, count]) => (
                    <li key={tag} role="option">
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => addTag(tag)}
                        className="flex justify-between w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <span>{prettyTag(tag)}</span>
                        <span className="text-xs text-gray-500">{count}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {selectedTags.size > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {[...selectedTags].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-mmu-green text-white"
                  >
                    {prettyTag(tag)}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      aria-label={`Remover ${tag}`}
                      className="hover:opacity-70"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => setSelectedTags(new Set())}
                  className="text-xs text-gray-500 hover:underline"
                >
                  limpar todos
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="text-sm text-gray-500 mb-2">
        {filtered.length} de {entries.length} músicas
      </p>

      <ul className="space-y-2">
        {filtered.map((e) => (
          <li key={e.slug} className="border-b pb-2">
            <a
              href={`${base}musicas/${e.slug}`}
              className="flex flex-wrap items-center gap-2 hover:text-mmu-green"
            >
              <span className="font-semibold uppercase">
                {e.hinarioNum && `HINO ${e.hinarioNum} – `}
                {e.title}
              </span>
              {e.artist && (
                <span className="text-sm text-gray-500">{e.artist}</span>
              )}
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-semibold text-white ${SECTION_BG[e.section]}`}
              >
                {SECTION_LABEL[e.section]}
              </span>
              <span className="ml-auto text-sm text-gray-500">
                {e.toms.map((t) => t.toUpperCase()).join(' · ')}
              </span>
            </a>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="text-sm text-gray-500 italic py-4">
            Nenhuma música corresponde aos filtros.
          </li>
        )}
      </ul>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
  colorClass,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  colorClass?: string;
}) {
  const base = 'px-3 py-1 rounded-full text-xs font-semibold border transition-colors';
  const activeStyle = colorClass
    ? `${colorClass} text-white border-transparent`
    : 'bg-mmu-green text-white border-transparent';
  const inactiveStyle =
    'bg-transparent text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${active ? activeStyle : inactiveStyle}`}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}
