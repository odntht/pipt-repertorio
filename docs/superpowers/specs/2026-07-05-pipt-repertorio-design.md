# PIPT Repertório — Design

**Data:** 2026-07-05
**Autor:** f.cavalcante (com Claude)
**Status:** Design aprovado, aguardando plano de implementação

---

## 1. Contexto e objetivo

O ministério de música da PIPT mantém hoje um único Google Docs (`Repertório PIPT.docx`, ~16.500 linhas, ~415 versões de música) com todo o repertório da igreja. O documento cresceu organicamente, mistura música + governança (introdução com política de escolha de repertório), e sofre limitações típicas de doc monolítico:

- Difícil filtrar por seção, tom, tema ou artista
- Nenhuma transposição automática — cada tom é uma cópia manual da música
- Setlists semanais são gerados manualmente em docs separados por equipe (Baixo, Sax, Guitarra, UPA)
- Colaboração/edição depende de acesso ao Drive
- Nenhum controle de versão real; rearranjos convivem com originais sem histórico claro

**Objetivo:** transformar o repertório num site + repositório GitHub navegável, editável e versionado, com:

1. **Setlists** como feature-âncora (uso inicial), replicando o layout dos docs de "Próximo Louvor" atuais
2. Cifra pronta pra ler no palco (celular offline, transposição, auto-scroll, PDF)
3. Fluxo de submissão de novas músicas **sem exigir conta GitHub** dos usuários finais
4. Governança preservada (as 4 seções: Congregacional / Hinário / Infantil / Inadequada)
5. Uma **Claude skill** (plugin) que ajuda o admin em migração, revisão de PRs, geração de setlist e auditoria

**Público:**
- **Usuários finais** (músicos do ministério, congregação): navegam, montam setlists ad-hoc, submetem cifras. Nunca precisam de conta GitHub.
- **Admin** (f.cavalcante): configura, migra, revisa PRs, mantém. Usa a skill do Claude Code.

---

## 2. Visão geral do sistema

Três peças interligadas:

1. **Repositório GitHub** (`odntht/pipt-repertorio`) — dados + código do site + workflows
2. **Site estático** hospedado em GitHub Pages (`odntht.github.io/pipt-repertorio`), buildado a cada push em `main`
3. **Plugin Claude Code** (`~/.claude/plugins/pipt-repertorio/`) usado pelo admin

Fluxo dos atores:

```
Músico/congregação ──▶ Site (browse, setlist ad-hoc, submit) ──┐
                                                                │
Líder do culto     ──▶ Site (cria setlist oficial) ─────────────┼─▶ GitHub Issues
                                                                │       │
Admin              ──▶ Claude Plugin (revisa, migra, audita)   ─┘       ▼
                                                                    GH Action
                                                                    (valida)
                                                                        │
                                                                        ▼
                                                                     Pull Request
                                                                        │
Admin              ──▶ merge no GitHub ────────────────────────────▶ Site atualizado
```

---

## 3. Estrutura do repositório

```
pipt-repertorio/
├── data/
│   ├── songs/                    # Fonte da verdade: 1 arquivo .pro por versão
│   │   ├── nada-alem-do-sangue.g.pro
│   │   ├── nada-alem-do-sangue.a.pro
│   │   ├── poder-do-teu-amor.g.pro
│   │   └── ...
│   ├── setlists/                 # 1 arquivo YAML por evento
│   │   ├── 2026-07-12.yml
│   │   └── ...
│   ├── sections.yml              # Definição das 4 seções + textos
│   └── config.yml                # Config global (tail song = Tríplice Amém, etc.)
├── site/                         # Código do site (Astro)
│   ├── src/
│   │   ├── pages/
│   │   ├── components/           # componentes React nas ilhas interativas
│   │   ├── layouts/
│   │   └── lib/                  # parser, chordpro utils, etc.
│   ├── public/
│   ├── astro.config.mjs
│   └── package.json
├── .github/
│   ├── workflows/
│   │   ├── deploy.yml            # Build + publish no Pages
│   │   └── process-submission.yml  # Valida issue → cria PR
│   └── ISSUE_TEMPLATE/
│       └── song-submission.yml   # Schema estruturado
├── docs/
│   ├── superpowers/specs/        # design docs
│   └── migration/
│       ├── failures.md           # relatório da migração inicial
│       └── decisions.md          # log de decisões da migração
├── scripts/                      # Standalone (usados pelo plugin)
│   ├── parse-cifra.py            # parser docx → chordpro
│   ├── audit-corpus.sh
│   └── cleanup-spam.sh
├── SECURITY.md                   # Rotação de PAT, resposta a flood
├── CONTRIBUTING.md               # Como adicionar música manualmente
└── README.md
```

