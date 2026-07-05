# Plano A — Fundações Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Estabelecer as fundações do PIPT Repertório em modo local-first: estrutura do repo, parser canônico de cifras, site Astro renderizando 2 músicas seed com transposição e PDF, e o esqueleto do plugin Claude Code — tudo sem dependência de GitHub externo.

**Architecture:** Repo único com `data/` (seed) + `site/` (Astro com ilhas React) + `plugin/` (source do plugin, instalado via symlink em `~/.claude/plugins/`). Parser TS em `site/src/lib/cifra-parser/` é fonte única da verdade, consumido pelo site e — em planos futuros — pelos scripts de migração. TDD com Vitest; render "cifra sobre letra" via lib própria (não depende de ChordSheetJS pro render — só pra transpor).

**Tech Stack:** Node 22 LTS (via mise) · npm · Astro 5 · React 18 (ilhas) · TypeScript 5 · Tailwind CSS · Vitest · @vite-pwa/astro · chordsheetjs (só pra transpor)

**Referência canônica:** [docs/superpowers/specs/2026-07-05-pipt-repertorio-design.md](../specs/2026-07-05-pipt-repertorio-design.md)

**Escopo — dentro:**
- Estrutura de diretórios e arquivos de seed (2 músicas + `sections.yml` + `config.yml`)
- Parser TS canônico + fixtures + testes
- Módulos de render e transpose com testes
- Site Astro com layout, badges coloridos, listagem `/musicas`, página `/musicas/{slug}/{tom}`, SongViewer com transposição em tempo real, print/PDF, PWA offline
- Plugin skeleton com 2 comandos mínimos (`status`, `add-song`) e instruções de instalação
- Todo o histórico commitado localmente (sem push — Plano C cuida disso)

**Escopo — fora (fica pros Planos B/C):**
- Migração do docx (Plano B)
- Form paste-and-parse `/adicionar` (Plano C)
- Setlists via site (Plano C)
- GitHub Action `process-submission.yml` (Plano C)
- Search com Pagefind (deferido — não faz sentido com 2 músicas)
- Busca global (Plano C)

---

## Chunk 1: Scaffold do repositório + seed data

### Task 1.1: Configurar Node/npm via mise

**Files:**
- Create: `.mise.toml`
- Create: `.nvmrc`

- [ ] **Step 1.1.1: Criar `.mise.toml` na raiz**

```toml
# .mise.toml
[tools]
node = "22.11.0"

[env]
_.file = { path = ".env", optional = true }
```

- [ ] **Step 1.1.2: Criar `.nvmrc` como fallback**

```
22.11.0
```

- [ ] **Step 1.1.3: Ativar versão do Node no diretório**

```bash
cd ~/Documents/pipt-repertorio
mise install
node --version
```

Expected: `v22.11.0`

- [ ] **Step 1.1.4: Verificar npm veio junto**

```bash
npm --version
```

Expected: qualquer versão 10.x ou 11.x (vem com Node 22)

- [ ] **Step 1.1.5: Commit**

```bash
git add .mise.toml .nvmrc
git commit -m "chore: pin Node 22 LTS via mise"
```

### Task 1.2: Criar estrutura de diretórios do `data/`

**Files:**
- Create: `data/songs/.gitkeep`
- Create: `data/setlists/.gitkeep`
- Create: `data/sections.yml`
- Create: `data/config.yml`

- [ ] **Step 1.2.1: Criar diretórios**

```bash
cd ~/Documents/pipt-repertorio
mkdir -p data/songs data/setlists
touch data/songs/.gitkeep data/setlists/.gitkeep
```

- [ ] **Step 1.2.2: Escrever `data/sections.yml`**

```yaml
# data/sections.yml — governança das 4 seções do repertório
# Ver spec §4.5

sections:
  - id: congregacional
    label: Músicas Congregacionais
    badge_color: green
    order: 1
    description: |
      1ª PARTE — extra-hinário, aprovadas pela liderança do Ministério de Música
      ou por algum pastor da PIPT. Ainda que o repertório tenha surgido de um
      movimento histórico, sempre devemos ter juízo crítico sobre qualquer canção.

  - id: hinario
    label: Hinário Novo Cântico
    badge_color: blue
    order: 2
    description: Hinos oficiais do Hinário Novo Cântico da IPB.

  - id: infantil
    label: Músicas Infantis
    badge_color: yellow
    order: 3
    description: Músicas usadas nos cultos infantis e escola dominical infantil.

  - id: inadequada
    label: Inadequadas ao Culto Público
    badge_color: red
    order: 4
    hidden_by_default: true
    description: |
      Músicas avaliadas pela liderança e consideradas inadequadas para uso em culto público.
      Registradas com justificativa por transparência histórica.
```

- [ ] **Step 1.2.3: Escrever `data/config.yml`**

```yaml
# data/config.yml — configuração global
# Ver spec §5.4 (tail_song) e §9.4 (identidade)

site:
  title: "PIPT Repertório"
  subtitle: "Ministério de Música — PIPT"
  base_url: "/pipt-repertorio"
  primary_color: "#007830"

# Peça tocada sempre no fim de todo setlist, todas as equipes
tail_song:
  slug: triplice-amem
  tom: g
```

- [ ] **Step 1.2.4: Commit**

```bash
git add data/
git commit -m "feat(data): estrutura inicial de data/ com sections.yml e config.yml"
```

### Task 1.3: Criar 2 músicas seed pra exercer o parser e o site

**Files:**
- Create: `data/songs/nada-alem-do-sangue.g.pro`
- Create: `data/songs/nada-alem-do-sangue.a.pro`

**Por quê essas duas:** mesma música em tons diferentes exercita o roteamento `/musicas/{slug}/{tom}`, testa que a transposição gera resultado idêntico ao arquivo manualmente transposto, e é conteúdo real que você vai reconhecer.

- [ ] **Step 1.3.1: Escrever `data/songs/nada-alem-do-sangue.g.pro`**

```chordpro
{title: Nada Além do Sangue}
{artist: Fernandinho}
{key: G}
{tempo: }
{youtube: https://www.youtube.com/watch?v=6wJPHTgzeGg}
{section: congregacional}
{status: aprovada}
{tags: adoracao, sangue-de-jesus, cruz}
{added: 2025-01-15}

{comment: Estrofe 1}
     [G]Teu sangue leva-me a[Em7(11)]lém a [G]todas as alturas onde ouço a tua [Em7(11)]voz
                [D]Fala de tua jus[C9]tiça pela minha vida Je[G]sus, es[C9/E]te é o teu [D]sangue

{comment: Estrofe 2}
      [G]Tua cruz mostra tua [Em7(11)]graça fala do [G]amor do Pai que prepara para [Em7(11)]nós
                [D]Um caminho para [C9]Ele onde posso me ache[G]gar so[C9/E]mente pelo [D]sangue

{comment: Refrão}
   [G]Que nos lava dos peca[Em7(11)]dos,   que nos traz restau[G]ração
 [D]Nada além do [C9]sangue, nada além do sangue de Je[G]sus[C9/E] [D]
    [G]O que nos faz brancos como a [Em7(11)]neve, aceitos como amigos de [G]DEUS
 [D]Nada além do [C9]sangue, nada além do sangue de Je[G]sus[C9/E] [D]

{comment: Ponte}
[G]Eu sou livre
[Em7(11)]Eu sou livre
[D]Nada além do [C9]sangue, nada além do sangue de Je[G]sus[C9/E] [D]

{comment: Tag final}
[G]Alvo mais que a [D]neve!
[Am7] [D7]Alvo mais que a [G]neve!
[G]Sim, nesse sangue [G/B]lava[C]do,[Dbº]
         [G]Mais alvo que a [D]neve se[G]rei.
```

- [ ] **Step 1.3.2: Escrever `data/songs/nada-alem-do-sangue.a.pro`**

Mesma música transposta pra A (semitom acima). Cada `[G]` vira `[A]`, `[Em7(11)]` vira `[F#m7(11)]`, `[D]` vira `[E]`, `[C9]` vira `[D9]`, `[C9/E]` vira `[D9/F#]`, `[Am7]` vira `[Bm7]`, `[D7]` vira `[E7]`, `[G/B]` vira `[A/C#]`, `[C]` vira `[D]`, `[Dbº]` vira `[Ebº]`.

```chordpro
{title: Nada Além do Sangue}
{artist: Fernandinho}
{key: A}
{tempo: }
{youtube: https://www.youtube.com/watch?v=6wJPHTgzeGg}
{section: congregacional}
{status: aprovada}
{tags: adoracao, sangue-de-jesus, cruz}
{added: 2025-01-15}

{comment: Estrofe 1}
     [A]Teu sangue leva-me a[F#m7(11)]lém a [A]todas as alturas onde ouço a tua [F#m7(11)]voz
                [E]Fala de tua jus[D9]tiça pela minha vida Je[A]sus, es[D9/F#]te é o teu [E]sangue

{comment: Estrofe 2}
      [A]Tua cruz mostra tua [F#m7(11)]graça fala do [A]amor do Pai que prepara para [F#m7(11)]nós
                [E]Um caminho para [D9]Ele onde posso me ache[A]gar so[D9/F#]mente pelo [E]sangue

{comment: Refrão}
   [A]Que nos lava dos peca[F#m7(11)]dos,   que nos traz restau[A]ração
 [E]Nada além do [D9]sangue, nada além do sangue de Je[A]sus[D9/F#] [E]
    [A]O que nos faz brancos como a [F#m7(11)]neve, aceitos como amigos de [A]DEUS
 [E]Nada além do [D9]sangue, nada além do sangue de Je[A]sus[D9/F#] [E]

{comment: Ponte}
[A]Eu sou livre
[F#m7(11)]Eu sou livre
[E]Nada além do [D9]sangue, nada além do sangue de Je[A]sus[D9/F#] [E]

{comment: Tag final}
[A]Alvo mais que a [E]neve!
[Bm7] [E7]Alvo mais que a [A]neve!
[A]Sim, nesse sangue [A/C#]lava[D]do,[Ebº]
         [A]Mais alvo que a [E]neve se[A]rei.
```

- [ ] **Step 1.3.3: Commit**

```bash
git add data/songs/
git commit -m "feat(data): adiciona 2 músicas seed — Nada Além do Sangue (G, A)"
```

### Task 1.4: Editor config e arquivos de metadados do repo

**Files:**
- Create: `.editorconfig`
- Modify: `README.md` (já existe? Se não, criar)
- Create: `LICENSE`

