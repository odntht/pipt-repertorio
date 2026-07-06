import { useEffect, useMemo, useState } from 'react';
import { parseChordPro } from '@/lib/cifra-parser';
import { renderChordsOverLyrics } from '@/lib/chordpro/render';
import {
  transposeRawChordPro,
  setHeader,
  readHeader,
} from '@/lib/chordpro/transpose-raw';
import { slugifyTom } from '@/lib/chordpro/slugify-tom';

interface Props {
  base: string;
}

interface Source {
  raw: string;
  slug: string;
  tom: string;
}

const GITHUB_NEW_FILE =
  'https://github.com/odntht/pipt-repertorio/new/main/data/songs';

const NOTES = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
] as const;
const NOTES_FLAT = [
  'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B',
] as const;
const FLAT_TO_SHARP: Record<string, string> = {
  Db: 'C#', Eb: 'D#', Gb: 'F#', Ab: 'G#', Bb: 'A#',
};
const SHARP_TO_FLAT: Record<string, string> = {
  'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb',
};

function sanitizeHeaderValue(v: string): string {
  return v.replace(/[}\r\n]/g, '');
}

function normalizeTargetToNotation(
  key: string,
  notation: 'sharp' | 'flat',
): string {
  if (notation === 'flat') return SHARP_TO_FLAT[key] ?? key;
  return FLAT_TO_SHARP[key] ?? key;
}