---

## 4. Modelo de dados e formato ChordPro

### 4.1 Por que ChordPro

Cada versão de música é um arquivo `.pro` em formato ChordPro (padrão text-based da indústria).

**Justificativa** (vs. manter formato "cifra em cima da letra" puro):
- Transposição automática (`[G]` vira `[A]` sem redigitar) — destrava o cenário "preciso da mesma música em D"
- Uma fonte, múltiplas renderizações (cifra+letra / só cifra / só letra / PDF)
- Ferramentas maduras (ChordSheetJS, editores, exports)
- Git diff limpo (só as palavras/acordes que mudaram entre versões)

**Preservação da experiência visual atual:** o site renderiza por padrão em "cifra em cima da linha" — idêntico ao Google Docs original. ChordPro é formato de **armazenamento**; a visualização é fiel ao que o ministério já conhece. Impressão e PDF também respeitam esse modo.

### 4.2 Exemplo de arquivo

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
[G]Teu sangue leva-me a[Em7(11)]lém a todas as al[G]turas onde ouço a tua [Em7(11)]voz
[D]Fala de tua jus[C9]tiça pela minha vida Je[G]sus, es[C9/E]te é o teu [D]sangue

{comment: Refrão}
   [G]Que nos lava dos peca[Em7(11)]dos, que nos traz restau[G]ração
 [D]Nada além do [C9]sangue, nada além do sangue de Je[G]sus[C9/E] [D]
```

### 4.3 Metadados

| Campo | Obrigatório | Descrição |
|---|---|---|
| `title` | ✅ | Nome canônico |
| `key` | ✅ | Tom (G, A, Bm, F#m, ...) |
| `section` | ✅ | `congregacional` / `hinario` / `infantil` / `inadequada` |
| `status` | ✅ | `aprovada` / `em-revisao` / `arquivada` |
| `artist` | ○ | Artista/ministério original |
| `youtube` | ○ | Link de referência (só link, não embed) |
| `tempo` | ○ | BPM |
| `tags` | ○ | Temas (adoração, natal, esperança...) |
| `notes` | ○ | Observações do arranjo |
| `hinario_num` | ○ | Só pra hinário: número no Novo Cântico |
| `arrangement_of` | ○ | Slug de outra versão (marca "sou rearranjo de X") |
| `added` | auto | Data de entrada no repertório |
| `slug` | auto | Gerado do título |

### 4.4 Naming convention

```
data/songs/{slug}.{tom-lowercase}.pro

Exemplos:
data/songs/nada-alem-do-sangue.g.pro
data/songs/nada-alem-do-sangue.a.pro
data/songs/ele-e-exaltado.simples.e.pro         # variante nomeada
data/songs/em-espirito-em-verdade.arranjo-1.g.pro
data/songs/em-espirito-em-verdade.arranjo-2.g.pro
```

### 4.5 Governança das seções

`data/sections.yml` preserva a política que hoje está na Introdução do docx:

```yaml
sections:
  - id: congregacional
    label: Músicas Congregacionais
    badge_color: green
    order: 1
    description: |
      1ª PARTE — extra-hinário, aprovadas pela liderança do Ministério de Música
      ou por algum pastor da PIPT. (Texto integral vem da Introdução do docx original.)

  - id: hinario
    label: Hinário Novo Cântico
    badge_color: blue
    order: 2

  - id: infantil
    label: Músicas Infantis
    badge_color: yellow
    order: 3

  - id: inadequada
    label: Inadequadas ao Culto Público
    badge_color: red
    order: 4
    hidden_by_default: true
    description: Registradas com justificativa por transparência.
