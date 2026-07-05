export interface ParsedFilename {
  slug: string;
  tom: string;
  qualifiers: string[];
}

/**
 * Parse do filename convention `{slug}[.{qualifier}]*.{tom}.pro`.
 * Ver spec §4.4.
 */
export function parseFilename(filename: string): ParsedFilename {
  if (!filename.endsWith('.pro')) {
    throw new Error(`Not a .pro filename: ${filename}`);
  }
  const withoutExt = filename.slice(0, -4);
  const parts = withoutExt.split('.');
  if (parts.length < 2) {
    throw new Error(`Filename missing tom: ${filename}`);
  }
  const tom = parts[parts.length - 1];
  const slug = parts[0];
  const qualifiers = parts.slice(1, -1);
  return { slug, tom, qualifiers };
}