- [ ] **Step 1.4.1: Criar `.editorconfig`**

```
# https://editorconfig.org
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false

[*.pro]
# ChordPro: preservar espaços em branco — importantes pro alinhamento cifra/letra
trim_trailing_whitespace = false
```

- [ ] **Step 1.4.2: Escrever/atualizar `README.md`**

```markdown
# PIPT Repertório

Repositório e site do repertório musical do Ministério de Música da PIPT.

## Estrutura

- `data/songs/` — arquivos ChordPro (`.pro`), 1 por (música, tom)
- `data/setlists/` — arquivos YAML, 1 por evento
- `data/sections.yml` — governança das 4 seções
- `data/config.yml` — configuração global do site
- `site/` — código do site (Astro)
- `plugin/` — source do Claude Code plugin (instalável via symlink)
- `docs/` — design docs, planos de implementação, migração

## Desenvolvimento local

Pré-requisitos: Node 22 LTS (recomendado via [mise](https://mise.jdx.dev/)).

```bash
mise install                    # instala Node 22 conforme .mise.toml
cd site && npm install          # dependências do site
npm run dev                     # sobe dev server em http://localhost:4321
```

## Documentação

- **Design:** [docs/superpowers/specs/2026-07-05-pipt-repertorio-design.md](docs/superpowers/specs/2026-07-05-pipt-repertorio-design.md)
- **Plano A (Fundações):** [docs/superpowers/plans/2026-07-05-plano-a-fundacoes.md](docs/superpowers/plans/2026-07-05-plano-a-fundacoes.md)

## Contribuindo

Ver `CONTRIBUTING.md` (a ser criado no Plano C).

## Licença

MIT — ver `LICENSE`.
```

- [ ] **Step 1.4.3: Criar `LICENSE` (MIT)**

```
MIT License

Copyright (c) 2026 odntht (Ministério de Música — PIPT)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 1.4.4: Commit**

```bash
git add .editorconfig README.md LICENSE
git commit -m "chore: editorconfig, README básico e LICENSE MIT"
```

**Marco de verificação do Chunk 1:**

```bash
tree -a -I '.git|node_modules' ~/Documents/pipt-repertorio
```

Esperado no output:
- `data/songs/nada-alem-do-sangue.g.pro`
- `data/songs/nada-alem-do-sangue.a.pro`
- `data/setlists/.gitkeep`
- `data/sections.yml`
- `data/config.yml`
- `docs/superpowers/{specs,plans}/*.md`
- `site/public/logo/mmu.png`, `mmu.svg`, `mmu-small.png` (já commitados antes do Plano A começar)
- `.mise.toml`, `.nvmrc`, `.editorconfig`
- `.gitignore` (já commitado antes do Plano A — cobre `.DS_Store`, `node_modules/`, etc.)
- `LICENSE`, `README.md`

Se algum item acima estiver faltando, ajustar o step anterior antes de seguir.

---

## Chunk 2: Parser cifra-parser (TDD)

Ver spec §4 (formato ChordPro) e §5.5 (regex de acorde canônico + parser SSOT).

### Task 2.1: Setup do site Astro + Vitest

**Files:**
- Create: `site/package.json`
- Create: `site/tsconfig.json`
- Create: `site/astro.config.mjs`
- Create: `site/vitest.config.ts`
- Create: `site/.gitignore`

- [ ] **Step 2.1.1: Init do projeto Astro**

**Estratégia:** usar o initializer oficial do Astro (`npm create astro@latest`) pra ter um projeto Astro válido antes de rodar `astro add`. Sem isso, `astro add` pode falhar por não encontrar `astro.config.mjs`.

```bash
cd ~/Documents/pipt-repertorio
# Se o diretório site/ ainda não existir:
npm create astro@latest -- site --template minimal --typescript strict --no-install --no-git --yes
cd site
npm install
npx astro add react --yes
# Pinar Tailwind v3 explicitamente — o plan inteiro assume sintaxe v3
# (@tailwind base/components/utilities + config file). Se preferir v4,
# reescrever os steps 4.1.1 e 4.1.2 usando @import "tailwindcss" e @theme block.
npm install --save-exact tailwindcss@3 @astrojs/tailwind@5
npm install --save chordsheetjs yaml @vite-pwa/astro
npm install --save-dev vitest
```

**Nota:** fixamos Tailwind v3 pra evitar a divergência de sintaxe entre v3 e v4. Se um dia migrar pra v4, é uma refatoração isolada (só afeta `tailwind.config` e `global.css`).

**Sobre pinning:** o `astro add` grava versões compatíveis no `package.json`. Pra deploy determinístico, `npm shrinkwrap` trava transitives.

- [ ] **Step 2.1.2: Escrever `site/tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "types": ["vitest/globals"],
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  },
  "include": ["src/**/*", "vitest.config.ts"]
}
```

- [ ] **Step 2.1.3: Escrever `site/astro.config.mjs`**

`site` e `base` vêm da env var `PUBLIC_SITE_URL` (default local pra `http://localhost:4321` no dev, e sobrescreve no build de produção via `SITE=https://odntht.github.io npm run build`). Isso mantém Plano A 100% local.

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { VitePWA } from '@vite-pwa/astro';

