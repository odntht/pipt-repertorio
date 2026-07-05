import type {
  Song, SongLine, SongMetadata, LineSegment, ArrangementRecording,
} from './types';

const REQUIRED = ['title', 'key', 'section', 'status'] as const;

const META_TAG_LINE =
  /^\{(title|artist|key|tempo|youtube|section|status|tags|notes|hinario_num|arrangement_of|arrangement|added):\s*(.*?)\s*\}$/;
const COMMENT_LINE = /^\{comment:\s*(.*?)\s*\}$/;

/**
 * Parse a ChordPro string into a Song AST.
 * Ver spec §4 (formato) e §5.5 (parser SSOT).
 */
export function parseChordPro(src: string): Song {
  const lines = src.split('\n');
  const meta: Partial<SongMetadata> & {
    arrangements: ArrangementRecording[];
    tags: string[];
  } = {
    arrangements: [],
    tags: [],
  };
  const body: SongLine[] = [];

  for (const rawLine of lines) {
    const line = rawLine.replace(/\r$/, '');

    const metaMatch = line.match(META_TAG_LINE);
    if (metaMatch) {
      handleTag(metaMatch[1], metaMatch[2], meta);
      continue;
    }

    const commentMatch = line.match(COMMENT_LINE);
    if (commentMatch) {
      body.push({ kind: 'section-comment', segments: [], comment: commentMatch[1] });
      continue;
    }

    if (line.trim() === '') {
      body.push({ kind: 'blank', segments: [] });
      continue;
    }

    body.push(parseBodyLine(line));
  }

  while (body.length && body[body.length - 1].kind === 'blank') body.pop();

  for (const req of REQUIRED) {
    if (meta[req] == null) {
      throw new Error(`ChordPro missing required tag: ${req}`);
    }
  }

  return {
    metadata: meta as SongMetadata,
    lines: body,
    raw: src,
  };
}

function handleTag(
  name: string,
  value: string,
  meta: Partial<SongMetadata> & {
    arrangements: ArrangementRecording[];
    tags: string[];
  },
): void {
  const v = value.trim();
  switch (name) {
    case 'title': meta.title = v; break;
    case 'artist': meta.artist = v || undefined; break;
    case 'key': meta.key = v; break;
    case 'tempo': meta.tempo = v === '' ? null : Number(v); break;
    case 'youtube': meta.youtube = v || undefined; break;
    case 'section': meta.section = v as SongMetadata['section']; break;
    case 'status': meta.status = v as SongMetadata['status']; break;
    case 'tags':
      meta.tags = v.split(',').map((t) => t.trim()).filter(Boolean);
      break;
    case 'notes': meta.notes = v || undefined; break;
    case 'hinario_num': meta.hinarioNum = v || undefined; break;
    case 'arrangement_of': meta.arrangementOf = v || undefined; break;
    case 'added': meta.added = v || undefined; break;
    case 'arrangement': {
      const [url, label] = v.split('|').map((s) => s.trim());
      if (url) meta.arrangements.push(label ? { url, label } : { url });
      break;
    }
    default:
      break;
  }
}

function parseBodyLine(line: string): SongLine {
  const segments: LineSegment[] = [];
  const re = /\[([^\]]+)\]([^\[]*)|([^\[]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) {
    if (m[1] !== undefined) {
      segments.push({ chord: m[1], text: m[2] ?? '' });
    } else if (m[3] !== undefined && m[3] !== '') {
      segments.push({ text: m[3] });
    }
  }
  return { kind: 'lyric-with-chords', segments };
}