```

Cada música exibe um **badge colorido** com a seção na página de detalhe e na listagem.

---

## 5. Site: features e navegação

### 5.1 Mapa de páginas

```
/                              Home — busca + próximo culto + destaques
/musicas                       Índice — filtros por seção, tom, tag, artista
/musicas/{slug}                Página da música (múltiplas versões)
/musicas/{slug}/{tom}          Versão específica
/adicionar                     Form pra colar cifra nova
/setlists                      Lista dos setlists oficiais + criar ad-hoc
/setlists/{data}               Setlist específico (universal)
/setlists/{data}/{equipe}      Mesmo setlist com header da equipe
/setlists/{data}/apresentar    Modo apresentação
/proximo                       Redireciona pro próximo setlist
/proximo/{equipe}              Idem, com header
/sobre                         Introdução (do docx) + governança
/inadequadas                   Lista rejeitadas + justificativa
```

### 5.2 Página da música

Layout single-page otimizado pro palco:

- Título + artista + badge da seção + tags
- Seletor de **tom** (dropdown com todos os tons) — transposição em tempo real via ChordSheetJS
- Seletor de **modo** (Cifra+Letra padrão / Só Cifra / Só Letra)
- Botões **A- / A+** (zoom)
- **Auto-scroll** com slider de velocidade + play/pause/reset
- **Modo dark** (auto + toggle)
- Link YouTube (abre em nova aba)
- Botão **Imprimir** e **PDF** (window.print com CSS de print bem cuidado)
- Ações no rodapé: **Adicionar ao setlist** (ad-hoc), **Favoritar** (localStorage), **Compartilhar** (URL)

### 5.3 Índice `/musicas` — filtros

- Busca por texto (título, letra, artista) — **Pagefind**, 100% client-side
- Filtros: Seção (checkboxes), Tom, Artista, Tags
- Ordenação: Alfabético / Recentes / Mais usadas em setlists (futuro)

### 5.4 Setlists

**Modelo:** 1 arquivo YAML por evento, em `data/setlists/YYYY-MM-DD.yml`.

```yaml
date: 2026-07-12
title: 12/07/26
services:
  - name: Manhã
    songs:
      - slug: acoes-de-graca
        tom: G
        hinario: 061
      - slug: chuvas-de-bencaos
        tom: G
        hinario: 172
      - slug: teu-povo
        tom: G
  - name: Noite
    songs:
      - slug: santo-vineyard
        tom: C
      - slug: confianca
        tom: D
      - slug: aclame-ao-senhor
        tom: A
        version: 2
