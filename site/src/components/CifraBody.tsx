import type { SongLine } from '@/lib/cifra-parser/types';

interface Props {
  lines: SongLine[];
  fontSize?: number;
  /** Se true, oculta a linha de acordes acima da letra (modo "só letras"). */
  lyricsOnly?: boolean;
}

// Só mostra marcador visual pras seções importantes.
// Resto vira uma linha em branco (mantém "duas linhas de espaço" entre seções).
// Só rótulos que ajudam a orientar visualmente durante o culto (Intro e
// Refrão/Coro). Outros rótulos estruturais (Primeira parte, Estrofe, Final,
// Ponte, Verso, Vocal, etc.) ficam preservados no .pro mas invisíveis na UI.
const SHOW_COMMENT_RE = /^(refr[ãa]o|coro|introdu[çc][ãa]o|intro)$/i;
const REFRAIN_LABEL_RE = /^(refr[ãa]o|coro)$/i;
const MODIFIER_LABEL_RE = /^(final|fim|bis|repete|2x|3x|tag(\s+final)?)$/i;

// Agrupa linhas em blocos: cada section-comment "real" inicia um novo bloco.
// Rótulos modificadores (Final, Bis, etc.) ficam no bloco corrente sem
// disparar reset da flag isRefrain — mantém o refrão como uma unidade.
export function groupIntoBlocks(
  lines: SongLine[],
): Array<{ isRefrain: boolean; lines: SongLine[] }> {
  const blocks: Array<{ isRefrain: boolean; lines: SongLine[] }> = [];
  let inRefrain = false;
  for (const line of lines) {
    if (line.kind === 'section-comment') {
      const label = line.comment?.trim() ?? '';
      if (MODIFIER_LABEL_RE.test(label)) {
        const last = blocks[blocks.length - 1];
        if (last) last.lines.push(line);
        else blocks.push({ isRefrain: inRefrain, lines: [line] });
        continue;
      }
      inRefrain = REFRAIN_LABEL_RE.test(label);
      blocks.push({ isRefrain: inRefrain, lines: [line] });
    } else {
      const last = blocks[blocks.length - 1];
      if (last && last.isRefrain === inRefrain) last.lines.push(line);
      else blocks.push({ isRefrain: inRefrain, lines: [line] });
    }
  }
  return blocks;
}

export function CifraLine({ line, lyricsOnly }: { line: SongLine; lyricsOnly?: boolean }) {
  if (line.kind === 'blank') {
    return <div>{' '}</div>;
  }
  if (line.kind === 'section-comment') {
    if (!line.comment || !SHOW_COMMENT_RE.test(line.comment.trim())) {
      return null;
    }
    return (
      <div className="section-comment-label text-gray-500 dark:text-gray-400 italic mt-2 mb-1 font-semibold">
        {line.comment}
      </div>
    );
  }

  let segments = line.segments;
  if (segments.length > 0 && segments[0].chord === undefined) {
    const trimmed = segments[0].text.replace(/^\s+/, '');
    if (trimmed === '') {
      segments = segments.slice(1);
    } else {
      segments = [{ text: trimmed }, ...segments.slice(1)];
    }
  }

  // Modo "só letras": junta o texto de todos os segments e ignora acordes.
  // Se a linha inteira era só acordes (sem letra), suprime pra não gerar
  // uma linha em branco desnecessária.
  if (lyricsOnly) {
    const lyric = segments.map((s) => s.text).join('');
    if (lyric.trim() === '') return null;
    return <div>{lyric}</div>;
  }

  let chordCursor = 0;
  let lyricCursor = 0;
  const chordParts: Array<{ pad: number; chord: string }> = [];
  const lyricParts: Array<{ pad: number; text: string }> = [];

  for (const seg of segments) {
    if (seg.chord) {
      const targetCol = Math.max(chordCursor, lyricCursor);
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

export default function CifraBody({ lines, fontSize, lyricsOnly }: Props) {
  return (
    <div
      className="cifra-body"
      style={fontSize ? { fontSize: `${fontSize}px` } : undefined}
    >
      {groupIntoBlocks(lines).map((block, i) => (
        <div key={i} className={block.isRefrain ? 'refrain-block' : undefined}>
          {block.lines.map((line, j) => (
            <CifraLine key={j} line={line} lyricsOnly={lyricsOnly} />
          ))}
        </div>
      ))}
    </div>
  );
}