const SITE = process.env.SITE ?? 'http://localhost:4321';
const BASE = process.env.BASE ?? '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,ico,woff2}'],
      },
      manifest: {
        name: 'PIPT Repertório',
        short_name: 'PIPT',
        theme_color: '#007830',
        background_color: '#000000',
        display: 'standalone',
        icons: [
          { src: `${BASE}logo/mmu-small.png`, sizes: '640x640', type: 'image/png' },
          { src: `${BASE}logo/mmu.png`, sizes: '2560x2560', type: 'image/png' },
        ],
      },
    }),
  ],
});
```

- [ ] **Step 2.1.4: Escrever `site/vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
});
```

- [ ] **Step 2.1.5: Escrever `site/.gitignore`**

```
node_modules/
dist/
.astro/
.vite/
.env
.env.local
*.log
```

- [ ] **Step 2.1.6: Atualizar `site/package.json` — scripts**

Editar o `package.json` gerado, ajustando o campo `scripts`:

```json
{
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 2.1.7: Verificar setup funcionando**

```bash
cd ~/Documents/pipt-repertorio/site
npm run test -- --run
```

Expected: `No test files found` — mas sem crash de configuração. Isso confirma que Vitest está configurado corretamente.

- [ ] **Step 2.1.8: Commit**

```bash
cd ~/Documents/pipt-repertorio
git add site/
git commit -m "chore(site): scaffold Astro 5 + Tailwind + Vitest + PWA"
```

### Task 2.2: Tipos e regex canônico (TDD)

**Files:**
- Create: `site/src/lib/cifra-parser/types.ts`
- Create: `site/src/lib/cifra-parser/chord-regex.ts`
- Create: `site/src/lib/cifra-parser/chord-regex.test.ts`

Ver spec §5.5 (regex canônico).

- [ ] **Step 2.2.1: Escrever teste primeiro (`chord-regex.test.ts`)**

```ts
// site/src/lib/cifra-parser/chord-regex.test.ts
import { describe, it, expect } from 'vitest';
import { CHORD_REGEX, isChord } from './chord-regex';

describe('CHORD_REGEX / isChord', () => {
  describe('accepts common chord notations', () => {
    const chords = [
      'C', 'D', 'E', 'F', 'G', 'A', 'B',
      'Cm', 'Dm', 'Em', 'Fm', 'Gm', 'Am', 'Bm',
      'C#', 'D#', 'F#', 'G#', 'A#',
      'Bb', 'Db', 'Eb', 'Gb', 'Ab',
      'F#m', 'G#m', 'C#m', 'D#m',
      'Bbm', 'Ebm',
      'C7', 'Dm7', 'G7', 'Cmaj7', 'Gmaj7', 'Am7',
      'C9', 'D9', 'G9',
      'Em7(11)', 'C9(11)', 'Am7(9-13)',
      'D/F#', 'G/B', 'C/E', 'A/C#',
      'C9/E', 'D9/F#', 'Em7/G',
      'Cdim', 'Ddim', 'Gsus', 'Csus4', 'Dsus2',
      'Caug', 'Cmin', 'Dbº',
    ];
    it.each(chords)('accepts "%s"', (chord) => {
      expect(isChord(chord)).toBe(true);
    });
  });

  describe('rejects non-chord tokens', () => {
    const nonChords = [
      'hello', 'the', 'and', 'sing',
      '123', '', ' ',
      'X', 'Y', 'Z',                // fora de A-G
      'CC', 'GG',                    // dupla letra sem sufixo
      'Cxyz', 'D-major',             // sufixos inválidos
      '/G', '(', ')',
    ];
    it.each(nonChords)('rejects "%s"', (token) => {
      expect(isChord(token)).toBe(false);
    });
  });
});
```

- [ ] **Step 2.2.2: Rodar o teste (deve falhar)**

```bash
cd site && npm run test -- --run chord-regex
```

Expected: FAIL — módulo não existe.

- [ ] **Step 2.2.3: Escrever `types.ts`**

```ts
// site/src/lib/cifra-parser/types.ts

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
  key: string;                  // ex: "G", "F#m", "Bb"
  tempo?: number | null;        // BPM; null quando tag existe mas vazia
  youtube?: string;
  section: SectionId;
  status: SongStatus;
  tags: string[];               // parseado de "adoracao, cruz"
  notes?: string;
  hinarioNum?: string;          // ex: "061"
  arrangementOf?: string;       // slug de outra versão
  added?: string;               // ISO date
  arrangements: ArrangementRecording[];
}

export type LineKind = 'lyric-with-chords' | 'section-comment' | 'blank';

/** Um pedaço de uma linha: acorde + trecho de letra que vem depois dele. */
export interface LineSegment {
  chord?: string;               // sem colchetes: "G", "Em7(11)"
  text: string;                 // texto até o próximo acorde
}

export interface SongLine {
  kind: LineKind;
  segments: LineSegment[];      // vazio se blank
  comment?: string;             // se kind=section-comment, o texto do {comment:}
}

export interface Song {
  metadata: SongMetadata;
  lines: SongLine[];
  /** Texto ChordPro original, útil pra debug e fallback de renderização. */
  raw: string;
}
```

- [ ] **Step 2.2.4: Escrever `chord-regex.ts`**

```ts
// site/src/lib/cifra-parser/chord-regex.ts

/**
 * Regex canônico de acorde. Fonte da verdade — usada pelo parser e pela UI
 * de submissão (Plano C). Ver spec §5.5.
 *
 * Cobre:
 *   - Tônica A-G, opcionalmente com # ou b
 *   - Qualidade opcional: m, maj, min, dim, aug, sus, º (bemol enarmônico raro)
 *   - Grau numérico opcional: 4, 7, 9, 11, 13
 *   - Tensão entre parênteses: (9), (11), (b5), (9-13), (#11)
 *   - Inversão opcional: /A-G com # ou b
 *
 * Falsos-negativos aceitos:
 *   - Notação com colchetes internos
 *   - Duas ou mais barras (raro)
 */
const CHORD_PATTERN =
  '^[A-G]' +
  '(#|b)?' +
  '(m(?![a-z])|maj|min|dim|aug|sus|º)?' +
  '[0-9]*' +
  '(\\((#|b)?[0-9]+([+-][0-9]+)?\\))?' +
  '(\\/[A-G](#|b)?)?' +
  '$';

export const CHORD_REGEX = new RegExp(CHORD_PATTERN);

export function isChord(token: string): boolean {
  if (!token || token.length === 0) return false;
  return CHORD_REGEX.test(token);
}
```

- [ ] **Step 2.2.5: Rodar teste (deve passar)**

```bash
cd site && npm run test -- --run chord-regex
```

Expected: TODOS os testes passam.

Se algum caso `Bbm` ou `F#m7(11)` falhar, ajustar o regex (é fácil sub-especificar). Após ajuste, todos devem passar.

- [ ] **Step 2.2.6: Commit**

```bash
cd ~/Documents/pipt-repertorio
git add site/src/lib/cifra-parser/
git commit -m "feat(parser): tipos AST + regex canônico de acorde com testes"
```

### Task 2.3: Slugify de tom (TDD)

**Files:**
- Create: `site/src/lib/chordpro/slugify-tom.ts`
- Create: `site/src/lib/chordpro/slugify-tom.test.ts`

Ver spec §4.4 (regra do slugify).

- [ ] **Step 2.3.1: Escrever testes**

```ts
// site/src/lib/chordpro/slugify-tom.test.ts
import { describe, it, expect } from 'vitest';
import { slugifyTom, parseTom } from './slugify-tom';

describe('slugifyTom', () => {
  const cases: [string, string][] = [
    ['G', 'g'], ['A', 'a'], ['B', 'b'], ['C', 'c'],
    ['D', 'd'], ['E', 'e'], ['F', 'f'],
    ['G#', 'gs'], ['F#', 'fs'], ['C#', 'cs'],
    ['Bb', 'bb'], ['Ab', 'ab'], ['Eb', 'eb'],
    ['Am', 'am'], ['Bm', 'bm'], ['Gm', 'gm'],
    ['F#m', 'fsm'], ['C#m', 'csm'],
    ['Bbm', 'bbm'], ['Ebm', 'ebm'],
  ];
  it.each(cases)('slugifies %s → %s', (input, expected) => {
    expect(slugifyTom(input)).toBe(expected);
  });
});

describe('parseTom (inverso do slugify)', () => {
  it('recovers canonical tom from slug', () => {
    expect(parseTom('g')).toBe('G');
    expect(parseTom('bm')).toBe('Bm');
    expect(parseTom('fsm')).toBe('F#m');
    expect(parseTom('bb')).toBe('Bb');
    expect(parseTom('bbm')).toBe('Bbm');
  });
});
```

- [ ] **Step 2.3.2: Rodar (deve falhar — módulo não existe)**

```bash
cd site && npm run test -- --run slugify-tom
```

Expected: FAIL.

- [ ] **Step 2.3.3: Implementar `slugify-tom.ts`**

```ts
// site/src/lib/chordpro/slugify-tom.ts

/**
 * Converte tom canônico ("G", "F#m", "Bb") em slug ("g", "fsm", "bb").
 * Ver spec §4.4.
 *
 * Regra formal: tom.toLowerCase().replace('#', 's')
 * Nota: "Bb" fica "bb" (root duplicada); é o preço de determinismo.
 */
export function slugifyTom(tom: string): string {
  return tom.toLowerCase().replace('#', 's');
}

/**
 * Reverte um slug de tom pro formato canônico.
 * Regra: primeira letra maiúscula; "s" logo após a letra da tônica → "#";
 * "m" no final permanece; "b" imediatamente após tônica é bemol.
 */
export function parseTom(slug: string): string {
  if (!slug || slug.length === 0) return '';
  const chars = slug.split('');
  const tonic = chars[0].toUpperCase();
  let rest = chars.slice(1).join('');
  // troca 's' logo após tônica por '#'
  if (rest.startsWith('s')) {
    rest = '#' + rest.slice(1);
  }
  return tonic + rest;
}
```

- [ ] **Step 2.3.4: Rodar (deve passar)**

```bash
cd site && npm run test -- --run slugify-tom
```

Expected: PASS.

- [ ] **Step 2.3.5: Commit**

```bash
cd ~/Documents/pipt-repertorio
git add site/src/lib/chordpro/slugify-tom.ts site/src/lib/chordpro/slugify-tom.test.ts
git commit -m "feat(chordpro): slugify de tom com testes exaustivos"
```

### Task 2.4: Parser principal (TDD)

**Files:**
- Create: `site/src/lib/cifra-parser/__fixtures__/simple.pro`
- Create: `site/src/lib/cifra-parser/__fixtures__/simple.expected.json`
- Create: `site/src/lib/cifra-parser/parse.ts`
- Create: `site/src/lib/cifra-parser/parse.test.ts`
- Create: `site/src/lib/cifra-parser/index.ts`

- [ ] **Step 2.4.1: Criar fixture `simple.pro`**

```chordpro
{title: Teste}
{artist: Autor Teste}
{key: G}
{section: congregacional}
{status: aprovada}
{tags: adoracao, teste}
{arrangement: https://drive.google.com/file/d/ABC/view | Ensaio 01/01/25}
{arrangement: https://drive.google.com/file/d/XYZ/view}

{comment: Estrofe 1}
[G]Uma linha [D]simples de [G]teste
```

- [ ] **Step 2.4.2: Criar fixture `simple.expected.json`**

```json
{
  "metadata": {
    "title": "Teste",
    "artist": "Autor Teste",
    "key": "G",
    "section": "congregacional",
    "status": "aprovada",
    "tags": ["adoracao", "teste"],
    "arrangements": [
      { "url": "https://drive.google.com/file/d/ABC/view", "label": "Ensaio 01/01/25" },
      { "url": "https://drive.google.com/file/d/XYZ/view" }
    ]
  },
  "lines": [
    { "kind": "blank", "segments": [] },
    { "kind": "section-comment", "segments": [], "comment": "Estrofe 1" },
    {
      "kind": "lyric-with-chords",
      "segments": [
        { "chord": "G", "text": "Uma linha " },
        { "chord": "D", "text": "simples de " },
        { "chord": "G", "text": "teste" }
      ]
    }
  ]
}
```

- [ ] **Step 2.4.3: Escrever `parse.test.ts`**

```ts
// site/src/lib/cifra-parser/parse.test.ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { parseChordPro } from './parse';

const __dirname = dirname(fileURLToPath(import.meta.url));
const readFixture = (name: string): string =>
  readFileSync(join(__dirname, '__fixtures__', name), 'utf-8');

describe('parseChordPro', () => {
  it('parses a simple song fixture matching expected JSON', () => {
    const pro = readFixture('simple.pro');
    const expected = JSON.parse(readFixture('simple.expected.json'));
    const song = parseChordPro(pro);

    expect(song.metadata).toEqual(expected.metadata);
    expect(song.lines).toEqual(expected.lines);
    expect(song.raw).toBe(pro);
  });

  it('rejects when required metadata missing', () => {
    // REQUIRED = ['title', 'key', 'section', 'status'] — primeiro faltante é `key`
    expect(() => parseChordPro('{title: X}')).toThrow(/key/i);
    // Sem title, primeiro erro é title
    expect(() => parseChordPro('{key: G}\n{section: congregacional}\n{status: aprovada}')).toThrow(/title/i);
  });

  it('accepts empty-value tags as placeholders', () => {
    const src = `{title: X}\n{artist: Y}\n{key: G}\n{section: congregacional}\n{status: aprovada}\n{tempo: }\n\n[G]texto`;
    const song = parseChordPro(src);
    expect(song.metadata.tempo).toBeNull();
  });

  it('parses multiple arrangement tags', () => {
    const src = `{title: X}\n{key: G}\n{section: congregacional}\n{status: aprovada}\n{arrangement: https://drive.google.com/a}\n{arrangement: https://drive.google.com/b | Live}\n\n[G]texto`;
    const song = parseChordPro(src);
    expect(song.metadata.arrangements).toHaveLength(2);
    expect(song.metadata.arrangements[1].label).toBe('Live');
  });

  it('preserves text without chords', () => {
    const src = `{title: X}\n{key: G}\n{section: congregacional}\n{status: aprovada}\n\nsó texto sem acordes`;
    const song = parseChordPro(src);
    expect(song.lines[1].kind).toBe('lyric-with-chords');
    expect(song.lines[1].segments).toEqual([{ text: 'só texto sem acordes' }]);
  });

  it('preserves leading whitespace before first chord (alignment)', () => {
    // Padrão comum no docx original: espaços antes do 1º [G] pra alinhar visualmente
    const src = `{title: X}\n{key: G}\n{section: congregacional}\n{status: aprovada}\n\n     [G]Teu sangue`;
    const song = parseChordPro(src);
    expect(song.lines[1].segments).toEqual([
      { text: '     ' },
      { chord: 'G', text: 'Teu sangue' },
    ]);
  });
});
```

- [ ] **Step 2.4.4: Rodar (deve falhar)**

```bash
cd site && npm run test -- --run parse
```

Expected: FAIL.

- [ ] **Step 2.4.5: Implementar `parse.ts`**

```ts
// site/src/lib/cifra-parser/parse.ts
import type {
  Song, SongLine, SongMetadata, LineSegment, ArrangementRecording,
} from './types';

const REQUIRED = ['title', 'key', 'section', 'status'] as const;

/** Tags que vão pro metadata (todas exceto `comment`, que gera SongLine no body). */
const META_TAG_LINE = /^\{(title|artist|key|tempo|youtube|section|status|tags|notes|hinario_num|arrangement_of|arrangement|added):\s*(.*?)\s*\}$/;
const COMMENT_LINE = /^\{comment:\s*(.*?)\s*\}$/;

