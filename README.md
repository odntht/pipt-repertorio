# PIPT Repertório

Repositório e site do repertório musical do Ministério de Música da Primeira Igreja Presbiteriana de Taguatinga (PIPT).

## Estrutura

- `data/songs/` — arquivos ChordPro (`.pro`), 1 por (música, tom)
- `data/setlists/` — arquivos YAML, 1 por evento
- `data/sections.yml` — governança das 4 seções
- `data/config.yml` — configuração global do site
- `site/` — código do site (Astro)
- `plugin/` — source do Claude Code plugin (instalável via symlink)
- `docs/` — design docs, planos de implementação, migração

## Desenvolvimento local

**Pré-requisitos:** Node 22 LTS (versão fixada em `.nvmrc`).

Instale Node por qualquer meio disponível na sua máquina:
- **nvm:** `nvm install && nvm use` (lê o `.nvmrc` automaticamente)
- **fnm:** `fnm use` (idem)
- **mise:** `mise install` (lê o `.nvmrc` como fallback)
- **Homebrew:** `brew install node@22`
- **Instalador oficial:** [nodejs.org](https://nodejs.org/) (versão 22 LTS)
- **Outro:** basta ter Node ≥ 22 e npm no PATH

Depois:

```bash
cd site
npm install       # instala dependências
npm run dev       # sobe dev server em http://localhost:4321
```

## Testes

```bash
cd site
npm test          # roda Vitest
npx astro check   # type-check
```

## Build de produção

```bash
cd site
SITE=https://odntht.github.io BASE=/pipt-repertorio/ npm run build
```

Gera site estático em `site/dist/`. `npm run preview` serve pra testar o build.

## Plugin Claude Code (opcional, só admin)

```bash
mkdir -p ~/.claude/plugins
ln -s ~/Documents/pipt-repertorio/plugin ~/.claude/plugins/pipt-repertorio
```

Ver [`plugin/README.md`](plugin/README.md).

## Documentação

- **Design:** [docs/superpowers/specs/2026-07-05-pipt-repertorio-design.md](docs/superpowers/specs/2026-07-05-pipt-repertorio-design.md)
- **Plano A (Fundações):** [docs/superpowers/plans/2026-07-05-plano-a-fundacoes.md](docs/superpowers/plans/2026-07-05-plano-a-fundacoes.md)
- **Roadmap de melhorias:** [ROADMAP.md](ROADMAP.md)
- **Análise — Direção Musical:** [docs/direcao-musical-analise.md](docs/direcao-musical-analise.md) — síntese de 14 vídeos YouTube pra informar o data model

## Estado do projeto

- ✅ **Plano A — Fundações** (concluído): estrutura + site + parser + plugin skeleton
- ⏳ **Plano B — Migração do docx** (pendente): converter ~415 músicas do Google Docs original
- ⏳ **Plano C — Submissão pública** (pendente, depende da conta `odntht` no GitHub)

## Contribuindo

Ver `CONTRIBUTING.md` (a ser criado no Plano C).

## Licença

MIT — ver `LICENSE`.
