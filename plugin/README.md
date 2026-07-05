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

Deve mostrar o symlink apontando pro repo. Depois disso, as skills ficam disponíveis via `/pipt-repertorio:<skill>` no Claude Code.

## Skills disponíveis (Plano A)

- `/pipt-repertorio:status` — overview do repertório
- `/pipt-repertorio:add-song` — adicionar música (esqueleto; implementação plena no Plano B)

## Roadmap

Skills adicionais serão adicionadas nos Planos B e C:
- **Plano B (Migração):** `migrate-docx`, `new-version`, `map-arrangements`
- **Plano C (Submissão + Setlists):** `review-pr`, `review-issue`, `audit-corpus`, `generate-setlist`, `publish-setlist`, `rotate-token`, `cleanup-spam`

Ver [design completo](../docs/superpowers/specs/2026-07-05-pipt-repertorio-design.md#7-plugin-claude-code-pipt-repertorio).