notes: ""
```

**Regras derivadas:**
- 1 setlist por evento (assumido: todas as 4 equipes tocam as mesmas músicas na mesma ordem)
- **Tríplice Amém** é sempre incluído automaticamente ao final — vem do `data/config.yml`, não precisa ser listado em cada setlist
- Views por equipe (`/setlists/{data}/{equipe}`) mudam apenas o header exibido

**Layout da página** (espelha o docx `Próximo Louvor`):
- Header: data + equipe (`21/06/26 – MMU BAIXO`)
- **Resumo no topo** com músicas agrupadas por culto (Manhã / Noite)
- Botões: `[Ver como: Baixo · Sax · Guitarra · UPA]`, `[▶ Modo apresentação]`, `[📄 PDF]`
- **Tríplice Amém** (só progressão de acordes)
- Cifras completas em sequência, cada uma numa seção com título

**Criação/edição:**
- **Via site** (`/setlists/novo`) — mesmo fluxo de submissão (Issue → Action → PR)
- **Direto no GitHub** — admin edita YAML e commita

**Setlist ad-hoc pessoal:**
- Usuário monta a la carte enquanto navega, salva em localStorage
- Botão "Compartilhar" gera URL com dados codificados em base64 (compartilhável no WhatsApp)
- Botão "Salvar como oficial" leva pro fluxo de submissão

### 5.5 Página `/adicionar` — paste-and-parse

Wizard em 3 passos:

**Passo 1 — Colar** — textarea grande, aceita texto de Cifra Club, docs, email.

**Passo 2 — Revisar detecção** — o parser rotula cada linha:
- **Cifra** — linha com >70% de tokens que batem no regex de acorde
- **Letra** — <30% de acordes, tem palavras/pontuação
- **Seção** — match em `^(INTRO|VERSO|REFRÃO|PONTE|SOLO|FINAL|ESTROFE|...)[\s:]?`
- **Separador** — só dashes/iguais

O usuário pode reclassificar qualquer linha com um clique. Metadados são preenchidos separadamente (título, artista, tom, seção, YouTube, tags, observações).

**Passo 3 — Preview + Enviar** — mostra o render final; ao clicar Enviar, dispara o fluxo de submissão (§7).

**Precisão esperada:** ~90% no primeiro passe. O toggle manual resolve o resto.

### 5.6 Recursos transversais

- **PWA** (via `@vite-pwa/astro`) — cacheia páginas visitadas pra uso offline (celular no palco sem sinal)
- **Modo apresentação** — uma música por tela, arrows/swipe, auto-scroll disponível
- **Dark mode** — automático (segue OS) + toggle manual
- **Impressão/PDF** — CSS de print cuidado, mesmo caminho pros dois botões

---

## 6. Fluxo de submissão e segurança

### 6.1 Arquitetura

```
┌──────────────┐  1. cria issue   ┌────────────────┐  2. dispara  ┌─────────────────┐
│  Site        │ ────────────────▶│  GitHub Issues │ ─────────────▶│  GitHub Action  │
│  /adicionar  │  PAT fine-       │  label:song-   │  on: issues  │  process-       │
│  /setlists/  │  grained         │  submission    │              │  submission     │
│  novo        │  (Issues:write)  │                │              │                 │
└──────────────┘                   └────────────────┘              └────────┬────────┘
                                                                            │
                                                                     3. valida → cria PR
                                                                            ▼
                                                                   ┌─────────────────┐
                                                                   │  Pull Request   │
                                                                   │  (admin revisa) │
                                                                   └─────────────────┘
