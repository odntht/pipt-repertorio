import { useMemo, useState, useEffect, useRef } from 'react';
import type { Song, SongLine } from '@/lib/cifra-parser/types';
import { transposeSong } from '@/lib/chordpro/transpose';
import { chordToDegree } from '@/lib/chordpro/degrees';

interface Props {
  song: Song;
  availableToms: string[];
  slug: string;
  base: string;
  /**
   * Título sem o tom (ex.: "HINO 108 – Aflição E Paz (Aline Barros)").
   * O tom vem do estado dinâmico (`targetKey`) e é concatenado no render,
   * refletindo transposição do usuário.
   */
  titleBase: string;
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

// Só mostra marcador visual pras seções importantes.
// Resto vira uma linha em branco (mantém "duas linhas de espaço" entre seções).
const SHOW_COMMENT_RE = /^(refr[ãa]o|introdu[çc][ãa]o|intro|coro|solo)$/i;

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

  // Sobe/desce N semitons (wrap-around). Notação segue a direção:
  // subir → sharp (#), descer → flat (b).
  function shiftTom(delta: number) {
    setRootIdx((idx) => (idx + delta + 12) % 12);
    setNotation(delta > 0 ? 'sharp' : 'flat');
  }

  // Dropdown: parse do valor selecionado e atualiza estado + notação inferida.
  function handleDropdown(value: string) {
    const parsed = parseKeyToState(value);
    setRootIdx(parsed.rootIdx);
    setIsMinor(parsed.isMinor);
    setNotation(parsed.notation);
  }

  // Lista mostrada no dropdown segue a notação atual.
  const dropdownList = notation === 'flat' ? NOTES_FLAT : NOTES_SHARP;

  useEffect(() => {
    if (autoScrollSpeed === 0) {
      if (scrollRef.current !== null) {
        window.cancelAnimationFrame(scrollRef.current);
      }
      scrollRef.current = null;
      return;
    }
    // Velocidade em % da altura da viewport por segundo — funciona igual em
    // celular pequeno ou tela grande de estúdio.
    //   speed 1  = 1% da tela por segundo (~100s pra rolar uma tela cheia)
    //   speed 10 = 10% da tela por segundo (~10s pra rolar uma tela cheia)
    let last = performance.now();
    let acc = 0; // acumula fração de pixel entre frames
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

  // Observa se a barra de controles está visível na tela.
  // Se sair (usuário fez scroll pra baixo) e auto-scroll está ativo,
  // mostra o controle flutuante.
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

      {/* Controle flutuante — aparece quando o menu de controles saiu da tela
          e auto-scroll está ativo. Fica fixo no canto inferior direito. */}
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

      <h1
        className="song-title text-xl md:text-2xl font-bold uppercase mb-4"
        style={{ fontFamily: 'var(--font-mono, monospace)' }}
      >
        {titleBase} – {targetKey}
      </h1>

      <div
        className="cifra-body"
        style={{ fontSize: `${fontSize}px` }}
      >
        {displayedLines.map((line, i) => (
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
