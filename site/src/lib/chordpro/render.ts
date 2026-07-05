import type { SongLine } from '@/lib/cifra-parser/types';

/**
 * Renderiza linhas AST em texto plano "cifra sobre letra".
 * Assume renderização em fonte monospace com `white-space: pre` no CSS.
 * Ver spec §4.1 (modo de renderização default).
 */
export function renderChordsOverLyrics(lines: SongLine[]): string {
  const out: string[] = [];

  for (const line of lines) {
    if (line.kind === 'blank') {
      out.push('');
      continue;
    }
    if (line.kind === 'section-comment') {
      out.push(`--- ${line.comment ?? ''} ---`);
      continue;
    }
    let chordRow = '';
    let lyricRow = '';
    for (const seg of line.segments) {
      if (seg.chord) {
        while (chordRow.length < lyricRow.length) chordRow += ' ';
        chordRow += seg.chord;
      }
      lyricRow += seg.text;
    }
    if (chordRow.trim().length > 0) {
      out.push(chordRow.trimEnd());
    }
    out.push(lyricRow);
  }

  return out.join('\n');
}