```

### 6.2 Estados possíveis de uma issue de submissão

| Estado | Label | O que aconteceu | Ação seguinte |
|---|---|---|---|
| Válida | `song-submission` + `new-song`/`new-version`/`edit`/`new-setlist` | Passou em tudo | Action gera PR; issue fecha ao merge |
| Malformada | + `needs-fix` | ChordPro não parseia, tom inválido, campo faltando | Fica aberta, comentário do bot com detalhes, humano corrige |
| Duplicata | + `possible-duplicate` | Slug + tom já existem | Fica aberta pra admin decidir (rearranjo? substituição?) |
| Suspeita de spam | + `spam-suspect` | Circuit breaker disparou | Sem PR, sem comentário, cleanup em massa depois |

### 6.3 Camadas de proteção (defesa em profundidade)

Como o PAT fica exposto no JS público (pré-requisito pra "sem conta GitHub"), a defesa é em camadas:

1. **Frontend soft — honeypot + tempo mínimo + rate limit localStorage** (5 min entre submissões no mesmo browser)
2. **GitHub rate limit nativo** — 5000 req/h por token, secondary rate limit em bursts
3. **Circuit breaker no Action** — se >10 issues com `song-submission` na última 1h, novas issues ganham `spam-suspect` e workflow não gera PR
4. **Schema validation no Action** — ChordPro precisa parsear; tom precisa bater regex; seção precisa estar na lista
5. **Rotação do PAT** — nuclear, 30s pra invalidar atacante

**Turnstile foi descartado** por simplicidade. Se o volume de spam mostrar necessidade, adicionamos depois.

### 6.4 Notificações de flood

**Camada 1 — GitHub nativo (default watchlist):** admin recebe email/notificação por cada issue aberta. Sob flood, o inbox vira o alarme.

**Camada 2 — Issue-alerta destacada:** quando o circuit breaker dispara, o Action abre uma issue separada `🚨 [ALERTA] Flood detectado — N submissões em 1h` com contexto e passos de resposta.

Discord/Slack webhook fica pra depois se precisar.

### 6.5 PAT (Fine-Grained Personal Access Token)

- **Owner:** `odntht`
- **Repository access:** apenas `odntht/pipt-repertorio`
- **Permissions:** `Issues: Read and write` (só isso)
- **Expiration:** 1 ano
- **Rotation:** documentada em `SECURITY.md`

Quando expira, GitHub envia email 7 dias antes → admin rotaciona.

---

## 7. Plugin Claude Code (`pipt-repertorio`)

### 7.1 Estrutura

```
~/.claude/plugins/pipt-repertorio/
├── plugin.json                   # manifest
├── skills/
│   ├── migrate-docx/SKILL.md
│   ├── add-song/SKILL.md
│   ├── new-version/SKILL.md
│   ├── review-pr/SKILL.md
│   ├── review-issue/SKILL.md
│   ├── audit-corpus/SKILL.md
│   ├── generate-setlist/SKILL.md
│   ├── publish-setlist/SKILL.md
│   ├── rotate-token/SKILL.md
│   ├── cleanup-spam/SKILL.md
│   └── status/SKILL.md
├── scripts/
│   ├── parse-cifra.py
│   ├── audit-corpus.sh
│   └── cleanup-spam.sh
├── references/
│   ├── chordpro-format.md
│   ├── docx-import-strategy.md
│   ├── pr-review-checklist.md
│   └── corpus-audit-rules.md
└── templates/
    ├── song.pro.jinja
    └── setlist.yml.jinja