/**
 * Parse a ChordPro string into a Song AST.
 * Ver spec §4 (formato) e §5.5 (parser SSOT).
 */
export function parseChordPro(src: string): Song {
  const lines = src.split('\n');
  const meta: Partial<SongMetadata> & { arrangements: ArrangementRecording[]; tags: string[] } = {
    arrangements: [],
    tags: [],
  };
  const body: SongLine[] = [];

  for (const rawLine of lines) {
    const line = rawLine.replace(/\r$/, '');

    // 1) Tag de metadata → consome, não vai pro body
    const metaMatch = line.match(META_TAG_LINE);
    if (metaMatch) {
      handleTag(metaMatch[1], metaMatch[2], meta);
      continue;
    }

    // 2) {comment: X} → vira SongLine section-comment no body
    const commentMatch = line.match(COMMENT_LINE);
    if (commentMatch) {
      body.push({ kind: 'section-comment', segments: [], comment: commentMatch[1] });
      continue;
    }

    // 3) Linha em branco
    if (line.trim() === '') {
      body.push({ kind: 'blank', segments: [] });
      continue;
    }

    // 4) Linha de letra+acordes
    body.push(parseBodyLine(line));
  }

  // Trim trailing blanks
  while (body.length && body[body.length - 1].kind === 'blank') body.pop();

  // Validate required (ordem determinística — ver teste)
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
  meta: Partial<SongMetadata> & { arrangements: ArrangementRecording[]; tags: string[] },
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
      // ignore unknown tags for forward compatibility
      break;
  }
}

