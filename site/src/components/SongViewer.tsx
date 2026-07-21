import { useMemo, useState, useEffect, useRef } from 'react';
import type { Song } from '@/lib/cifra-parser/types';
import { transposeSong } from '@/lib/chordpro/transpose';
import { chordToDegree } from '@/lib/chordpro/degrees';
import CifraBody from './CifraBody';

export interface TomOption {
  key: string; // segmento de URL (ex.: 'g' ou 'v2.g')
  tom: string; // só o tom (ex.: 'g')
  qualifier: string; // '' quando não há
}

interface Props {
  song: Song;
  availableToms: TomOption[];
  slug: string;
  base: string;
  /**
   * Título sem o tom (ex.: "HINO 108 – Aflição E Paz (Aline Barros)").
   * O tom vem do estado dinâmico (`targetKey`) e é concatenado no render,
   * refletindo transposição do usuário.
   */
  titleBase: string;
}

function prettyQualifier(q: string): string {
  // v1 é a versão default — sem rótulo. v2+ mostra compacto ("v2").
  if (q === 'v1') return '';
  const mV = q.match(/^v(\d+)$/);
  if (mV) return `v${mV[1]}`;
  // versao-<nome> → "v. Nome" (versão nomeada, ex.: versao-hieracles).
  const mNamed = q.match(/^versao-(.+)$/);
  if (mNamed) {
    return `v. ${mNamed[1]
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')}`;
  }
  const mA = q.match(/^arranjo-(\d+)$/);
  if (mA) return `arranjo ${mA[1]}`;
  // 'versao' bare precisa de rótulo — colide com variante sem qualifier
  // em várias músicas do dataset (ex.: castelo-forte.c vs castelo-forte.versao.c).
  if (q === 'versao') return 'versão';
  return q.replace(/-/g, ' ');
}

const NOTES_SHARP = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
] as const;
const NOTES_FLAT = [
  'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B',
] as const;
const FLAT_TO_SHARP: Record<string, string> = {
  Db: 'C#', Eb: 'D#', Gb: 'F#', Ab: 'G#', Bb: 'A#',
};

type Notation = 'sharp' | 'flat';

