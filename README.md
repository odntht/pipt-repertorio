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