function parseBodyLine(line: string): SongLine {
  // Encontrar todos os pares [chord]text
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
```

Notas:
- **`META_TAG_LINE` explicitamente lista as tags de metadata** — impede que `{comment: X}` seja consumido erroneamente pelo bloco de tag.
- **`COMMENT_LINE` é chequado depois**, e sempre gera uma `SongLine` no body.
- O regex `re` é intencionalmente simples; fixture cobre os casos comuns.

- [ ] **Step 2.4.6: Escrever `index.ts` (public API)**

```ts
// site/src/lib/cifra-parser/index.ts
export { parseChordPro } from './parse';
export { CHORD_REGEX, isChord } from './chord-regex';
export type { Song, SongMetadata, SongLine, LineSegment, ArrangementRecording, SectionId, SongStatus, LineKind } from './types';
```

- [ ] **Step 2.4.7: Rodar (deve passar)**

```bash
cd site && npm run test -- --run
```

Expected: TODOS os testes passam.

- [ ] **Step 2.4.8: Commit**

```bash
cd ~/Documents/pipt-repertorio
git add site/src/lib/cifra-parser/
git commit -m "feat(parser): parseChordPro com fixtures e validação de metadados obrigatórios"
```

**Marco de verificação do Chunk 2:**

```bash
cd site && npm run test -- --run
```

Esperado: ~90 testes passam (com `it.each`, chord-regex sozinho gera ~58 casos, slugify ~25, parse ~5). Nenhum falha.

---

## Chunk 3: Render + transpose

Objetivo: transformar o AST do parser em HTML "cifra sobre letra" e permitir transposição via ChordSheetJS.

### Task 3.1: Render "cifra sobre letra" (TDD)

**Files:**
- Create: `site/src/lib/chordpro/render.ts`
- Create: `site/src/lib/chordpro/render.test.ts`

**Estratégia de render:** cada linha `lyric-with-chords` vira 2 linhas HTML — uma com acordes espaçados na posição correta, uma com a letra. Preserva monospace + `white-space: pre` no CSS pra alinhar.

- [ ] **Step 3.1.1: Escrever teste primeiro**

```ts
// site/src/lib/chordpro/render.test.ts
import { describe, it, expect } from 'vitest';
import { renderChordsOverLyrics } from './render';
import type { SongLine } from '@/lib/cifra-parser/types';

describe('renderChordsOverLyrics', () => {
  it('renders single segment with chord above lyric', () => {
    const line: SongLine = {
      kind: 'lyric-with-chords',
      segments: [{ chord: 'G', text: 'Hello world' }],
    };
    const out = renderChordsOverLyrics([line]);
    expect(out).toContain('G');
    expect(out).toContain('Hello world');
    // Chord line before lyric line, both wrapped
    const chordIdx = out.indexOf('G');
    const lyricIdx = out.indexOf('Hello');
    expect(chordIdx).toBeLessThan(lyricIdx);
  });

  it('aligns chord to correct column', () => {
    const line: SongLine = {
      kind: 'lyric-with-chords',
      segments: [
        { chord: 'G', text: 'Hello ' },
        { chord: 'D', text: 'world' },
      ],
    };
    const out = renderChordsOverLyrics([line]);
    // "D" appears at column 6 (after "Hello ")
    const lines = out.split('\n').filter(Boolean);
    const chordRow = lines.find((l) => l.includes('G') && l.includes('D'));
    expect(chordRow).toBeDefined();
    // Position of 'D' in chord row should match position of 'w' in lyric row
    const lyricRow = lines[lines.indexOf(chordRow!) + 1];
    expect(chordRow!.indexOf('D')).toBe(lyricRow.indexOf('w'));
  });

  it('renders section-comment as its own row without chord-like brackets', () => {
    const line: SongLine = {
      kind: 'section-comment',
      segments: [],
      comment: 'Refrão',
    };
    const out = renderChordsOverLyrics([line]);
    expect(out).toContain('Refrão');
    // Não deve ficar entre colchetes (evita colidir com notação de acorde)
    expect(out).not.toMatch(/\[Refrão\]/);
  });

  it('renders blank line as an empty line in the output', () => {
    const line: SongLine = { kind: 'blank', segments: [] };
    const line2: SongLine = { kind: 'lyric-with-chords', segments: [{ text: 'depois' }] };
    const out = renderChordsOverLyrics([line, line2]);
    // Blank line produz uma linha vazia entre conteúdos
    const rows = out.split('\n');
    expect(rows[0]).toBe('');
    expect(rows[rows.length - 1]).toBe('depois');
  });
});
```

- [ ] **Step 3.1.2: Rodar (deve falhar)**

```bash
cd site && npm run test -- --run render
```

- [ ] **Step 3.1.3: Implementar `render.ts`**

```ts
// site/src/lib/chordpro/render.ts
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
      // Formato "--- Refrão ---" (evita conflito visual com notação [Acorde])
      out.push(`--- ${line.comment ?? ''} ---`);
      continue;
    }
    // lyric-with-chords: constrói 2 linhas paralelas
    let chordRow = '';
    let lyricRow = '';
    for (const seg of line.segments) {
      if (seg.chord) {
        // padroniza chordRow até o comprimento atual do lyricRow, depois adiciona o acorde
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
```

- [ ] **Step 3.1.4: Rodar (deve passar)**

```bash
cd site && npm run test -- --run render
```

Expected: PASS. Se falhar por causa de alinhamento, ajustar a lógica de padding — o teste é rígido nisso.

- [ ] **Step 3.1.5: Commit**

```bash
cd ~/Documents/pipt-repertorio
git add site/src/lib/chordpro/render.ts site/src/lib/chordpro/render.test.ts
git commit -m "feat(chordpro): renderChordsOverLyrics — cifra sobre letra em texto plano"
```

### Task 3.2: Transposição chord-by-chord (TDD)

**Files:**
- Create: `site/src/lib/chordpro/transpose.ts`
- Create: `site/src/lib/chordpro/transpose.test.ts`

**Estratégia:** ao invés de round-trip pelo ChordSheetJS Formatter (que descarta tags custom como `{section:}`), transpomos **acorde por acorde** in-place, mutando `song.lines[].segments[].chord`. Usamos `ChordSheetJS.Chord.parse()` só pra transpor a string do acorde individual. Isso preserva 100% dos metadados.

**Semântica de `semitonesBetween`:** direcional (sem normalização pra caminho mais curto) — subida positiva, descida negativa. `C → G = +7` (7 semitons pra cima); `G → C = -7`.

- [ ] **Step 3.2.1: Escrever testes**

```ts
// site/src/lib/chordpro/transpose.test.ts
import { describe, it, expect } from 'vitest';
import { transposeSong, semitonesBetween } from './transpose';
import { parseChordPro } from '@/lib/cifra-parser';

const source = `{title: X}
{artist: Y}
{key: G}
{section: congregacional}
{status: aprovada}

[G]texto [D]outra [Em7]parte`;

describe('semitonesBetween (direcional, sem shortest-path)', () => {
  const cases: [string, string, number][] = [
    ['G', 'A', 2],
    ['A', 'G', -2],
    ['G', 'G', 0],
    ['C', 'G', 7],       // C→G = 7 semitons pra cima
    ['G', 'C', -7],      // G→C = 7 pra baixo
    ['F#m', 'G#m', 2],
    ['Bb', 'C', 2],
  ];
  it.each(cases)('%s → %s = %d semitones', (from, to, expected) => {
    expect(semitonesBetween(from, to)).toBe(expected);
  });
});

describe('transposeSong', () => {
  it('transposes G → A shifting each chord one whole tone up', () => {
    const song = parseChordPro(source);
    const transposed = transposeSong(song, 'A');
    expect(transposed.metadata.key).toBe('A');
    // acha a linha lyric-with-chords (índice varia com blanks)
    const lyricLine = transposed.lines.find((l) => l.kind === 'lyric-with-chords');
    const chords = lyricLine?.segments.map((s) => s.chord).filter(Boolean);
    expect(chords).toEqual(['A', 'E', 'F#m7']);
  });

  it('is idempotent when target key equals current key', () => {
    const song = parseChordPro(source);
    const transposed = transposeSong(song, 'G');
    const lyricLine = transposed.lines.find((l) => l.kind === 'lyric-with-chords');
    const chords = lyricLine?.segments.map((s) => s.chord).filter(Boolean);
    expect(chords).toEqual(['G', 'D', 'Em7']);
  });

  it('handles slash chords', () => {
    const src = `{title: X}\n{key: G}\n{section: congregacional}\n{status: aprovada}\n\n[D/F#]texto`;
    const song = parseChordPro(src);
    const transposed = transposeSong(song, 'A');
    const lyricLine = transposed.lines.find((l) => l.kind === 'lyric-with-chords');
    const chord = lyricLine?.segments[0].chord;
    expect(chord).toBe('E/G#');
  });

  it('preserves custom metadata (section, status, tags)', () => {
    const song = parseChordPro(source);
    const transposed = transposeSong(song, 'A');
    expect(transposed.metadata.section).toBe('congregacional');
    expect(transposed.metadata.status).toBe('aprovada');
    expect(transposed.metadata.title).toBe('X');
  });
});
```

- [ ] **Step 3.2.2: Rodar (deve falhar)**

```bash
cd site && npm run test -- --run transpose
```

- [ ] **Step 3.2.3: Implementar `transpose.ts`**

```ts
// site/src/lib/chordpro/transpose.ts
import ChordSheetJS from 'chordsheetjs';
import type { Song, SongLine } from '@/lib/cifra-parser/types';

const NOTES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
const FLAT_TO_SHARP: Record<string, string> = {
  Db: 'C#', Eb: 'D#', Gb: 'F#', Ab: 'G#', Bb: 'A#',
};

function normalizeRoot(root: string): string {
  return FLAT_TO_SHARP[root] ?? root;
}

/** Extrai a raiz de um tom, ignorando `m` de menor. `"F#m"` → `"F#"`, `"Bb"` → `"Bb"`. */
function tonicRoot(tom: string): string {
  const m = tom.match(/^([A-G])(#|b)?/);
  return m ? (m[1] + (m[2] ?? '')) : tom;
}

/**
 * Diferença em semitons entre dois tons — direcional (positivo = subir, negativo = descer).
 * NÃO normaliza pro caminho mais curto.
 */
export function semitonesBetween(from: string, to: string): number {
  const fromRoot = normalizeRoot(tonicRoot(from));
  const toRoot = normalizeRoot(tonicRoot(to));
  const idx1 = (NOTES_SHARP as readonly string[]).indexOf(fromRoot);
  const idx2 = (NOTES_SHARP as readonly string[]).indexOf(toRoot);
  if (idx1 === -1 || idx2 === -1) return 0;
  return idx2 - idx1;
}

/**
 * Transpõe uma Song pro tom-alvo, mutando in-place os acordes das segments.
 * Preserva 100% dos metadados (sem passar por Formatter/roundtrip).
 * Ver spec §4.1 (transposição como recurso destravado pelo ChordPro).
 */
export function transposeSong(song: Song, targetKey: string): Song {
  const delta = semitonesBetween(song.metadata.key, targetKey);

  if (delta === 0) {
    return { ...song, metadata: { ...song.metadata, key: targetKey } };
  }

  const transposeChord = (chord: string): string => {
    try {
      const parsed = ChordSheetJS.Chord.parse(chord);
      if (!parsed) return chord;
      const shifted = parsed.transpose(delta);
      return shifted ? shifted.toString() : chord;
    } catch {
      // Se ChordSheetJS não parseia (acorde exótico), deixa como está
      return chord;
    }
  };

  const newLines: SongLine[] = song.lines.map((line) => {
    if (line.kind !== 'lyric-with-chords') return line;
    return {
      ...line,
      segments: line.segments.map((seg) =>
        seg.chord ? { ...seg, chord: transposeChord(seg.chord) } : seg,
      ),
    };
  });

  return {
    ...song,
    metadata: { ...song.metadata, key: targetKey },
    lines: newLines,
  };
}
```

**Nota sobre API do ChordSheetJS:** `Chord.parse()` e `.transpose()` são a superfície estável (existem desde versões antigas). Se `Chord.parse` retornar `null` pra algum acorde válido (raro), o teste vai apontar e a gente adiciona um fallback manual.

- [ ] **Step 3.2.4: Rodar (deve passar)**

```bash
cd site && npm run test -- --run transpose
```

Expected: PASS. Se `ChordSheetJS.Chord.parse` não existir na versão instalada, checar API atual em `node_modules/chordsheetjs/README.md` (pode ser `parseChord` ou similar) e ajustar.

- [ ] **Step 3.2.5: Commit**

```bash
cd ~/Documents/pipt-repertorio
git add site/src/lib/chordpro/transpose.ts site/src/lib/chordpro/transpose.test.ts
git commit -m "feat(chordpro): transposição chord-by-chord (in-place, preserva metadata)"
```

**Marco de verificação do Chunk 3:**

```bash
cd site && npm run test -- --run
```

Esperado: ~100+ testes passam (adiciona ~4 de render + ~11 de transpose).

---

---

## Chunk 4: Site Astro — layout, componentes e páginas de música

Objetivo: site local que renderiza as 2 músicas seed com transposição, PDF, PWA offline e badges coloridos por seção.

### Task 4.1: Setup do Tailwind com a paleta MMU

**Files:**
- Create: `site/tailwind.config.mjs` (ou ajuste do gerado pelo `astro add tailwind`)
- Create: `site/src/styles/global.css`

- [ ] **Step 4.1.1: Escrever `site/tailwind.config.mjs`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,tsx,ts,mdx,md,html}'],
  darkMode: 'media',   // segue o OS por default; toggle manual pode override via .dark
  theme: {
    extend: {
      colors: {
        mmu: {
          green: '#007830',
          black: '#000000',
          white: '#FFFFFF',
        },
        section: {
          congregacional: '#007830',  // verde
          hinario: '#3B82F6',          // azul
          infantil: '#F59E0B',         // amarelo
          inadequada: '#EF4444',       // vermelho
        },
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
};
```

- [ ] **Step 4.1.2: Escrever `site/src/styles/global.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    color-scheme: light dark;
  }
  body {
    @apply bg-white text-gray-900 dark:bg-mmu-black dark:text-gray-100;
    font-family: system-ui, -apple-system, sans-serif;
  }
}

@layer components {
  .cifra-body {
    @apply font-mono text-base leading-relaxed whitespace-pre;
  }
  .cifra-chord {
    @apply text-mmu-green font-bold;
  }
}

/* Print/PDF-specific: forçar cores, ocultar navegação, uma música por página */
@media print {
  .no-print, nav, header, footer { display: none !important; }
  .cifra-body {
    color: #000 !important;
    background: #fff !important;
    page-break-inside: avoid;
  }
  .cifra-chord {
    color: #000 !important;
    font-weight: bold;
  }
}
```

- [ ] **Step 4.1.3: Importar o CSS global no layout base (feito no Task 4.2)**

- [ ] **Step 4.1.4: Commit**

```bash
cd ~/Documents/pipt-repertorio
git add site/tailwind.config.mjs site/src/styles/global.css
git commit -m "feat(site): tailwind + paleta MMU + estilos base pra cifra e print"
```

### Task 4.2: Layout base + componentes de UI compartilhados

**Files:**
- Create: `site/src/layouts/BaseLayout.astro`
- Create: `site/src/components/SiteHeader.astro`
- Create: `site/src/components/SectionBadge.astro`

- [ ] **Step 4.2.1: Escrever `site/src/components/SectionBadge.astro`**

```astro
---
interface Props {
  section: 'congregacional' | 'hinario' | 'infantil' | 'inadequada';
}
const { section } = Astro.props;

const labels: Record<Props['section'], string> = {
  congregacional: 'Congregacional',
  hinario: 'Hinário',
  infantil: 'Infantil',
  inadequada: 'Inadequada',
};

const bgClass: Record<Props['section'], string> = {
  congregacional: 'bg-section-congregacional',
  hinario: 'bg-section-hinario',
  infantil: 'bg-section-infantil',
  inadequada: 'bg-section-inadequada',
};
---

<span class={`inline-block px-2 py-1 rounded text-xs font-semibold text-white ${bgClass[section]}`}>
  {labels[section]}
</span>
```

- [ ] **Step 4.2.2: Escrever `site/src/components/SiteHeader.astro`**

```astro
---
const base = import.meta.env.BASE_URL;
---

<header class="border-b border-gray-200 dark:border-gray-800 py-3 px-4 flex items-center gap-3">
  <a href={base} class="flex items-center gap-2 hover:opacity-80">
    <img src={`${base}logo/mmu-small.png`} alt="MMU" class="h-10 w-10 rounded" />
    <div class="flex flex-col leading-tight">
      <span class="font-bold text-mmu-green">PIPT Repertório</span>
      <span class="text-xs text-gray-500 dark:text-gray-400">Ministério de Música</span>
    </div>
  </a>
  <nav class="ml-auto flex gap-4 text-sm no-print">
    <a href={`${base}musicas`} class="hover:text-mmu-green">Músicas</a>
    <a href={`${base}sobre`} class="hover:text-mmu-green">Sobre</a>
  </nav>
</header>
```

- [ ] **Step 4.2.3: Escrever `site/src/layouts/BaseLayout.astro`**

```astro
---
import '@/styles/global.css';
import SiteHeader from '@/components/SiteHeader.astro';

interface Props {
  title: string;
  description?: string;
}
const { title, description } = Astro.props;
---

<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#007830" />
    <link rel="icon" type="image/png" href={`${import.meta.env.BASE_URL}logo/mmu-small.png`} />
    <title>{title} · PIPT Repertório</title>
    {description && <meta name="description" content={description} />}
  </head>
  <body>
    <SiteHeader />
    <main class="max-w-4xl mx-auto px-4 py-6">
      <slot />
    </main>
  </body>
</html>
```

- [ ] **Step 4.2.4: Commit**

```bash
cd ~/Documents/pipt-repertorio
git add site/src/layouts/ site/src/components/
git commit -m "feat(site): BaseLayout + SiteHeader + SectionBadge"
```

### Task 4.3: Loader de músicas (build-time)

**Files:**
- Create: `site/src/lib/songs/load.ts`
- Create: `site/src/lib/songs/load.test.ts`
- Create: `site/src/lib/songs/slug.ts`
- Create: `site/src/lib/songs/slug.test.ts`

**Responsabilidade:** ler todos os `.pro` de `data/songs/`, parsear, e expor um índice de músicas com metadados + AST — pronto pra Astro consumir em build.

- [ ] **Step 4.3.1: Escrever teste de `slug.ts` (extrai slug e tom do filename)**

```ts
// site/src/lib/songs/slug.test.ts
import { describe, it, expect } from 'vitest';
import { parseFilename } from './slug';

describe('parseFilename', () => {
  it('handles simple slug + tom', () => {
    expect(parseFilename('nada-alem-do-sangue.g.pro'))
      .toEqual({ slug: 'nada-alem-do-sangue', tom: 'g', qualifiers: [] });
  });

  it('handles multiple qualifiers before tom', () => {
    expect(parseFilename('em-espirito-em-verdade.arranjo-2.g.pro'))
      .toEqual({ slug: 'em-espirito-em-verdade', tom: 'g', qualifiers: ['arranjo-2'] });
  });

  it('handles sharp tom slug', () => {
    expect(parseFilename('ainda-que-a-figueira.fernandinho.fsm.pro'))
      .toEqual({ slug: 'ainda-que-a-figueira', tom: 'fsm', qualifiers: ['fernandinho'] });
  });

  it('rejects filename without .pro extension', () => {
    expect(() => parseFilename('foo.txt')).toThrow();
  });
});
```

- [ ] **Step 4.3.2: Implementar `slug.ts`**

```ts
// site/src/lib/songs/slug.ts

export interface ParsedFilename {
  slug: string;
  tom: string;              // slug de tom (ex: "g", "fsm", "bb")
  qualifiers: string[];     // ordem preservada, ex: ["arranjo-2"] ou []
}

/**
 * Parse do filename convention `{slug}[.{qualifier}]*.{tom}.pro`
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
```

- [ ] **Step 4.3.3: Rodar teste de `slug.ts` (deve passar)**

```bash
cd site && npm run test -- --run slug
```

- [ ] **Step 4.3.4: Escrever teste do loader**

```ts
// site/src/lib/songs/load.test.ts
import { describe, it, expect } from 'vitest';
import { loadAllSongs } from './load';

describe('loadAllSongs', () => {
  it('carrega as 2 músicas seed', () => {
    const songs = loadAllSongs();
    expect(songs.length).toBeGreaterThanOrEqual(2);
    const slugs = new Set(songs.map((s) => s.slug));
    expect(slugs.has('nada-alem-do-sangue')).toBe(true);
  });

  it('agrupa versões pela slug com múltiplos tons', () => {
    const songs = loadAllSongs();
    const nada = songs.filter((s) => s.slug === 'nada-alem-do-sangue');
    expect(nada.length).toBe(2);
    const toms = new Set(nada.map((s) => s.tom));
    expect(toms.has('g')).toBe(true);
    expect(toms.has('a')).toBe(true);
  });

  it('cada música tem metadata parseado', () => {
    const [first] = loadAllSongs();
    expect(first.song.metadata.title).toBeTruthy();
    expect(first.song.metadata.section).toBeTruthy();
  });
});
```

- [ ] **Step 4.3.5: Implementar `load.ts` (via `import.meta.glob`)**

```ts
// site/src/lib/songs/load.ts
import { parseChordPro } from '@/lib/cifra-parser';
import type { Song } from '@/lib/cifra-parser/types';
import { parseFilename } from './slug';

/**
 * Vite/Astro `import.meta.glob` — resolve em build-time, lê o conteúdo
 * como string via `?raw`. Elimina fragilidade de path relativo.
 * O prefix `/data/songs` é resolvido pela raiz do projeto Astro.
 */
const rawFiles = import.meta.glob<string>('/../data/songs/*.pro', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export interface SongEntry {
  slug: string;
  tom: string;
  qualifiers: string[];
  song: Song;
  filename: string;
}

let cached: SongEntry[] | null = null;

/**
 * Lê todos os arquivos .pro em data/songs/ e retorna array com AST parseado.
 * Chamado em build-time pelas páginas Astro (via getStaticPaths).
 */
export function loadAllSongs(): SongEntry[] {
  if (cached) return cached;
  const entries: SongEntry[] = [];
  for (const [path, raw] of Object.entries(rawFiles)) {
    const filename = path.split('/').pop()!;
    const parsed = parseFilename(filename);
    const song = parseChordPro(raw);
    entries.push({ ...parsed, song, filename });
  }
  cached = entries;
  return entries;
}

/** Retorna todas as versões (tons) de uma slug específica. */
export function loadSongVersions(slug: string): SongEntry[] {
  return loadAllSongs().filter((s) => s.slug === slug);
}
```

**Nota sobre teste de `load.ts`:** Vitest não suporta `import.meta.glob` nativamente (é um recurso Vite). Rodar os testes de `load.ts` sob o config do Vitest requer o preset `vite` do Vitest. Se o teste falhar por isso, ajustar `vitest.config.ts` pra usar `defineConfig` do `vitest/config` que já tem Vite integrado (é o caso do Step 2.1.4) — deve funcionar out-of-the-box. Se ainda assim falhar, converter o teste pra rodar contra uma pasta stub temporária (não é o esforço agora — testar em integração via build de produção também vale).

- [ ] **Step 4.3.6: Rodar todos os testes**

```bash
cd site && npm run test -- --run
```

Expected: todos passam.

- [ ] **Step 4.3.7: Commit**

```bash
cd ~/Documents/pipt-repertorio
git add site/src/lib/songs/
git commit -m "feat(site): loader de músicas (parseFilename + loadAllSongs) com testes"
```

### Task 4.4: Página de detalhe da música + SongViewer (React island)

**Files:**
- Create: `site/src/components/SongViewer.tsx`
- Create: `site/src/pages/musicas/[slug]/[tom].astro`
- Create: `site/src/pages/musicas/[slug]/index.astro`

**Divisão de responsabilidades:**
- `[tom].astro` — página Astro estática que gera rotas via `getStaticPaths`, carrega Song no build, e passa como prop pro `<SongViewer />` (React island).
- `SongViewer.tsx` — ilha interativa: seletor de tom (dispara `transposeSong` no cliente), auto-scroll com slider, controles de zoom, botão PDF.
- `[slug]/index.astro` — redireciona pra primeira versão disponível.

- [ ] **Step 4.4.1: Escrever `SongViewer.tsx`**

```tsx
// site/src/components/SongViewer.tsx
import { useMemo, useState, useEffect, useRef } from 'react';
import type { Song } from '@/lib/cifra-parser/types';
import { transposeSong } from '@/lib/chordpro/transpose';
import { renderChordsOverLyrics } from '@/lib/chordpro/render';

interface Props {
  song: Song;
  availableToms: string[];   // ex: ['g', 'a']
  slug: string;
  base: string;              // BASE_URL do Astro
}

const ALL_TONS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

export default function SongViewer({ song, availableToms, slug, base }: Props) {
  const [targetKey, setTargetKey] = useState<string>(song.metadata.key);
  const [fontSize, setFontSize] = useState<number>(16);
  const [autoScrollSpeed, setAutoScrollSpeed] = useState<number>(0); // 0 = off; 1-10 = pixels/s
  const scrollRef = useRef<number | null>(null);

  const transposed = useMemo(() => transposeSong(song, targetKey), [song, targetKey]);
  const rendered = useMemo(() => renderChordsOverLyrics(transposed.lines), [transposed]);

  useEffect(() => {
    if (autoScrollSpeed === 0) {
      if (scrollRef.current) window.cancelAnimationFrame(scrollRef.current);
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
      if (scrollRef.current) window.cancelAnimationFrame(scrollRef.current);
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
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-1 text-sm">
          <button onClick={() => setFontSize((f) => Math.max(10, f - 2))} className="px-2 border rounded">A-</button>
          <span>{fontSize}px</span>
          <button onClick={() => setFontSize((f) => Math.min(32, f + 2))} className="px-2 border rounded">A+</button>
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

        <button onClick={() => window.print()} className="ml-auto px-3 py-1 border rounded text-sm">
          Imprimir / PDF
        </button>
      </div>

      {availableToms.length > 1 && (
        <div className="flex gap-2 mb-4 no-print text-sm">
          <span>Versões:</span>
          {availableToms.map((t) => (
            <a key={t} href={`${base}musicas/${slug}/${t}`} className="underline hover:text-mmu-green">
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
```

- [ ] **Step 4.4.2: Escrever `site/src/pages/musicas/[slug]/[tom].astro`**

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import SectionBadge from '@/components/SectionBadge.astro';
import SongViewer from '@/components/SongViewer';
import { loadAllSongs } from '@/lib/songs/load';

export async function getStaticPaths() {
  const songs = loadAllSongs();
  return songs.map((entry) => ({
    params: { slug: entry.slug, tom: entry.tom },
    props: {
      song: entry.song,
      availableToms: songs.filter((s) => s.slug === entry.slug).map((s) => s.tom),
    },
  }));
}

const { song, availableToms } = Astro.props;
const { slug } = Astro.params;
const base = import.meta.env.BASE_URL;
---

<BaseLayout title={song.metadata.title}>
  <article>
    <header class="mb-4">
      <h1 class="text-2xl font-bold">{song.metadata.title}</h1>
      <div class="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
        {song.metadata.artist && <span>{song.metadata.artist}</span>}
        {song.metadata.artist && <span>·</span>}
        <SectionBadge section={song.metadata.section} />
        {song.metadata.tags.length > 0 && (
          <>
            <span>·</span>
            <span>{song.metadata.tags.join(', ')}</span>
          </>
        )}
      </div>
      {song.metadata.youtube && (
        <a
          href={song.metadata.youtube}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-block mt-2 text-sm text-mmu-green hover:underline no-print"
        >
          ▶ YouTube (referência) ↗
        </a>
      )}
    </header>

    <SongViewer client:load song={song} availableToms={availableToms} slug={slug!} base={base} />

    {song.metadata.arrangements.length > 0 && (
      <section class="mt-8 border-t pt-4 no-print">
        <h2 class="text-lg font-semibold mb-2">🎧 Gravações do ministério</h2>
        <ul class="space-y-1">
          {song.metadata.arrangements.map((a, i) => (
            <li>
              <a href={a.url} target="_blank" rel="noopener noreferrer" class="text-mmu-green hover:underline">
                {a.label ?? `Gravação ${i + 1}`} ↗
              </a>
            </li>
          ))}
        </ul>
      </section>
    )}
  </article>
</BaseLayout>
```

- [ ] **Step 4.4.3: Escrever `site/src/pages/musicas/[slug]/index.astro`**

`Astro.redirect()` em `output: 'static'` (default do Astro 5) gera um `<meta http-equiv="refresh">` no HTML — funciona pra rota estática. Se algum dia trocar pra `output: 'hybrid'` ou `'server'`, revalidar.

```astro
---
import { loadAllSongs } from '@/lib/songs/load';

export async function getStaticPaths() {
  const songs = loadAllSongs();
  const bySlug = new Map<string, string>();
  for (const s of songs) {
    if (!bySlug.has(s.slug)) bySlug.set(s.slug, s.tom);
  }
  return Array.from(bySlug.entries()).map(([slug, tom]) => ({
    params: { slug },
    props: { defaultTom: tom },
  }));
}

const { slug } = Astro.params;
const { defaultTom } = Astro.props;
return Astro.redirect(`${import.meta.env.BASE_URL}musicas/${slug}/${defaultTom}`);
---
```

- [ ] **Step 4.4.4: Rodar `astro check`**

```bash
cd site && npx astro check
```

Expected: 0 erros de tipo. Se aparecer erro em `SongViewer` importado sem `.default`, ajustar o `import`.

**Nota sobre `client:load` vs `client:idle`:** o `SongViewer` está marcado como `client:load`. Como `chordsheetjs` (usado pra transpor) é ~50KB minified, hidratar antes do usuário interagir custa nada perceptível — o `pre` do Astro renderiza o texto imediatamente e a hidratação da ilha só ativa os controles depois. Se um dia notar TTI ruim, trocar pra `client:idle` (o `<pre>` inicial já mostra a cifra sem depender do JS).

- [ ] **Step 4.4.5: Commit**

```bash
cd ~/Documents/pipt-repertorio
git add site/src/components/SongViewer.tsx site/src/pages/musicas/
git commit -m "feat(site): página de música com SongViewer React island (transpose/zoom/PDF/autoscroll)"
```

### Task 4.5: Índice `/musicas` e home

**Files:**
- Create: `site/src/pages/musicas/index.astro`
- Create: `site/src/pages/index.astro`
- Create: `site/src/pages/sobre.astro`

- [ ] **Step 4.5.1: Escrever `site/src/pages/musicas/index.astro`**

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import SectionBadge from '@/components/SectionBadge.astro';
import { loadAllSongs } from '@/lib/songs/load';

const base = import.meta.env.BASE_URL;

// Agrupar por slug (uma entrada por música, com lista de tons)
const songs = loadAllSongs();
const bySlug = new Map<string, { slug: string; song: (typeof songs)[0]['song']; toms: string[] }>();
for (const s of songs) {
  const existing = bySlug.get(s.slug);
  if (existing) {
    existing.toms.push(s.tom);
  } else {
    bySlug.set(s.slug, { slug: s.slug, song: s.song, toms: [s.tom] });
  }
}
const entries = Array.from(bySlug.values()).sort((a, b) =>
  a.song.metadata.title.localeCompare(b.song.metadata.title, 'pt-BR')
);
---

<BaseLayout title="Músicas">
  <h1 class="text-2xl font-bold mb-4">Músicas</h1>
  <p class="text-sm text-gray-500 mb-4">{entries.length} músicas · {songs.length} versões</p>

  <ul class="space-y-2">
    {entries.map(({ slug, song, toms }) => (
      <li class="border-b pb-2">
        <a href={`${base}musicas/${slug}`} class="flex flex-wrap items-center gap-2 hover:text-mmu-green">
          <span class="font-semibold">{song.metadata.title}</span>
          {song.metadata.artist && <span class="text-sm text-gray-500">{song.metadata.artist}</span>}
          <SectionBadge section={song.metadata.section} />
          <span class="ml-auto text-sm text-gray-500">
            {toms.map((t) => t.toUpperCase()).join(' · ')}
          </span>
        </a>
      </li>
    ))}
  </ul>
</BaseLayout>
```

- [ ] **Step 4.5.2: Escrever `site/src/pages/index.astro` (home mínimo)**

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import { loadAllSongs } from '@/lib/songs/load';

const base = import.meta.env.BASE_URL;
const songs = loadAllSongs();
const totalMusicas = new Set(songs.map((s) => s.slug)).size;
---

<BaseLayout title="Início">
  <section class="text-center py-12">
    <img
      src={`${base}logo/mmu.png`}
      alt="MMU"
      class="mx-auto w-32 h-32 rounded-lg mb-6"
    />
    <h1 class="text-3xl font-bold mb-2">PIPT Repertório</h1>
    <p class="text-gray-600 dark:text-gray-400 mb-6">
      Ministério de Música — Presbiteriana Independente da PIPT
    </p>
    <a
      href={`${base}musicas`}
      class="inline-block bg-mmu-green text-white px-6 py-3 rounded font-semibold hover:opacity-90"
    >
      Ver {totalMusicas === 1 ? 'a 1 música' : `as ${totalMusicas} músicas`} do repertório
    </a>
  </section>
</BaseLayout>
```

- [ ] **Step 4.5.3: Escrever `site/src/pages/sobre.astro`**

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
---

<BaseLayout title="Sobre">
  <h1 class="text-2xl font-bold mb-4">Sobre</h1>
  <p class="mb-4">
    Este é o repositório digital do repertório do Ministério de Música da PIPT.
    Ele consolida músicas congregacionais, hinos do Novo Cântico, músicas infantis
    e um registro de músicas consideradas inadequadas ao culto público (por transparência).
  </p>
  <p class="mb-4">
    Todo o conteúdo é versionado no GitHub, permite transposição em tempo real,
    exportação em PDF e uso offline no celular. Governança e política de escolha
    de repertório serão detalhadas em versão futura.
  </p>
  <p class="text-sm text-gray-500 mt-8">
    Para contribuir: veja <code>CONTRIBUTING.md</code> (a ser publicado no Plano C).
  </p>
</BaseLayout>
```

- [ ] **Step 4.5.4: Rodar dev server e verificar visualmente**

```bash
cd site && npm run dev
```

Abrir `http://localhost:4321/` (o dev usa `base=/` por default).

Checklist visual:
- [ ] Home mostra a logo MMU centralizada, título, e botão "Ver a 1 música do repertório" (singular quando total = 1)
- [ ] `/musicas` lista "Nada Além do Sangue" com badge "Congregacional" (verde) e "G · A"
- [ ] `/musicas/nada-alem-do-sangue` redireciona pra `/musicas/nada-alem-do-sangue/g`
- [ ] Página da música mostra título, artista, badge verde, link YouTube, seletor de tom
- [ ] Trocar tom pra "A" no seletor faz os acordes mudarem em tempo real
- [ ] Botão "Imprimir / PDF" abre o print preview do browser sem navegação
- [ ] Aumentar/diminuir fonte funciona
- [ ] Slider de auto-scroll faz a página rolar
- [ ] Dark mode segue o OS (mudar tema do sistema pra ver)

- [ ] **Step 4.5.5: Verificar build de produção + PWA**

O PWA (Service Worker) do `@vite-pwa/astro` só é gerado em **build de produção**, não em `astro dev`. Pra verificar o SW, precisa buildar e usar `npm run preview`.

```bash
cd site
SITE=https://odntht.github.io BASE=/pipt-repertorio/ npm run build
npm run preview   # sobe servidor pra testar o dist/
```

Expected: build completa sem erros; `site/dist/` gerado com `manifest.webmanifest` + `sw.js`. Abrir `http://localhost:4321/pipt-repertorio/` no browser, DevTools → Application → Service Workers → deve mostrar SW registrado.

- [ ] **Step 4.5.6: Commit**

```bash
cd ~/Documents/pipt-repertorio
git add site/src/pages/
git commit -m "feat(site): home, índice /musicas e /sobre"
```

**Marco de verificação do Chunk 4:**

- `cd site && npm run test -- --run` — todos os testes passam (~110)
- `cd site && npx astro check` — 0 erros de tipo
- `cd site && npm run build` (com env vars) — build de produção completa
- Dev server renderiza as 2 seed songs com transposição funcional

---

## Chunk 5: Plugin Claude Code (esqueleto) + wrap-up

Objetivo: criar o `plugin/` no repo com 2 skills mínimas (`status` e `add-song`) e instruções pra instalar via symlink em `~/.claude/plugins/`. Deixar o repo pronto pra Plano B começar.

### Task 5.1: Estrutura do plugin

**Files:**
- Create: `plugin/plugin.json`
- Create: `plugin/skills/status/SKILL.md`
- Create: `plugin/skills/add-song/SKILL.md`
- Create: `plugin/references/chordpro-format.md`
- Create: `plugin/README.md`

- [ ] **Step 5.1.1: Escrever `plugin/plugin.json`**

```json
{
  "name": "pipt-repertorio",
  "version": "0.1.0",
  "description": "Manutenção do repositório do Ministério de Música PIPT — migração, revisão de PRs, geração de setlist, auditoria.",
  "author": "odntht",
  "license": "MIT"
}
```

**Nota sobre skills vs commands:** o Claude Code plugin loader descobre skills automaticamente varrendo `skills/*/SKILL.md` — não é necessário listá-las no manifest. Cada skill exposta neste diretório fica invocável como `/pipt-repertorio:<skill-name>`.

Skills adicionais (`migrate-docx`, `review-pr`, `audit-corpus`, `generate-setlist`, `publish-setlist`, `rotate-token`, `cleanup-spam`, `map-arrangements`, `new-version`, `review-issue`) serão adicionadas nos Planos B e C — por ora, só o esqueleto mínimo.

- [ ] **Step 5.1.2: Escrever `plugin/skills/status/SKILL.md`**

```markdown
---
name: status
description: Overview rápido do estado atual do repertório — contagens de músicas por seção, PRs abertos, setlists futuros, issues pendentes. Use quando quiser saber "como tá o repertório?" sem precisar abrir vários lugares.
---

# status — Overview do repertório

Roda checagens rápidas no repo local pra dar um panorama.

## O que executar

1. Verificar que estamos no repo certo:
   ```bash
   cd ~/Documents/pipt-repertorio && git remote -v
   ```

2. Contar músicas por seção:
   ```bash
   for section in congregacional hinario infantil inadequada; do
     count=$(grep -l "{section: $section}" data/songs/*.pro 2>/dev/null | wc -l | tr -d ' ')
     echo "  $section: $count arquivos"
   done
   ```

3. Contar setlists (nos Planos futuros):
   ```bash
   ls data/setlists/*.yml 2>/dev/null | wc -l
   ```

4. Listar PRs abertos (só quando remote existir — Plano C em diante):
   ```bash
   gh pr list --repo odntht/pipt-repertorio --state open 2>/dev/null || echo "  (repo remoto ainda não configurado)"
   ```

5. Listar issues com label `needs-fix` ou `spam-suspect`:
   ```bash
   gh issue list --repo odntht/pipt-repertorio --label needs-fix,spam-suspect --state open 2>/dev/null || true
   ```

## O que reportar pro usuário

Formato:
```
PIPT Repertório — status
├── Músicas: N (congregacional: A · hinario: B · infantil: C · inadequada: D)
├── Setlists: N arquivos
├── PRs abertos: N
└── Issues pendentes: N (needs-fix: X · spam-suspect: Y)
```
```

- [ ] **Step 5.1.3: Escrever `plugin/skills/add-song/SKILL.md`**

```markdown
---
name: add-song
description: Adiciona uma música ao repertório — recebe texto de cifra (arquivo, cola inline, ou URL de Cifra Club), parseia via o parser TS canônico, valida ChordPro, gera arquivo em data/songs/, faz commit. Útil quando você tem 1-5 cifras pra adicionar de uma vez sem passar pelo form do site.
---

# add-song — Adicionar música ao repertório

## Quando usar

- Você tem cifras num arquivo/email/WhatsApp e quer adicionar direto sem passar pelo form web
- Você quer adicionar múltiplas em batch
- Uma submissão do site caiu em `needs-fix` e você quer corrigir e commitar direto

## Fluxo

1. Perguntar ao usuário a fonte da cifra (arquivo local, cola inline, ou URL Cifra Club).
2. Se URL, buscar o HTML e extrair o corpo textual (regex + limpeza).
3. Rodar o parser TS canônico do repo pra converter em ChordPro:
   ```bash
   cd ~/Documents/pipt-repertorio/site
   node --experimental-vm-modules --experimental-strip-types \
     ../scripts/add-song.ts \
     --input="<caminho ou stdin>" \
     --title="..." --artist="..." --key="G" --section=congregacional --status=aprovada
   ```
   Nota: script `scripts/add-song.ts` será criado quando este comando for exercitado pela primeira vez (Plano B ou depois). No Plano A o comando existe só como documentação da intenção.
4. Mostrar o `.pro` gerado pro usuário aprovar.
5. Salvar em `data/songs/{slug}.{tom}.pro`.
6. Rodar `astro check` e `vitest run` pra garantir que nada quebrou.
7. Commit + push (se remoto existir).

## Regras

- **Não** sobrescrever arquivo existente sem confirmação dupla.
- Se detectar duplicata (mesmo slug+tom), oferecer sufixo (`.v2`, `.arranjo-2`, `.<artista>`).
- Sempre validar campos obrigatórios: `title`, `key`, `section`, `status`.

## Escopo no Plano A

Este comando fica documentado mas **não implementado**. Suas regras servem de referência pro form paste-and-parse do site (Plano C) e pra migração (Plano B).
```

- [ ] **Step 5.1.4: Escrever `plugin/references/chordpro-format.md`**

```markdown
# Formato ChordPro no PIPT Repertório

Referência rápida do formato usado em `data/songs/*.pro`. Fonte da verdade: [docs/superpowers/specs/2026-07-05-pipt-repertorio-design.md §4](../../docs/superpowers/specs/2026-07-05-pipt-repertorio-design.md#4-modelo-de-dados-e-formato-chordpro).

## Tags obrigatórias

- `{title: Nome da música}`
- `{key: G}` (ou `Bm`, `F#m`, `Bb`, etc.)
- `{section: congregacional}` (ou `hinario` / `infantil` / `inadequada`)
- `{status: aprovada}` (ou `em-revisao` / `arquivada`)

## Tags opcionais

- `{artist: Fernandinho}`
- `{tempo: 90}` (ou vazio como placeholder: `{tempo: }`)
- `{youtube: https://...}`
- `{tags: adoracao, cruz}`
- `{notes: começa em Em}`
- `{hinario_num: 061}` (só quando section=hinario)
- `{arrangement_of: outra-slug}` (marca rearranjo de outra música)
- `{arrangement: https://drive.google.com/... | Ensaio 12/06/25}` (repetível)
- `{added: 2026-07-05}` (auto-gerado)

## Corpo

```
{comment: Refrão}
[G]Uma linha [D]com acordes[Em7] intercalados
     [G]Whitespace antes é preservado
```

- Acordes entre `[...]` — usar regex canônico (ver `site/src/lib/cifra-parser/chord-regex.ts`)
- `{comment: X}` marca seção (INTRO, REFRÃO, PONTE...)
- Linhas em branco preservam espaçamento

## Filename

`{slug}.{qualifier?}.{tom-slugificado}.pro`

- Tom slugificado: `#` → `s`, minúsculo. `G` → `g`, `F#m` → `fsm`, `Bb` → `bb`.
- Qualifiers opcionais antes do tom: `arranjo-1`, `simples`, `grande-lucas`, `v2`.
```

- [ ] **Step 5.1.5: Escrever `plugin/README.md`**

```markdown
# Plugin `pipt-repertorio`

Plugin do Claude Code pra manter o repertório da PIPT.

## Instalação

Symlink pro diretório de plugins do Claude Code:

```bash
mkdir -p ~/.claude/plugins
ln -s ~/Documents/pipt-repertorio/plugin ~/.claude/plugins/pipt-repertorio
```

Verificar:
```bash
ls -l ~/.claude/plugins/pipt-repertorio
```

Deve mostrar o symlink apontando pro repo. Depois disso, os comandos ficam disponíveis via `/pipt-repertorio:<comando>` no Claude Code.

## Comandos disponíveis (Plano A)

- `/pipt-repertorio:status` — overview do repertório
- `/pipt-repertorio:add-song` — adicionar música (esqueleto; implementação plena no Plano B)

## Roadmap

Skills adicionais serão adicionadas nos Planos B e C:
- `migrate-docx`, `new-version`, `map-arrangements` — Plano B
- `review-pr`, `review-issue`, `audit-corpus`, `generate-setlist`, `publish-setlist`, `rotate-token`, `cleanup-spam` — Plano C

Ver [design completo](../docs/superpowers/specs/2026-07-05-pipt-repertorio-design.md#7-plugin-claude-code-pipt-repertorio).
```

- [ ] **Step 5.1.6: Testar instalação do plugin**

```bash
mkdir -p ~/.claude/plugins
ln -sfn ~/Documents/pipt-repertorio/plugin ~/.claude/plugins/pipt-repertorio
ls -l ~/.claude/plugins/pipt-repertorio
```

Expected: symlink apontando pra `~/Documents/pipt-repertorio/plugin`. Nesta sessão do Claude Code, os comandos podem ainda não aparecer até reinicializar — mas o symlink em si tem que funcionar.

- [ ] **Step 5.1.7: Commit**

```bash
cd ~/Documents/pipt-repertorio
git add plugin/
git commit -m "feat(plugin): esqueleto do plugin com status + add-song (docs-only por enquanto)"
```

### Task 5.2: README raiz + verificação final

**Files:**
- Modify: `README.md`

- [ ] **Step 5.2.1: Atualizar `README.md` com instruções de plugin e status do Plano A**

```markdown
# PIPT Repertório

Repositório e site do repertório musical do Ministério de Música da PIPT.

## Estrutura

- `data/songs/` — arquivos ChordPro (`.pro`), 1 por (música, tom)
- `data/setlists/` — arquivos YAML, 1 por evento (populado em Planos B/C)
- `data/sections.yml` — governança das 4 seções
- `data/config.yml` — configuração global do site
- `site/` — código do site (Astro 5 + React ilhas)
- `plugin/` — source do Claude Code plugin (instalável via symlink)
- `docs/` — design docs, planos de implementação, migração

## Desenvolvimento local

Pré-requisitos: Node 22 LTS (recomendado via [mise](https://mise.jdx.dev/)).

```bash
mise install                    # instala Node 22 conforme .mise.toml
cd site && npm install          # dependências do site
npm run dev                     # sobe dev server em http://localhost:4321
```

## Testes

```bash
cd site && npm run test         # roda Vitest
npx astro check                 # type-check
```

## Build de produção

```bash
cd site
SITE=https://odntht.github.io BASE=/pipt-repertorio/ npm run build
```

## Plugin Claude Code

```bash
mkdir -p ~/.claude/plugins
ln -s ~/Documents/pipt-repertorio/plugin ~/.claude/plugins/pipt-repertorio
```

Ver [`plugin/README.md`](plugin/README.md).

## Documentação

- **Design:** [docs/superpowers/specs/2026-07-05-pipt-repertorio-design.md](docs/superpowers/specs/2026-07-05-pipt-repertorio-design.md)
- **Plano A (Fundações):** [docs/superpowers/plans/2026-07-05-plano-a-fundacoes.md](docs/superpowers/plans/2026-07-05-plano-a-fundacoes.md)

## Estado do projeto

- ✅ **Plano A — Fundações** (este plano): estrutura + site + parser + plugin skeleton
- ⏳ **Plano B — Migração do docx** (pendente): converter ~415 músicas do Google Docs original
- ⏳ **Plano C — Submissão pública** (pendente, depende da conta `odntht` no GitHub)

## Licença

MIT — ver `LICENSE`.
```

- [ ] **Step 5.2.2: Commit final**

```bash
cd ~/Documents/pipt-repertorio
git add README.md
git commit -m "docs: README completo com estado do Plano A"
```

### Task 5.3: Verificação end-to-end do Plano A

- [ ] **Step 5.3.1: Rodar tudo e checar cada critério**

```bash
cd ~/Documents/pipt-repertorio/site

# 1. Todos os testes passam
npm run test -- --run

# 2. Type-check limpo
npx astro check

# 3. Build de produção limpa
SITE=https://odntht.github.io BASE=/pipt-repertorio/ npm run build

# 4. Dev server sobe
npm run dev
```

Critérios de aceite (do spec §9):

- [ ] Todos os testes passam (~110+)
- [ ] Type-check sem erros
- [ ] Build de produção completa sem erros
- [ ] Site local mostra as 2 seed songs
- [ ] Transposição funciona em tempo real (G → A no seletor troca acordes)
- [ ] PDF via botão "Imprimir / PDF" mostra cifra sem navegação
- [ ] PWA está registrado (checar em DevTools → Application → Service Workers)
- [ ] Badges de seção aparecem coloridos (verde pra Congregacional)
- [ ] Plugin symlink funciona: `ls -l ~/.claude/plugins/pipt-repertorio` mostra o link
- [ ] `git log` mostra ~15 commits todos como `odntht`

- [ ] **Step 5.3.2: Marcar o Plano A como completo**

Se todos critérios passaram, criar commit-tag pra marcar milestone:

```bash
cd ~/Documents/pipt-repertorio
git commit --allow-empty -m "chore: Plano A — Fundações concluído"
git tag plano-a-completo
git log --oneline
```

## Handoff

**Plano A completo.** Próximo: Plano B (Migração do docx) — quando estiver pronto pra atacar isso, invoque a skill de brainstorming pra revisar se o design da migração ainda faz sentido, e depois `writing-plans` pra escrever o Plano B com o mesmo formato.

**Se o usuário quiser executar este plano num agente subagente:** usar `superpowers:subagent-driven-development` (fresh subagent por task, two-stage review).

**Se executar em sessão corrente:** usar `superpowers:executing-plans` (batch com checkpoints).
