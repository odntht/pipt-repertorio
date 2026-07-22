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

## Direção musical

Um conjunto de anotações que documenta **como a música deve ser tocada e conduzida** — quem começa, como começa, onde cada instrumento entra, dinâmica (piano/forte, crescendo, ritardando), acentos, quebras, marcações de andamento. É a "partitura de direção" do líder da equipe.

Difere da cifra propriamente dita (que é letra + acordes) e das notas de setlist (que são contextuais a UMA ocasião). A direção musical é uma propriedade **da música** — o arranjo canônico daquela equipe.

- [ ] **Direção musical inline na cifra (song-level)** — **G**
  Adicionar anotações de direção dentro do próprio `.pro`, ancoradas em seções específicas. Ex.: "intro: violão dedilhado, contagem 1-2-3-4"; "verso 2: entra baixo em oitava"; "refrão 2: cai — só voz e piano"; "ponte 1: tchau guitarra, suspende o chão"; "final: turnaround em Sol".
  _Decisões de design (resolvidas via [docs/direcao-musical-analise.md](docs/direcao-musical-analise.md), 30 vídeos):_
  - **Formato:** nova diretiva ChordPro por seção — `{secao: verso_1}` abre um bloco; sub-diretivas `{d: cair, suave}`, `{entra: bateria, teclado}`, `{sai: guitarra}`, `{contagem: 1,2,3,4}`, `{solista: Patrícia}`, `{obs: bateria com chimbal fechadinho}` dentro do bloco. Compatível com o parser atual em `site/src/lib/chordpro/`.
  - **Granularidade: por seção**, com numeração explícita (`verso_1`, `verso_2`, `ponte_1`, `ponte_2`, `refrao_1`). Sub-granularidade (linha/compasso) rejeitada — nenhum DM trabalha assim.
  - **Tipos de seção (enum):** `intro`, `verso`, `pre_refrao`, `refrao`, `ponte`, `instrumental`, `interludio`, `tag`, `solo`, `turnaround`, `outro`, `ending`, `espontaneo`, `final`.
  - **Dinâmica: texto livre com autocomplete**, não enum estrito. Léxico observado (33 termos): `suave`, `grande_pausa`, `crescendo`, `cair`, `la_embaixo`, `la_em_cima`, `groove_pleno`, `grande_festa`, `energia`, `suspende`, `tira_o_groove`, `respira`, `nao_deixa_morrer`, etc. Notação clássica (pp/mf/ff) rejeitada — zero uso no corpus.
  - **Multi-instrumento: namespaces por instrumento** (`{d.bateria: ...}`, `{d.teclado: ...}`), fechados no enum: `bateria`, `baixo`, `teclado`, `guitarra`, `violao`, `vocal`, `backing_vocal`. Cue de saída (`{sai: ...}`) tão comum quanto entrada.
  - **Render: inline em bloco discreto acima da seção** (não painel lateral). Coloração/tipografia sutil que não brigue com a cifra. Toggle liga/desliga (ver item "Toggle esconder direções").
  _Onde:_ parser em `site/src/lib/chordpro/`, novo render em `site/src/components/SongViewer.tsx`.

- [ ] **Notas de execução por setlist (contextual)** — **P**
  Sobrescreve/complementa a direção canônica pra UMA ocasião específica ("hoje sem bateria", "modular pra E na 3ª estrofe", "pular a ponte"). Não altera a música — só o combinado do dia.
  _Onde:_ novo campo `notes:` no topo do YAML de setlist, render no editor e na view.

- [ ] **Toggle "esconder direções"** — **P**
  Botão pra ligar/desligar a exibição das anotações de direção. Útil pra músicos que só querem ver acordes e letra, sem poluir. Persiste por dispositivo (localStorage), similar ao toggle de acordes que já existe.

- [ ] **Templates de direção por equipe** — **M**
  Cada equipe (guitarra, vocal, teclado) pode ter uma "view" filtrada mostrando só as direções relevantes pra ela — o teclado vê "piano entra pp na 2ª", a bateria vê "quebra rápida antes do refrão final". Requer que a direção use namespaces por instrumento.

- [ ] **View "Diretor Musical"** — **M**
  Modo de visualização paralelo ao "esconder direções": mostra o **mapa da música em destaque** (sequência de seções + dinâmica + entrada/saída + contagem), com a cifra em segundo plano. Baseado na observação de que o DM opera mentalmente no mapa, não na cifra ([Bill/GuitarChurch, Lucas Bertolozo — docs/direcao-musical-analise.md]). Complementa a "View filtrada por naipe" — é outra persona (DM em vez de instrumentista).
  _Onde:_ novo modo em `site/src/components/SongViewer.tsx` (toggle de layout).

- [ ] **`handoff_pastor` — cue litúrgico condicional** — **M**
  Marcador por seção (ou por setlist) que indica que a música tem um plano condicional se o pastor entrar/subir no meio. Ex.: "se pastor subir, jogar pra baixo, continuar em loop até sinal". Classe de cue completamente ausente do modelo original mas onipresente no corpus (`UqBFVYYilvo`, `_TxvDMLuUbM`, `fcaobJ7blr0`, `yGZT7-U2R2I`). Render: ícone discreto (microfone amarelo) + nota expandível.
  _Onde:_ novo campo no bloco de direção, render no `SongViewer.tsx`; badge visível na "View Diretor Musical".

- [ ] **`emenda_para_proxima` no setlist** — **P**
  Enum por música do setlist indicando como emendar com a próxima: `direto_no_coro`, `direto_na_intro`, `pausa_curta`, `oracao_no_meio`. Cues observados: "próxima música vai entrar no coro, aí dá a glória direto" [fN5xGT4jex0]; "Vento de Poder, direto, direto" [fcaobJ7blr0]. Elimina o "e agora?" entre músicas.
  _Onde:_ novo campo `emenda:` por item no YAML de setlist, render como conector visual entre músicas.

- [ ] **`mensagem_do_set` no setlist** — **P**
  Campo curto no topo do YAML de setlist com a mensagem/tema que o líder quer conduzir naquele culto (ex.: "paternidade de Deus", "vitória em Cristo"). Fonte: Emily [BQgKcap4LaI] — cada culto tem UMA mensagem central; o setlist inteiro deveria servi-la. Render: destaque no topo do setlist na view e no print.
  _Onde:_ novo campo `mensagem:` no YAML de setlist, render em `site/src/pages/setlists/[slug].astro` e nos prints.

---

## Semana de ensaio

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
