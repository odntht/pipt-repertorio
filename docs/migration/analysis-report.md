# Plano B — Fase 0: análise estrutural do docx

**Fonte:** `/Users/f.cavalcante/Downloads/Repertório PIPT.docx`
**Gerado por:** `scripts/migrate-docx.mjs`

> Este relatório é gerado. Não edite à mão — regenere com o script.

## Totais

- Total de músicas detectadas: **402**

### Por seção

| Seção | Qtd |
|---|---:|
| congregacional | 276 |
| hinario | 89 |
| inadequada | 18 |
| infantil | 19 |

### Por cluster estrutural

| Cluster | Qtd | Descrição |
|---|---:|---|
| `A-simples` | 6 | 1-2 blocos separados por `---`. Formato comum. |
| `A0-sem-separador` | 96 | Sem `---` no corpo. Provavelmente música curta ou muito colada. |
| `B-multi-secao` | 6 | 3+ blocos separados por `---`. Estrutura rica (estrofe/refrão/ponte). |
| `C-com-intro` | 137 | Marcador explícito `Intro:` no corpo. |
| `D-com-qualifier` | 31 | Header traz `arranjo N`, `versão N`, `simples`, etc. |
| `H-hinario` | 90 | Hinário Novo Cântico (`HINO NNN`). |
| `I-infantil` | 19 | Seção infantil. |
| `Z-inadequada` | 17 | Seção "inadequada ao culto público". |

### Flags de risco (podem precisar revisão manual)

| Flag | Qtd |
|---|---:|
| `possivel-anotacao-especial` | 44 |
| `sem-acordes-detectados` | 15 |
| `body-muito-curto` | 2 |
| `sem-letra-detectada` | 1 |

## Batch-canário (Fase 1)

Amostragem determinística (hash estável do slug), 16 músicas cobrindo os principais clusters. Revisar com lupa antes de rodar Fase 2+.

| Cluster | Título | Seção | Tom | Linha docx |
|---|---|---|---|---:|
| `C-com-intro` | CAMINHO DA FÉ | congregacional | G | 5934 |
| `C-com-intro` | CAMINHO DA FÉ | congregacional | A | 5962 |
| `C-com-intro` | CAMINHO DA FÉ | congregacional | B | 5990 |
| `A0-sem-separador` | ENTÃO SE VERÁ | congregacional | G | 10910 |
| `A0-sem-separador` | ETERNO DEUS | congregacional | C | 9434 |
| `A0-sem-separador` | CONSAGRAÇÃO | congregacional | G | 1265 |
| `H-hinario` | AFLIÇÃO E PAZ | hinario | A | 13111 |
| `H-hinario` | AFLIÇÃO E PAZ | hinario | C | 13148 |
| `H-hinario` | LOUVOR PELA GRAÇA DIVINA | hinario | G | 12334 |
| `D-com-qualifier` | EIS NOSSO DEUS | congregacional | A | 9386 |
| `D-com-qualifier` | É DE CORAÇÃO | congregacional | C | 9466 |
| `D-com-qualifier` | É DE CORAÇÃO | congregacional | E | 9550 |
| `I-infantil` | FORTÃO DO CABELÃO | infantil | E | 16014 |
| `Z-inadequada` | PODER DO TEU AMOR | inadequada | G | 16276 |
| `B-multi-secao` | NADA ALÉM DO SANGUE | congregacional | G | 482 |
| `A-simples` | CANTA MINH'ALMA | congregacional | A | 8018 |

## Como usar este relatório

1. Revisar contagens acima e ajustar o parser em `scripts/migrate-docx.mjs`
caso a distribuição por cluster pareça errada.
2. Na Fase 1, o script vai gerar `.pro` só para as músicas do batch-canário e
abrir uma branch `migration/batch-00` pra revisão manual.
3. Falhas irrecuperáveis vão pra `docs/migration/failures.md`.

