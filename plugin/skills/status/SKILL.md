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
   cd ~/Documents/pipt-repertorio
   for section in congregacional hinario infantil inadequada; do
     count=$(grep -l "{section: $section}" data/songs/*.pro 2>/dev/null | wc -l | tr -d ' ')
     echo "  $section: $count arquivos"
   done
   ```

3. Contar setlists (nos Planos futuros):
   ```bash
   ls ~/Documents/pipt-repertorio/data/setlists/*.yml 2>/dev/null | wc -l
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
