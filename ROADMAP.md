# Roadmap — ideias e melhorias

Lista viva de melhorias para o site. Foco: facilitar a organização de músicas, ensaios e momentos de louvor pelas equipes.

Cada item tem uma nota curta do **por quê** (contexto pra decidir depois) e, quando conhecido, o **onde** (arquivos-chave pra atacar). Marque `[x]` quando concluir; adicione novas ideias no fim da seção correspondente.

Convenção de esforço: **P** (pequeno, ~1h), **M** (médio, ~meia diária), **G** (grande, dia+).

---

## Top 3 (recomendação de prioridade)

- [ ] **PWA + cache offline** — **G**
  Serviço de louvor sem sinal (WiFi da igreja saturado, dados fracos no subsolo) faz a cifra sumir no meio do culto. Astro tem integração PWA; service worker cacheia os `.pro` e o shell do app.
  _Onde:_ nova integração no `astro.config.mjs`, manifest em `site/public/`.

- [ ] **Autoscroll na cifra** — **P**
  Toca teclado/violão com iPad no atril sem parar pra rolar. Slider de velocidade (linhas/min) + play/pause. Provavelmente a feature mais usada ao vivo.
  _Onde:_ `site/src/components/SongViewer.tsx`.

- [ ] **Escala de músicos no setlist** — **M**
  Google Calendar diz quem tá escalado no domingo, mas não amarra com quem toca cada música. Elimina o "quem faz o solo da 3ª?" no ensaio.
  _Onde:_ adicionar `equipe: { vocal: [...], violao: [...], ... }` no YAML de setlist, parser em `site/src/lib/setlists/load.ts`, render em `site/src/pages/setlists/[slug].astro`.

---

## Uso ao vivo (ensaio/culto)

- [ ] **Modo palco** — **P**
  Dark real (não só dark mode), fonte 1.5×, sem chrome. Cifra ocupa a tela inteira. Toggle persistente por dispositivo.
  _Onde:_ novo botão no `SongViewer.tsx`, classe CSS aplicada no `<body>` ou wrapper.

- [ ] **Metrônomo por música** — **M**
  Campo `bpm` no ChordPro + botão que dispara clique via Web Audio API. Elimina a busca por metrônomo externo.
  _Onde:_ parser em `site/src/lib/chordpro/`, botão no `SongViewer.tsx`.

- [ ] **Modo de rolagem por seção** — **P**
  Botões de próximo/anterior refrão/estrofe pra pular rápido. Complementa (não substitui) autoscroll.
  _Onde:_ `SongViewer.tsx` + marcadores no `chordpro-parser`.

---

## Semana de ensaio

- [ ] **Notas de ensaio setlist-level** — **P**
  Hoje o `notes` é por música. Falta um campo pro líder deixar recado geral ("começar sem bateria", "modular na 3ª estrofe", "sem baixo hoje").
  _Onde:_ novo campo `notes:` no topo do YAML de setlist, render no editor e na view.

- [ ] **Compartilhar setlist (WhatsApp)** — **M**
  Botão que gera texto formatado pra colar no grupo (título + tom + momento, sem markdown de PDF). Diferente do print completo.
  _Onde:_ novo botão em `site/src/pages/setlists/[slug].astro`, montador de texto puro.

- [ ] **Prévia MP3 embutida** — **M**
  Se o `.pro` tiver `{audio_url: ...}`, mostra player inline. Hoje o link "Arranjos" abre a pasta inteira do Drive; ter o áudio ao lado da cifra ajuda a estudar.
  _Onde:_ metadata do parser + componente `<AudioRef />` no `SongViewer.tsx`.

- [ ] **Lista de "próximos ensaios"** — **M**
  Puxa via iCal da agenda pública e mostra os próximos 4 no home. Sem depender de acesso à Agenda Google.
  _Onde:_ novo componente no `site/src/pages/index.astro`, integração ICS no build ou runtime.

---

## Descoberta e rotação

- [ ] **"Última vez tocada"** — **P**
  Pra cada música, mostrar quando ela foi tocada por último (cruzando setlists). Evita repetir demais e resgata as esquecidas.
  _Onde:_ agregador em `site/src/lib/setlists/`, coluna nova em `MusicasList.tsx` e no header do `SongViewer.tsx`.

- [ ] **Filtros combinados na busca** — **M**
  Multi-select de tema + seção + BPM + toms disponíveis. Já tem tags — falta só UI.
  _Onde:_ `site/src/components/MusicasList.tsx`.

- [ ] **"Sugerir setlist"** — **G**
  Dado momento (Ceia? EBD? Culto público?), sugere combinações balanceadas (agitada → calma, HNC obrigatório, diversidade de temas). Um passo a mais em cima dos filtros.

- [ ] **Estatísticas de repertório** — **M**
  Dashboard simples: músicas mais tocadas, seções sub-usadas, temas sub-representados, "quanto tempo sem tocar X".

---

## Memória institucional

- [ ] **Notas de aprovação por música** — **M**
  Histórico curto das decisões da liderança ("aprovada em 15/01/2025", "usar só em prelúdio", "reavaliar em 2026"). Vira campo YAML na música.
  Segue o espírito do Regimento — documenta decisões pra novos líderes não desfazerem sem contexto.
  _Onde:_ novo bloco `{notas_lideranca: ...}` no ChordPro ou frontmatter separado, render em seção discreta do `SongViewer.tsx`.

- [ ] **Log de alterações do repertório** — **P**
  Página `/log` mostrando as últimas N mudanças (git log filtrado). Transparência pra a equipe ver o que entrou/saiu.
  _Onde:_ script no build que gera JSON a partir de `git log --pretty=... data/songs data/setlists`.

---

## Coordenação entre equipes

- [ ] **Página por equipe** — **M**
  `/equipes/guitarra`, `/equipes/vocal` etc. Cada uma mostra os próximos louvores dessa equipe + docs específicos (hoje "Equipe Guitarra" é link único).
  _Onde:_ nova rota, dados em `data/equipes.yml`.

- [ ] **Escala do trimestre em uma tela** — **M**
  Calendário visual com quem toca em cada domingo. Espelho leve da agenda, mas focado em quem toca (não o que se toca).

---

## Qualidade de vida (UX/DX)

- [ ] **CONTRIBUTING.md** — **P**
  Prometido pelo Plano C. Explicar submissão via Sugerir Música + convenção do ChordPro pra quem quiser abrir PR.

- [ ] **OpenGraph nas páginas** — **P**
  `<meta og:*>` no `BaseLayout.astro`. Hoje link compartilhado no WhatsApp/Slack aparece sem preview.

- [ ] **Impressão do repertório completo** — **M**
  Botão que gera um "livro" com todas as músicas ordenadas por seção. Backup impresso, caso do site sair do ar.

- [ ] **Testes E2E básicos** — **M**
  Playwright ou similar: abre home, busca uma música, entra numa cifra, transpõe, imprime. Pega regressões antes do deploy.

---

## Ideias descartadas ou adiadas

_Quando descartar algo, mova pra cá com nota do porquê — vale mais que apagar._

- (nenhuma ainda)