```

### 7.2 Comandos

Invocação: `/pipt-repertorio:<comando>` (namespacing padrão de plugins). Comandos:

| Comando | Uso |
|---|---|
| `migrate-docx` | Migração inicial (uma vez): analisa → batches → PRs |
| `add-song` | Adiciona 1-5 cifras em batch (arquivo, URL, cola inline) |
| `new-version` | Duplica arquivo existente e transpõe pra novo tom |
| `review-pr <numero>` | Valida PR de submissão (ChordPro, tom, duplicatas, tags) |
| `review-issue <numero>` | Debug de issues `needs-fix` |
| `audit-corpus` | Duplicatas, tons inconsistentes, links quebrados, tags faltando |
| `generate-setlist <criterios>` | Sugere setlist por tema/tempo/histórico |
| `publish-setlist <arquivo>` | Gera YAML e submete via fluxo padrão |
| `rotate-token` | Passo a passo pra rotacionar PAT |
| `cleanup-spam` | Fecha em massa issues com `spam-suspect` ou `needs-fix` antigas |
| `status` | Overview: contagens, PRs abertos, próximo setlist |

### 7.3 Estratégia de custo (uso de Claude)

Plugin é desenhado pra minimizar tokens:
- **Scripts fazem o trabalho pesado** (parser Python), Claude só decide ambiguidades
- **Migração inicial** é a fase mais pesada (talvez precise de Pro por 1 mês)
- **Operação em regime** (setlist semanal + revisão ocasional de PR) cabe em Free tier

**Importante:** o site e o processo de submissão dos usuários finais **não dependem de Claude**. Claude é ferramenta do admin, não do produto.

---

## 8. Migração inicial do docx

### 8.1 Fonte

`~/Downloads/Repertório PIPT.docx` — ~16.500 linhas, ~415 versões de música, 4 seções.

### 8.2 Estratégia em 3 fases

**Fase 0 — Análise estrutural (nada commitado)**

- Parser extrai todas as músicas
- Extrai features estruturais de cada uma (tem YouTube? separadores? INTRO explícita? etc.)
- Cluster automático em ~5-8 buckets estruturais
- Relatório: quantas em cada cluster, quantas provavelmente falharão

**Fase 1 — Batch-canário (batch-00)**

- 20 músicas escolhidas pra cobrir a diversidade máxima (2-3 de cada cluster)
- Parser converte, admin revisa **com lupa**
- Se um cluster inteiro estiver quebrado, ajusta parser antes de qualquer bulk
- Só depois de aprovado o canário, seguimos

**Fase 2+ — Batches sequenciais (um por vez)**

- Ordem: Congregacional → Hinário → Infantil → Inadequada
- Alfabético dentro de cada seção
- 20 músicas por batch → 1 branch/PR por batch
- Admin aprova batch-N antes de gerar batch-N+1
- Estimativa: ~17 batches após o canário

### 8.3 Handling de casos especiais

**Defaults sensatos** (parser resolve sozinho, admin revisa no PR):

| Situação | Default |
|---|---|
| Arranjo com sufixo `(arranjo 2)` | Vira `.arranjo-2` no filename |
| Duas versões mesmo tom sem sufixo | 2ª ganha `.v2` |
| Tom no header não bate com acordes | Confia no header, adiciona `notes: "tom incerto — acordes usados: X"` |
| Título duplicado sem contexto | Adiciona artista pro slug (`santo-vineyard`) |
| Seção desconhecida | Vai pra `congregacional`, adiciona `notes: "seção incerta na migração"` |
| YouTube não valida | Mantém URL, adiciona label `youtube-quebrado` no PR |

Se um default incomodar durante o batch-01, ajusto a regra antes dos próximos.

**Falhas irrecuperáveis** viram entradas em `docs/migration/failures.md`:

```markdown
## TRÍPLICE AMÉM
- Motivo: cabeçalho sem tom
- Linhas no docx: 45–52
- Texto bruto: [snippet]
- Sugestão do parser: [contexto]
- Status: open
```

Após todos os batches mergeados, admin+Claude atacam os failures caso a caso.

---

## 9. Roadmap de fases

### Fase 1 — Local-first (sem GitHub)

- Cria `~/Documents/pipt-repertorio` como repo git local
- Instala plugin em `~/.claude/plugins/pipt-repertorio/`
- Roda scaffold do site (Astro)
- Roda análise + batch-canário do docx
- Valida tudo local (`npm run dev`)

### Fase 2 — Setup GitHub (aguarda conta `odntht`)

- Cria conta `odntht`, repo vazio, ativa Pages
- Gera PAT com scope `Issues: write`, 1 ano
- Adiciona sitekey/config no site

### Fase 3 — Push inicial

- `git remote add origin`, `git push origin main` → esqueleto sobe, Pages builda, site fica no ar
- Push das branches de migração → skill abre PRs (uma por batch)
- Admin mergeia PR por PR no ritmo dele

### Fase 4 — Regime normal

- Setlists semanais via plugin ou GitHub
- Submissões via site (dependente de estar no ar)
- Revisão de PRs via plugin
- Auditoria trimestral

---

## 10. Decisões (log)

| # | Decisão | Alternativa considerada | Razão |
|---|---|---|---|
| D1 | Site estático GitHub Pages | App web com backend | Grátis, versionado, sem infra, casa com edição via git |
| D2 | Repo único com `data/` + `site/` | 2 repos separados | Simplicidade; migra depois se precisar |
| D3 | Astro | Next.js (usuário conhece) | 90% conteúdo estático + ilhas; Astro é feito exatamente pra isso |
| D4 | ChordPro como storage | Manter "cifra em cima da letra" texto puro | Destrava transposição, exports, diff limpo |
| D5 | Cifra-em-cima-da-letra como render default | ChordPro inline visível | Preserva UX familiar do docx atual |
| D6 | Arquivo por versão (`{slug}.{tom}.pro`) | Um arquivo com múltiplos tons dentro | ChordPro não tem padrão pra multi-key; simples é melhor |
| D7 | 1 setlist por evento, 4 equipes são views | 1 setlist por (evento × equipe) | Docs analisados mostram músicas iguais entre equipes |
| D8 | Tríplice Amém como config global | Campo em cada setlist | Toca todo domingo — não precisa repetir |
| D9 | Submissão via Issue + Action + PAT `Issues:write` | Cloudflare Worker; OAuth GitHub; manual | Zero infra externa; risco contido em camadas |
| D10 | PAT com expiração 1 ano | Sem expiração | Vazamento é inerente ao design; expiração limita dano |
| D11 | Turnstile pulado inicialmente | Turnstile invisível | Simplicidade; volume de spam esperado é baixo |
| D12 | Notificação de flood: nativo + issue-alerta | Discord/Slack webhook | Zero infra; suficiente pro volume esperado |
| D13 | Malformadas ficam abertas com `needs-fix` | Auto-close | Mais forgiving; corrigir editando o body é fácil |
| D14 | Plugin ao invés de skill única | Skill única | Organização; comandos independentes |
| D15 | Migração batch-por-batch (uma de cada vez) | Todas de uma vez | Ajuste iterativo do parser se surgir problema |
| D16 | Batch-canário antes dos alfabéticos | Só alfabéticos | Descobre problemas sistêmicos com poucos exemplos |
| D17 | Ambiguidades com defaults + revisar no PR | Perguntar caso a caso | Poupa horas de sessão interativa |
| D18 | `failures.md` no repo em `docs/migration/` | Fora do repo | Git-tracked, rastreável, artefato legítimo |

---

## 11. YAGNI (o que foi rejeitado por agora)

- **Cloudflare Worker / Netlify Function** — descartado por preferência de zero infra externa
- **OAuth GitHub App** — descartado porque exige conta GitHub dos usuários finais
- **Backend próprio (Firebase/Supabase)** — descartado por overkill pro volume real (2-4 músicas/semestre)
- **Turnstile/reCAPTCHA** — descartado inicialmente por simplicidade
- **Discord/Slack notification webhook** — descartado por enquanto; adicionável se necessário
- **Setlist com arranjos por equipe** — não observado no docx analisado; adicionamos se surgir
- **Página de música com YouTube embed** — só link (mais leve)
- **Múltiplas contas contribuidoras via GitHub** — modelo assume 1 admin (o dono do repo)
- **Comentários por música no site** — sem fórum; discussão fica no PR ou fora do sistema
- **Analytics/tracking** — nenhum; site puramente estático
- **Autenticação de usuários finais** — nunca; setlists ad-hoc ficam em localStorage/URL

---

## 12. Riscos e mitigações

| Risco | Impacto | Mitigação |
|---|---|---|
| PAT vazado por crawler | Spam de issues | Circuit breaker + rotação do PAT em 30s + expiração automática em 1 ano |
| Parser da migração erra sistematicamente | Batch inteiro tem que ser refeito | Batch-canário na Fase 1 pega problemas cedo; regenerar é 40s |
| Admin sumir por semanas | Backlog de PRs acumula, submissões param de aparecer no site | Fluxo síncrono já assume admin como gargalo (2-4 músicas/semestre é folgado) |
| Volume de spam realmente subir | Circuit breaker fica no limite | Adiciona Turnstile depois (não muda a arquitetura) |
| Conta `odntht` for banida | Site fora do ar | Site é git; move pra outra conta em minutos |
| Docx original tem casos que o parser não previa | Falhas na migração | `failures.md` cataloga; admin+Claude resolvem depois |
| Custo de Claude estourar Free tier na migração | Bloqueio temporário | Assinar Pro por 1 mês, cancelar depois |
| Setlist ad-hoc em localStorage some (limpar cache) | Perde setlist pessoal | Botão "Compartilhar" gera URL persistente que pode ser salva |

---

## 13. Próximos passos (após aprovação deste design)

1. Passar pelo `spec-document-reviewer` (loop de revisão automática do spec)
2. Usuário revisa o spec final
3. Escrever o **plano de implementação** (via skill `writing-plans`) — divisão em tarefas executáveis
4. Iniciar Fase 1 (local-first): scaffold do repo, do site, do plugin, batch-canário
