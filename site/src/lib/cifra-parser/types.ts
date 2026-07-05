/**
 * AST simples de uma cifra em ChordPro.
 * Ver spec §4 (formato) e §5.5 (parser SSOT).
 */

export type SectionId = 'congregacional' | 'hinario' | 'infantil' | 'inadequada';
export type SongStatus = 'aprovada' | 'em-revisao' | 'arquivada';

export interface ArrangementRecording {
  url: string;
  label?: string;
}

export interface SongMetadata {
  title: string;
  artist?: string;
  key: string;
  tempo?: number | null;
  youtube?: string;
  section: SectionId;
  status: SongStatus;
  tags: string[];
  notes?: string;
  hinarioNum?: string;
  arrangementOf?: string;
  added?: string;
  arrangements: ArrangementRecording[];
}

export type LineKind = 'lyric-with-chords' | 'section-comment' | 'blank';

export interface LineSegment {
  chord?: string;
  text: string;
}

export interface SongLine {
  kind: LineKind;
  segments: LineSegment[];
  comment?: string;
}

export interface Song {
  metadata: SongMetadata;
  lines: SongLine[];
  raw: string;
}
