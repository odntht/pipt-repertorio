import { useMemo, useState, useEffect, useRef } from 'react';
import type { Song, SongLine } from '@/lib/cifra-parser/types';
import { transposeSong } from '@/lib/chordpro/transpose';

interface Props {
  song: Song;
  availableToms: string[];
  slug: string;
  base: string;
}

const ALL_TONS = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
] as const;

// Só mostra marcador visual pras seções importantes.
// Resto vira uma linha em branco (mantém "duas linhas de espaço" entre seções).
const SHOW_COMMENT_RE = /^(refr[ãa]o|introdu[çc][ãa]o|intro|coro|solo)$/i;

export default function SongViewer({ song, availableToms, slug, base }: Props) {
  const [targetKey, setTargetKey] = useState<string>(song.metadata.key);
  const [fontSize, setFontSize] = useState<number>(16);
  const [autoScrollSpeed, setAutoScrollSpeed] = useState<number>(0);
  const scrollRef = useRef<number | null>(null);

  const transposed = useMemo(
    () => transposeSong(song, targetKey),
    [song, targetKey],
  );

  // Sobe/desce N semitons (wrap-around). Base é o tom atual.
  function shiftTom(delta: number) {
    const currentIdx = ALL_TONS.indexOf(targetKey as (typeof ALL_TONS)[number]);
    if (currentIdx === -1) return;
    const newIdx = (currentIdx + delta + ALL_TONS.length) % ALL_TONS.length;
    setTargetKey(ALL_TONS[newIdx]);
  }

  useEffect(() => {
    if (autoScrollSpeed === 0) {
      if (scrollRef.current !== null) {
        window.cancelAnimationFrame(scrollRef.current);
      }
      scrollRef.current = null;
      return;
    }
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      window.scrollBy(0, (autoScrollSpeed * dt) / 100);
      last = now;
      scrollRef.current = window.requestAnimationFrame(tick);
    };
    scrollRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (scrollRef.current !== null) {
        window.cancelAnimationFrame(scrollRef.current);
      }
    };
  }, [autoScrollSpeed]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4 no-print">
        <div className="flex items-center gap-1 text-sm">
          <span>Tom:</span>
          <button
            onClick={() => shiftTom(-1)}
            className="px-2 border rounded"
            aria-label="Descer meio tom"
            title="Descer meio tom"
          >
            −
          </button>
          <select
            value={targetKey}
            onChange={(e) => setTargetKey(e.target.value)}
            className="border rounded px-2 py-1 bg-white dark:bg-gray-800"
          >
            {ALL_TONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button
            onClick={() => shiftTom(1)}
            className="px-2 border rounded"
            aria-label="Subir meio tom"
            title="Subir meio tom"
          >
            +
          </button>
        </div>

        <div className="flex items-center gap-1 text-sm">
          <button
            onClick={() => setFontSize((f) => Math.max(10, f - 2))}
            className="px-2 border rounded"
          >
            A-
          </button>
          <span>{fontSize}px</span>
          <button
            onClick={() => setFontSize((f) => Math.min(32, f + 2))}
            className="px-2 border rounded"
          >
            A+
          </button>
        </div>

        <div className="flex items-center gap-1 text-sm">
          <span>Auto-scroll:</span>
          <button
            onClick={() => setAutoScrollSpeed((s) => Math.max(0, s - 1))}
            className="px-2 border rounded"
            aria-label="Diminuir velocidade"
            title="Diminuir velocidade"
          >
            −
          </button>
          <span className="min-w-[3ch] text-center">
            {autoScrollSpeed === 0 ? 'off' : autoScrollSpeed}
          </span>
          <button
            onClick={() => setAutoScrollSpeed((s) => Math.min(10, s + 1))}
            className="px-2 border rounded"
            aria-label="Aumentar velocidade"
            title="Aumentar velocidade"
          >
            +
          </button>
        </div>

        <button
          onClick={() => window.print()}
          className="ml-auto px-3 py-1 border rounded text-sm"
        >
          Imprimir / PDF
        </button>
      </div>

      {availableToms.length > 1 && (
        <div className="flex gap-2 mb-4 no-print text-sm">
          <span>Versões:</span>
          {availableToms.map((t) => (
            <a
              key={t}
              href={`${base}musicas/${slug}/${t}`}
              className="underline hover:text-mmu-green"
            >
              {t.toUpperCase()}
            </a>
          ))}
        </div>
      )}

      <div
        className="cifra-body"
        style={{ fontSize: `${fontSize}px` }}
      >
        {transposed.lines.map((line, i) => (
          <CifraLine key={i} line={line} />
        ))}
      </div>
    </div>
  );
}

function CifraLine({ line }: { line: SongLine }) {
  if (line.kind === 'blank') {
    return <div>{' '}</div>;
  }
  if (line.kind === 'section-comment') {
    if (!line.comment || !SHOW_COMMENT_RE.test(line.comment.trim())) {
      // Comentário oculto → linha em branco pra preservar "duas linhas de espaço"
      return <div>{' '}</div>;
    }
    return (
      <div className="text-gray-500 dark:text-gray-400 italic mt-2 mb-1 font-semibold">
        {line.comment}
      </div>
    );
  }

  // lyric-with-chords: strip leading whitespace (evita indentação excessiva
  // que vem do formato original do docx) e monta 2 linhas paralelas.
  let segments = line.segments;
  if (segments.length > 0 && segments[0].chord === undefined) {
    const trimmed = segments[0].text.replace(/^\s+/, '');
    if (trimmed === '') {
      segments = segments.slice(1);
    } else {
      segments = [{ text: trimmed }, ...segments.slice(1)];
    }
  }

  let chordCursor = 0;
  let lyricCursor = 0;
  const chordParts: Array<{ pad: number; chord: string }> = [];
  const lyricParts: Array<{ pad: number; text: string }> = [];

  for (const seg of segments) {
    if (seg.chord) {
      const targetCol = Math.max(chordCursor, lyricCursor);
      // Se acorde encostaria no anterior sem espaço, força 1 espaço.
      const needsGap =
        chordParts.length > 0 && targetCol === chordCursor && targetCol > 0;
      const col = targetCol + (needsGap ? 1 : 0);
      const chordPad = col - chordCursor;
      const lyricPad = col - lyricCursor;
      chordParts.push({ pad: chordPad, chord: seg.chord });
      lyricParts.push({ pad: lyricPad, text: seg.text });
      chordCursor = col + seg.chord.length;
      lyricCursor = col + seg.text.length;
    } else {
      lyricParts.push({ pad: 0, text: seg.text });
      lyricCursor += seg.text.length;
    }
  }

  const hasChords = chordParts.length > 0;

  return (
    <div>
      {hasChords && (
        <div>
          {chordParts.map((p, i) => (
            <span key={i}>
              {' '.repeat(p.pad)}
              <span className="cifra-chord">{p.chord}</span>
            </span>
          ))}
        </div>
      )}
      <div>
        {lyricParts.map((p, i) => (
          <span key={i}>
            {' '.repeat(p.pad)}
            {p.text}
          </span>
        ))}
      </div>
    </div>
  );
}