export default function NewVersionEditor({ base }: Props) {
  const [source, setSource] = useState<Source | null>(null);
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [artist, setArtist] = useState<string>('');
  const [targetKey, setTargetKey] = useState<string>('C');
  const [isMinor, setIsMinor] = useState<boolean>(false);
  const [notation, setNotation] = useState<'sharp' | 'flat'>('sharp');
  const [filename, setFilename] = useState<string>('');
  const [filenameEditedByUser, setFilenameEditedByUser] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('newVersion.source');
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as Source;
      setSource(parsed);
      setContent(parsed.raw);
      setTitle(readHeader(parsed.raw, 'title'));
      setArtist(readHeader(parsed.raw, 'artist'));
      const key = readHeader(parsed.raw, 'key') || 'C';
      const m = key.match(/^([A-G][#b]?)(m)?$/);
      if (m) {
        setTargetKey(m[1]);
        setIsMinor(m[2] === 'm');
        setNotation(m[1].includes('b') ? 'flat' : 'sharp');
      }
    } catch {
      // ignore
    }
  }, []);

  const fullTargetKey = targetKey + (isMinor ? 'm' : '');

  useEffect(() => {
    if (!source || filenameEditedByUser) return;
    setFilename(`${source.slug}.${slugifyTom(fullTargetKey)}.pro`);
  }, [source, fullTargetKey, filenameEditedByUser]);

  // Recalcula content quando muda tom/notação/título/artista.
  // Aplica sobre o conteúdo atual (via functional setState) pra preservar
  // edições manuais do usuário no textarea.
  useEffect(() => {
    if (!source) return;
    setContent((current) => {
      let next = transposeRawChordPro(current, fullTargetKey, notation);
      if (title) next = setHeader(next, 'title', title);
      if (artist) next = setHeader(next, 'artist', artist);
      return next;
    });
  }, [source, fullTargetKey, notation, title, artist]);

  const previewText = useMemo(() => {
    try {
      const parsed = parseChordPro(content);
      return renderChordsOverLyrics(parsed.lines);
    } catch (e) {
      return `Erro ao renderizar preview: ${(e as Error).message}`;
    }
  }, [content]);

  function handleSave() {
    if (!title.trim()) {
      setSaveError('Preencha o título antes de salvar.');
      return;
    }
    setSaveError(null);
    const url =
      `${GITHUB_NEW_FILE}?filename=${encodeURIComponent(filename)}` +
      `&value=${encodeURIComponent(content)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function handleDownload() {
    if (!title.trim()) {
      setSaveError('Preencha o título antes de baixar.');
      return;
    }
    setSaveError(null);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!source) {
    return (
      <div className="text-sm text-gray-700 dark:text-gray-300">
        <p className="mb-4">
          Pra criar uma nova versão, abra uma música existente e clique em{' '}
          <em>“+ Criar nova versão dessa música”</em>.
        </p>
        <a
          href={`${base}musicas`}
          className="text-mmu-green hover:underline"
        >
          Ver músicas do repertório
        </a>
      </div>
    );
  }

  const noteList = notation === 'flat' ? NOTES_FLAT : NOTES;

  return (
    <div>
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Nova versão</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Baseada em <strong>{source.slug}</strong> ({source.tom.toUpperCase()}).
          Ao salvar, abriremos o GitHub pra você commitar o novo arquivo.
        </p>
      </header>

      <div className="grid gap-3 mb-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span>Título</span>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(sanitizeHeaderValue(e.target.value));
              if (saveError) setSaveError(null);
            }}
            required
            aria-invalid={!title.trim()}
            className="border rounded px-2 py-1 bg-white dark:bg-gray-800"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>Artista</span>
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(sanitizeHeaderValue(e.target.value))}
            className="border rounded px-2 py-1 bg-white dark:bg-gray-800"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>Tom</span>
          <div className="flex gap-2 items-center">
            <select
              value={normalizeTargetToNotation(targetKey, notation)}
              onChange={(e) => {
                const v = e.target.value;
                setTargetKey(v);
                setNotation(v.length > 1 && v[1] === 'b' ? 'flat' : 'sharp');
              }}
              className="border rounded px-2 py-1 bg-white dark:bg-gray-800"
            >
              {noteList.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={isMinor}
                onChange={(e) => setIsMinor(e.target.checked)}
              />
              <span>menor</span>
            </label>
            <button
              type="button"
              onClick={() => setNotation(notation === 'flat' ? 'sharp' : 'flat')}
              className="px-2 py-1 border rounded text-xs"
              title="Alternar entre # e b"
            >
              {notation === 'flat' ? '♭' : '♯'}
            </button>
          </div>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>Nome do arquivo</span>
          <input
            type="text"
            value={filename}
            onChange={(e) => {
              setFilename(e.target.value);
              setFilenameEditedByUser(true);
            }}
            className="border rounded px-2 py-1 bg-white dark:bg-gray-800 font-mono text-xs"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold mb-1">
            ChordPro (edite à vontade)
          </h2>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-96 border rounded px-2 py-1 font-mono text-xs bg-white dark:bg-gray-800"
            spellCheck={false}
          />
        </div>
        <div>
          <h2 className="text-sm font-semibold mb-1">Preview</h2>
          <pre className="w-full h-96 border rounded px-2 py-1 overflow-auto font-mono text-xs whitespace-pre bg-gray-50 dark:bg-gray-900">
            {previewText}
          </pre>
        </div>
      </div>

      {saveError && (
        <p
          role="alert"
          className="mt-4 text-sm text-red-600 dark:text-red-400"
        >
          {saveError}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-3 items-center">
        <button
          onClick={handleSave}
          className="bg-mmu-green text-white px-4 py-2 rounded font-semibold hover:opacity-90"
        >
          Salvar no GitHub ↗
        </button>
        <button
          onClick={handleDownload}
          className="border rounded px-4 py-2"
        >
          Baixar .pro
        </button>
        <a
          href={`${base}musicas/${source.slug}/${source.tom}`}
          className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
        >
          ← Voltar
        </a>
      </div>

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        “Salvar no GitHub” abre uma aba nova com o conteúdo pré-preenchido —
        você precisa estar logado no GitHub e ter permissão de escrita (ou fazer
        um fork). Se o arquivo for muito grande e o botão falhar, use
        <em> Baixar .pro</em> e commit manualmente.
      </p>
    </div>
  );
}
