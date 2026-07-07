import { useEffect } from 'react';
import type { Song } from '@/lib/cifra-parser/types';
import CifraBody from './CifraBody';

export interface PrintItem {
  slug: string;
  qualifier: string;
  tom: string;
  notes?: string;
  moments?: string[];
  title: string;
  artist?: string;
  hinarioNum?: string;
  song: Song | null;
}

interface Props {
  event: string;
  date: string; // ISO YYYY-MM-DD
  items: PrintItem[];
  /** Se true, dispara window.print() automaticamente ao montar. */
  autoPrint?: boolean;
}

const MOMENT_LABELS: Record<string, string> = {
  manha: 'Manhã',
  noite: 'Noite',
  ceia: 'Ceia',
  preludio: 'Prelúdio',
  posludio: 'Poslúdio',
};

// Ordem de exibição no cabeçalho da capa.
const MOMENT_ORDER = ['manha', 'noite', 'ceia', 'preludio', 'posludio'];

function formatDateShort(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y.slice(2)}`;
}

function prettyQualifier(q: string): string {
  const m1 = q.match(/^v(\d+)$/);
  if (m1) return `versão ${m1[1]}`;
  const m2 = q.match(/^arranjo-(\d+)$/);
  if (m2) return `arranjo ${m2[1]}`;
  if (q === 'versao') return 'versão';
  return q.replace(/-/g, ' ');
}

function tomLabel(it: PrintItem): string {
  const t = it.tom.toUpperCase();
  return it.qualifier ? `${t} (${prettyQualifier(it.qualifier)})` : t;
}

// Agrupa consecutivos com mesmo slug — evita repetir "GRANDE É O SENHOR"
// quando há mais de uma versão da mesma música no setlist.
function groupBySlug(items: PrintItem[]): PrintItem[][] {
  const groups: PrintItem[][] = [];
  for (const it of items) {
    const last = groups[groups.length - 1];
    if (last && last[0].slug === it.slug) last.push(it);
    else groups.push([it]);
  }
  return groups;
}

function groupTitleLine(group: PrintItem[]): string {
  const head = group[0];
  const hino = head.hinarioNum ? `HINO ${head.hinarioNum} - ` : '';
  const toms = group.map(tomLabel).join(', ');
  return `${hino}${head.title.toUpperCase()} - ${toms}`;
}

export default function SetlistPrintView({
  event,
  date,
  items,
  autoPrint = false,
}: Props) {
  useEffect(() => {
    if (autoPrint) {
      // Pequeno delay pra garantir que fontes/layout carregaram antes do dialog.
      const t = window.setTimeout(() => window.print(), 300);
      return () => window.clearTimeout(t);
    }
  }, [autoPrint]);

  // Agrupa por momento pra capa; itens sem momento vão em "Outras".
  const groups = new Map<string, PrintItem[]>();
  const noMoment: PrintItem[] = [];
  for (const it of items) {
    const moments = it.moments ?? [];
    if (moments.length === 0) {
      noMoment.push(it);
    } else {
      for (const m of moments) {
        if (!groups.has(m)) groups.set(m, []);
        groups.get(m)!.push(it);
      }
    }
  }
  const orderedMoments = MOMENT_ORDER.filter((m) => groups.has(m));

  return (
    <div className="print-setlist">
      <div className="no-print mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => window.print()}
          className="bg-mmu-green text-white px-3 py-2 rounded text-sm font-semibold hover:opacity-90"
        >
          Imprimir / Salvar como PDF
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="border rounded px-3 py-2 text-sm"
        >
          Voltar
        </button>
        <p className="w-full text-xs text-gray-500 dark:text-gray-400">
          O layout dessa página segue o modelo do <em>Próximo Louvor</em>: capa
          com a lista agrupada por momento e uma cifra por página em seguida.
          Use <strong>Imprimir → Salvar como PDF</strong> no diálogo do
          navegador.
        </p>
      </div>

      <section className="print-cover">
        <div className="cover-header">
          <div className="cover-date">{formatDateShort(date)}</div>
          <div className="cover-event">{event}</div>
        </div>

        {orderedMoments.length === 0 && noMoment.length > 0 ? (
          <div className="cover-block">
            <ul>
              {groupBySlug(noMoment).map((g, i) => (
                <li key={i}>{groupTitleLine(g)}</li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            {orderedMoments.map((m) => (
              <div key={m} className="cover-block">
                <h2>{MOMENT_LABELS[m]}</h2>
                <ul>
                  {groupBySlug(groups.get(m)!).map((g, i) => (
                    <li key={i}>{groupTitleLine(g)}</li>
                  ))}
                </ul>
              </div>
            ))}
            {noMoment.length > 0 && (
              <div className="cover-block">
                <h2>Outras</h2>
                <ul>
                  {noMoment.map((it, i) => (
                    <li key={i}>{titleLine(it)}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </section>

      {items.map((it, i) => (
        <section key={i} className="print-song">
          <h1 className="song-title">
            {it.hinarioNum && `HINO ${it.hinarioNum} – `}
            {it.title.toUpperCase()} – {it.tom.toUpperCase()}
          </h1>
          {it.artist && <p className="song-artist">{it.artist}</p>}
          {it.notes && <p className="song-notes">{it.notes}</p>}
          {it.song ? (
            <CifraBody lines={it.song.lines} />
          ) : (
            <p className="song-missing">
              ⚠ Cifra não encontrada pra {it.slug}
              {it.qualifier ? ` (${it.qualifier})` : ''} em {it.tom}.
            </p>
          )}
        </section>
      ))}
    </div>
  );
}
