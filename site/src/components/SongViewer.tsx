import { useMemo, useState, useEffect, useRef } from 'react';
import type { Song } from '@/lib/cifra-parser/types';
import { transposeSong } from '@/lib/chordpro/transpose';
import { renderChordsOverLyrics } from '@/lib/chordpro/render';

interface Props {
  song: Song;
  availableToms: string[];
  slug: string;
  base: string;
}

const ALL_TONS = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
] as const;

export default function SongViewer({ song, availableToms, slug, base }: Props) {
  const [targetKey, setTargetKey] = useState<string>(song.metadata.key);
  const [fontSize, setFontSize] = useState<number>(16);
  const [autoScrollSpeed, setAutoScrollSpeed] = useState<number>(0);
  const scrollRef = useRef<number | null>(null);

  const transposed = useMemo(() => transposeSong(song, targetKey), [song, targetKey]);
  const rendered = useMemo(
    () => renderChordsOverLyrics(transposed.lines),
    [transposed],
  );

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
        <label className="flex items-center gap-1 text-sm">
          Tom:
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
        </label>

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

        <label className="flex items-center gap-1 text-sm">
          Auto-scroll:
          <input
            type="range"
            min={0}
            max={10}
            value={autoScrollSpeed}
            onChange={(e) => setAutoScrollSpeed(Number(e.target.value))}
          />
          <span>{autoScrollSpeed === 0 ? 'off' : autoScrollSpeed}</span>
        </label>

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

      <pre className="cifra-body" style={{ fontSize: `${fontSize}px` }}>
        {rendered}
      </pre>
    </div>
  );
}