function parseKeyToState(key: string): {
  rootIdx: number;
  isMinor: boolean;
  notation: Notation;
} {
  const m = key.match(/^([A-G])(#|b)?(m)?$/);
  if (!m) return { rootIdx: 0, isMinor: false, notation: 'sharp' };
  const root = m[1] + (m[2] ?? '');
  const isFlat = m[2] === 'b';
  const normalized = FLAT_TO_SHARP[root] ?? root;
  const rootIdx = (NOTES_SHARP as readonly string[]).indexOf(normalized);
  return { rootIdx, isMinor: m[3] === 'm', notation: isFlat ? 'flat' : 'sharp' };
}

function formatKey(rootIdx: number, isMinor: boolean, notation: Notation): string {
  const list = notation === 'flat' ? NOTES_FLAT : NOTES_SHARP;
  return list[rootIdx] + (isMinor ? 'm' : '');
}

export default function SongViewer({ song, availableToms, slug, base, titleBase }: Props) {
  const initial = parseKeyToState(song.metadata.key);
  const [rootIdx, setRootIdx] = useState<number>(initial.rootIdx);
  const [isMinor, setIsMinor] = useState<boolean>(initial.isMinor);
  const [notation, setNotation] = useState<Notation>(initial.notation);
  const [fontSize, setFontSize] = useState<number>(16);
  const [autoScrollSpeed, setAutoScrollSpeed] = useState<number>(0);
  const [controlsVisible, setControlsVisible] = useState<boolean>(true);
  const [showDegrees, setShowDegrees] = useState<boolean>(false);
  const scrollRef = useRef<number | null>(null);
  const controlsBarRef = useRef<HTMLDivElement | null>(null);

  const targetKey = formatKey(rootIdx, isMinor, notation);

  const transposed = useMemo(
    () => transposeSong(song, targetKey, notation),
    [song, targetKey, notation],
  );

  // Aplica conversão de graus se toggle ativo
  const displayedLines = useMemo(() => {
    if (!showDegrees) return transposed.lines;
    return transposed.lines.map((line) => {
      if (line.kind !== 'lyric-with-chords') return line;
      return {
        ...line,
        segments: line.segments.map((seg) =>
          seg.chord
            ? { ...seg, chord: chordToDegree(seg.chord, targetKey) }
            : seg,
        ),
      };
    });
  }, [transposed, showDegrees, targetKey]);

  function shiftTom(delta: number) {
    setRootIdx((idx) => (idx + delta + 12) % 12);
    setNotation(delta > 0 ? 'sharp' : 'flat');
  }

  function handleDropdown(value: string) {
    const parsed = parseKeyToState(value);
    setRootIdx(parsed.rootIdx);
    setIsMinor(parsed.isMinor);
    setNotation(parsed.notation);
  }

  const dropdownList = notation === 'flat' ? NOTES_FLAT : NOTES_SHARP;

  useEffect(() => {
    if (autoScrollSpeed === 0) {
      if (scrollRef.current !== null) {
        window.cancelAnimationFrame(scrollRef.current);
      }
      scrollRef.current = null;
      return;
    }
    let last = performance.now();
    let acc = 0;
    const tick = (now: number) => {
      const dt = now - last;
      const pxPerMs = (autoScrollSpeed * window.innerHeight * 0.01) / 1000;
      acc += pxPerMs * dt;
      if (acc >= 1) {
        const px = Math.floor(acc);
        window.scrollBy(0, px);
        acc -= px;
      }
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

  useEffect(() => {
    const el = controlsBarRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setControlsVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div>
      <div
        ref={controlsBarRef}
        className="flex flex-wrap items-center gap-3 mb-4 no-print"
      >
        <div className="flex items-center gap-1 text-sm">
          <span>Tom:</span>
          <button
            onClick={() => shiftTom(-1)}
            className="px-2 border rounded"
            aria-label="Descer meio tom"
            title="Descer meio tom"
          >
            ↓
          </button>
          <select
            value={dropdownList[rootIdx]}
            onChange={(e) => handleDropdown(e.target.value + (isMinor ? 'm' : ''))}
            className="border rounded px-2 py-1 bg-white dark:bg-gray-800"
          >
            {dropdownList.map((t) => (
              <option key={t} value={t}>
                {t}{isMinor ? 'm' : ''}
              </option>
            ))}
          </select>
          <button
            onClick={() => shiftTom(1)}
            className="px-2 border rounded"
            aria-label="Subir meio tom"
            title="Subir meio tom"
          >
            ↑
          </button>
        </div>

        <button
          onClick={() => setShowDegrees((v) => !v)}
          className={`px-3 py-1 border rounded text-sm ${
            showDegrees
              ? 'bg-mmu-green text-white border-mmu-green'
              : 'bg-transparent'
          }`}
          aria-pressed={showDegrees}
          title={showDegrees ? 'Mostrar acordes' : 'Mostrar graus (I, IV, V...)'}
        >
          Graus
        </button>

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
            ↓
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
            ↑
          </button>
        </div>

        <button
          onClick={() => window.print()}
          className="ml-auto px-3 py-1 border rounded text-sm"
        >
          Imprimir / PDF
        </button>
      </div>

      {!controlsVisible && autoScrollSpeed > 0 && (
        <div
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-full shadow-lg px-3 py-2 text-sm no-print"
        >
          <span className="text-xs text-gray-500 dark:text-gray-400">Auto-scroll:</span>
          <button
            onClick={() => setAutoScrollSpeed((s) => Math.max(0, s - 1))}
            className="px-2 border rounded"
            aria-label="Diminuir velocidade"
            title="Diminuir"
          >
            ↓
          </button>
          <span className="min-w-[2ch] text-center font-semibold">
            {autoScrollSpeed}
          </span>
          <button
            onClick={() => setAutoScrollSpeed((s) => Math.min(10, s + 1))}
            className="px-2 border rounded"
            aria-label="Aumentar velocidade"
            title="Aumentar"
          >
            ↑
          </button>
          <button
            onClick={() => setAutoScrollSpeed(0)}
            className="px-2 border rounded text-xs text-red-600 dark:text-red-400"
            aria-label="Parar auto-scroll"
            title="Parar"
          >
            ■
          </button>
        </div>
      )}

      {availableToms.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-4 no-print text-sm">
          <span>Versões:</span>
          {availableToms.map((t) => {
            const qLabel = t.qualifier ? prettyQualifier(t.qualifier) : '';
            return (
              <a
                key={t.key}
                href={`${base}musicas/${slug}/${t.key}`}
                className="underline hover:text-mmu-green"
              >
                {t.tom.toUpperCase()}
                {qLabel && (
                  <span className="text-xs text-mmu-green ml-1">
                    ({qLabel})
                  </span>
                )}
              </a>
            );
          })}
        </div>
      )}

      <h1
        className="song-title text-xl md:text-2xl font-bold uppercase mb-4"
        style={{ fontFamily: 'var(--font-mono, monospace)' }}
      >
        {titleBase} – {targetKey}
      </h1>

      <CifraBody lines={displayedLines} fontSize={fontSize} />
    </div>
  );
}
