# Pesquisa web complementar — condução de louvor

Complementa [docs/direcao-musical-analise.md](../docs/direcao-musical-analise.md).
Escopo: tópicos da web que não estavam no corpus de 30 vídeos brasileiros analisados.

---

## Método e caveats

- **Buscas realizadas:** ~18 queries WebSearch + 3 WebFetch dirigidos, ao longo de ~40 min. Metade em inglês, metade em português — conteúdo anglófono foi consistentemente mais denso e melhor referenciado.
- **Tipos de fonte:** blogs de práticos (David Santistevan, Bob Kauflin/Worship Matters, Zac Hicks, Churchfront, Worship Online, PraiseCharts, Loop Community); páginas oficiais de software (Planning Center, WorshipTools, OpenLP, OpenSong, ChordPro.org); magazines (Reformed Worship, Modern Reformation, Worship Leader, byFaith); Wikipedia para checagem factual; sites da IPB brasileira; cursos online brasileiros de louvor.
- **Não usei YouTube** (pedido do usuário) nem paywalled academic press.
- **Não cobertos com profundidade:**
  - Material específico de Sovereign Grace Music e Getty Music sobre *metodologia de ensaio* (a produção deles é mais forte em teologia e songwriting que em how-to de ensaio) — pesquisa retornou biografia + livros, pouco how-to acionável.
  - Material sobre discipulado do músico em português além do Vineyard/Daniel Mindu — grandes ministérios brasileiros (Diante do Trono, Ministério Zoe) não publicam material didático sistematizado facilmente pesquisável fora do YouTube.
  - Curso da IPB nacional sobre música — não achei "Central de Louvor" IPB; provavelmente não existe como entidade nomeada. IPB opera por ministério de cada igreja local.
- **Data-cutoff:** a maioria das fontes de software está atualizada 2024–2026 (Planning Center, WorshipTools, PraiseCharts, Loop Community). Blogs de metodologia (Santistevan, Kauflin) têm posts perenes de 2015–2020 — conteúdo ainda relevante. Sobre pessoas específicas: **Aaron Ivey foi demitido do Austin Stone em fev/2024** por má conduta ([Protestia, 2024](https://protestia.substack.com/p/austin-stone-church-fires-head-worship)) — evitar recomendá-lo como autoridade de referência.

---

## Ferramentas e software da indústria

### Planning Center Services

- **O que faz:** plataforma SaaS end-to-end para planejamento de culto — biblioteca de músicas, escala de voluntários, envio de setlist com áudio/PDF/tom, transposição, arrangements paralelos por música, tags, mobile app para músicos ensaiarem em casa. ([planningcenter.com/services](https://www.planningcenter.com/services))
- **Modelo:** freemium. Gratuito até 5 membros; US$ 32/mês para 50 membros; US$ 69/mês para 150. Pricing modular — cada app (Services, People, Groups, Giving...) cobrado separadamente. ([GetApp Planning Center 2026](https://www.getapp.com/nonprofit-software/a/planning-center/))
- **Fit PIPT:** **alto conceito, baixo fit de curto prazo.** Se a equipe crescesse muito e precisasse de escalação sofisticada, valeria migrar. Hoje, o site custom da PIPT já cobre 70% do que Planning Center faz (setlists, biblioteca, tags) e mantém dados no repositório. Trade-off: Planning Center dá escalação de voluntários "de verdade" (algo que o roadmap ainda não tem) mas exige aderir ao ecossistema fechado. **Recomendação: não migrar; potencialmente inspirar-se no data model de "arrangement paralelo por música" (múltiplas versões da mesma música em toms diferentes) — algo que o `data/songs/` já suporta com 1 arquivo por (música, tom).**

### MultiTracks.com (Playback)

- **O que faz:** biblioteca de multitracks originais licenciados de gravadoras (Hillsong, Bethel, Elevation, Passion), com app Playback próprio para tocar tracks + click + guides ao vivo. Tem também RehearsalMix (aprendizado com pistas individuais) e Charts. ([Loop Community Blog — comparação](https://loopcommunity.com/blog/2011/12/loops-vs-multi-tracks/))
- **Modelo:** compra por música (US$ ~10–30) ou assinatura Cloud. Playback app é gratuito; conteúdo é a monetização.
- **Fit PIPT:** **baixo.** O grosso do repertório da PIPT é em português (nacional) — MultiTracks é overwhelmingly em inglês. Faria sentido só se a equipe adotasse backing tracks e o repertório incluísse muitas músicas em inglês. Serviria apenas como "reference recording" pontual.

### Loop Community

- **O que faz:** marketplace comunitário de multitracks — a maior parte é enviada por outros líderes de louvor, não gravadoras. Tem versões alternativas (menos instrumentos, tons diferentes) que gravadoras não fazem. App Prime para playback ao vivo. ([loopcommunity.com](https://loopcommunity.com/en-us/)) ([Musicademy — comparação](https://www.musicademy.com/blog/multitrack-worship-backing-track-systems-compared/))
- **Modelo:** compra por track (US$ ~5–15) ou assinatura Prime.
- **Fit PIPT:** **médio-baixo pelo mesmo motivo que MultiTracks** — catálogo predominantemente em inglês. Diferencial: tem stems mais "reduzidos" que caem bem para banda pequena.

### Ableton Live (para backing tracks/click ao vivo)

- **O que faz:** DAW usada como servidor de tracks ao vivo. Roteia click track separado das tracks de instrumento, permite guides verbais, comprime, muta em tempo real. ([Loop Community — Ableton for Worship](https://loopcommunity.com/blog/2019/09/how-to-use-ableton-live-in-worship/)) ([Churchfront — click and tracks setup](https://churchfront.com/2023/06/11/how-to-setup-a-click-and-tracks-for-worship-bands/))
- **Modelo:** Ableton Live Standard US$ 449 (compra única). Alternativas: MainStage (US$ 30, Mac-only) roda multitracks + patches de teclado; Playback by MultiTracks (grátis, opera com tracks pagas).
- **Fit PIPT:** **alto se a decisão for adotar backing tracks — a análise de vídeos já mostrou que o DM da série sftbot troubleshoot loops multitrack ao vivo** [YGj4CFMg7KA], confirmando que essa é a stack de igrejas médias brasileiras. Não é decisão do software de repertório, mas o site pode se preparar guardando referência ao routing esperado (ex.: "loop 1 = click, loop 2 = pad") em campo de metadata.

### OnSong (iPad)

- **O que faz:** viewer de cifras no iPad com transposição, autoscroll, setlists compartilhados, importação de PDF/ChordPro/PC Online. Sincroniza pedal Bluetooth para virar página. ([App Store OnSong review](https://apps.apple.com/us/app/onsong-chords-and-lyrics/id337290739))
- **Modelo:** US$ 19,99 (compra única iOS) — barato para o que faz.
- **Fit PIPT:** **médio.** Sobreposição parcial com o próprio site: se o site tiver autoscroll (item do roadmap) + transposição + modo palco, OnSong vira redundante para quem já usa web. Vantagem OnSong: **offline nativo, virar página com pedal**. Se o site adotar PWA + cache (top-3 do roadmap), essa vantagem some. **Recomendação:** não deve virar dependência, mas o formato ChordPro do repositório já é compatível com OnSong — músicos individuais que preferirem podem exportar.

### ProPresenter

- **O que faz:** software de apresentação de slides (letras, vídeos, câmera live) usado no telão da igreja. Suporta cue stacks, controle remoto do palco, "Stage Display" separada. ([wifitalents — best presentation software](https://wifitalents.com/best/church-worship-presentation-software/))
- **Modelo:** compra ~US$ 400 (Renewed Media plan opcional para atualizações).
- **Fit PIPT:** **fora do escopo do projeto** — ProPresenter é ferramenta do setor de mídia/telão, não do músico. Site de repertório e ProPresenter conversam pouco. Só faria diferença se a PIPT quisesse exportar letra do site direto pro ProPresenter — hoje isso é copy-paste.

### WorshipTools Presenter + Charts

- **O que faz:** alternativa **grátis** ao ProPresenter (Presenter) + viewer de cifras (Charts) integrados. Charts sincroniza automaticamente com a página que o Presenter está mostrando. ([worshiptools.com](https://www.worshiptools.com/en-us/presenter)) ([Charts by WorshipTools](https://www.worshiptools.com/en-us/charts))
- **Modelo:** **gratuito, ilimitado.** Suporta ChordPro nativo. Integração com CCLI SongSelect.
- **Fit PIPT:** **alto conceitualmente para o caso "outra igreja adotar o repertório PIPT".** Como o repositório é ChordPro, dá para importar direto no WorshipTools Charts sem retrabalho. Serve como validação: **manter o formato ChordPro estritamente compatível com a spec** ([chordpro.org](https://www.chordpro.org/)) preserva portabilidade para essa ferramenta grátis, para OnSong, e para OpenSong.

### OpenLP

- **O que faz:** software de apresentação open-source multiplataforma (Windows/Linux/Mac/BSD), para telão. Bíblia embutida, biblioteca de músicas, vídeos, PowerPoint. ([openlp.org](https://openlp.org/))
- **Modelo:** **livre, GPL.**
- **Fit PIPT:** paralelo — não é ferramenta do músico. Vale conhecer como "opção sem custo" para igrejas irmãs.

### OpenSong

- **O que faz:** software free para gerenciar chord/lead sheets, apresentar letras em projetor. Multiplataforma. ([musicademy — worship software evaluation](https://www.musicademy.com/blog/songselect-onsong-zionworx-powermusic-comparison/))
- **Modelo:** livre.
- **Fit PIPT:** interessante como "referência de data model" — o formato OpenSong (XML) é outro possível target de exportação. Se o site oferecer "exportar setlist para OpenSong", igrejas que usam esse software aproveitam.

### ChordPro (formato e ferramentas)

- **O que é:** markup textual para chord charts, específicando posição do acorde na letra + metadados (título, tempo, key, seções). Suportado por dezenas de apps. ([chordpro.org](https://www.chordpro.org/)) ([Wikipedia ChordPro](https://en.wikipedia.org/wiki/ChordPro))
- **Ferramentas de edição relevantes:**
  - **ChordPro CLI/GUI oficial** — Perl-based, renderiza PDF ([chordpro.org — song editor](https://www.chordpro.org/chordpro/chordpro-gui-editor/))
  - **ChordProject Editor** — biblioteca JavaScript frontend, usa Ace editor com highlighting ChordPro ([GitHub chordproject/chordpro-editor](https://github.com/chordproject/chordpro-editor)). **Relevante para o projeto: se um dia quiser um editor web no próprio site, essa é a peça pronta.**
  - **ChordSmith** — Java desktop editor com set lists ([SourceForge ChordSmith](https://sourceforge.net/projects/chordsmith/))
- **Fit PIPT:** **muito alto — o projeto já adota ChordPro como fonte da verdade.** Recomendação: seguir estritamente a spec [chordpro.org/chordpro/chordpro-directives](https://www.chordpro.org/chordpro/chordpro-directives/) nas diretivas próprias do projeto (`{secao:}`, `{d.bateria:}` etc.) — usar prefixos que não colidem com diretivas standard evita quebra em outros parsers.

### CCLI SongSelect

- **O que faz:** biblioteca oficial CCLI com 260 mil músicas de louvor, letras, cifras, sheet music, transposição, reporte de uso. ([SongSelect CCLI](https://ccli.com/us/enlogin/songselect))
- **Modelo:** **incluído no licenciamento CCLI da igreja** (a partir de ~US$ 200/ano no tier menor).
- **Fit PIPT:** **relevante se a PIPT paga CCLI** (que é a via legal de projetar letras de músicas em copyright). Se paga, o site poderia oferecer um botão "Reportar uso no SongSelect" — automação simples. Se não paga, avaliar situação legal do repertório atual (várias músicas brasileiras têm equivalente em SongSelect via afiliadas locais).

### PraiseCharts

- **O que faz:** biblioteca de arranjos escritos (chord chart, stage chart, vocal chart, orquestração, sheet music) + multitracks. ~15 mil arranjos com diagramação profissional. ([praisecharts.com](https://www.praisecharts.com/)) ([PraiseCharts review — Nerdisa](https://nerdisa.com/praisecharts/))
- **Modelo:** compra por música (US$ 5–15) ou assinatura.
- **Fit PIPT:** **médio-baixo, mesmo motivo (catálogo em inglês).** Serve como referência estética de "como um chart profissional deve parecer" quando o site for aprimorar o layout.

### Tabela resumo

| Nome | Função | Preço | Fit PIPT |
|---|---|---|---|
| **Planning Center Services** | Setlist + escala + biblioteca | Grátis até 5, US$32/mês (50 mbr) | **Baixo** — o site custom cobre 70% |
| **MultiTracks.com** | Multitracks originais + Playback | Por música / assinatura | **Baixo** — catálogo em inglês |
| **Loop Community** | Multitracks comunitários | Por track / Prime | **Baixo** — idem |
| **Ableton Live** | DAW / servidor de tracks ao vivo | US$ 449 | **Alto se adotar backing tracks** |
| **MainStage** | Patches teclado + tracks | US$ 30 (Mac) | **Alto para tecladista** |
| **OnSong** | Viewer cifra iPad | US$ 19,99 | **Médio** — sobreposição com site |
| **ProPresenter** | Slides no telão | ~US$ 400 | **Fora de escopo** |
| **WorshipTools Presenter + Charts** | Slides + cifras | **Grátis** | **Alto para validar portabilidade ChordPro** |
| **OpenLP** | Slides no telão open-source | **Livre (GPL)** | Referência |
| **OpenSong** | Chord/lead sheets + slides | **Livre** | Referência de formato |
| **ChordPro (oficial CLI)** | Renderizador ChordPro | **Livre** | **Alto — spec canônica** |
| **ChordProject Editor** | Editor JS ChordPro | **Livre (MIT)** | **Alto se quiser editor web** |
| **CCLI SongSelect** | Biblioteca licenciada | Incluído CCLI | Depende de licenciamento |
| **PraiseCharts** | Arranjos escritos + tracks | Por música | **Baixo** — inglês |
| **Worship Artistry / Worship Online / WorshipU** | Tutoriais por música | Assinatura | **Fora de escopo** (treino, não repertório) |

---

## Backing tracks, click, IEM

### Stack técnica mínima observada em igrejas pequenas

- **Software:** Ableton Live, Playback (MultiTracks), Prime (Loop), ou **Reaper como alternativa barata** — ver [Gearspace thread](https://gearspace.com/board/cockos-reaper/1084000-can-reaper-replace-ableton-live-playback.html). Reaper: US$ 60 (churches/nonprofits US$ 225 comercial), trial 60 dias sem trava. Limitação: mudança de tempo/tom ao vivo requer setup MIDI custom. ([Reaper vs Ableton — Guitar Space](https://guitarspace.org/home-recording/reaper-vs-ableton/))
- **Interface áudio:** mínimo 4 saídas para separar click track das tracks principais. Focusrite Scarlett 6i6 é o padrão citado. ([Christian Walls — beginner's guide](https://www.christianwalls.com/blogs/scripture-roundups/beginner-s-guide-to-worship-backtracks-for-small-churches))
- **Routing:** outputs 1/2 = tracks para PA; outputs 3/4 = click + guides para IEM only (via caixa direta em canal separado do mixer). ([Loop Community — Ableton in Worship](https://loopcommunity.com/blog/2019/09/how-to-use-ableton-live-in-worship/))
- **IEM system:** o padrão de baixo custo é o **Behringer Powerplay P16** — mixer pessoal por músico, cada um controla sua mix, via um cabo Cat5. Custa 1/4 a 1/5 de Aviom/Allen&Heath equivalentes. Roda em X32/XR18. ([Sweetwater P16-M Pack](https://www.sweetwater.com/store/detail/P16Pack--behringer-p16m-personal-mixing-system-with-westone-in-ear-monitors)) ([SoundPro IEM Guide 2026](https://soundpro.com/blogs/house-of-worship/in-ear-monitor-guide-2026)) ([Collaborate Worship — IEM budget](https://collaborateworship.com/in-ears/))

### Safeguards contra falha

- **Duplicação:** um segundo laptop plugado em paralelo, com o mesmo projeto, começando em sync (via SMPTE ou timecode). Padrão para igrejas maiores. ([Churchfront — Ableton templates](https://churchfrontacademy.com/courses/284730/lectures/4576520))
- **Fallback:** metrônomo simples no telefone do baterista como backup se o click sumir.
- **Warp em Ableton:** clip de click warpado seque tempo mesmo com mudanças automatizadas.

### Talkback

- **Talkback mic:** microfone dedicado do DM/engenheiro roteado só para as IEMs dos músicos, nunca para o PA. Botão push-to-talk. ([Church Production Magazine — talkback](https://www.churchproduction.com/magazine/talkback-mics-in-church-production-what-every-church-tech-an/)) ([SYNCO — talkback guide](https://www.syncoaudio.com/blogs/news/talkback-system-for-china-explained))
- **Uso:** o "microfone voz de Deus" que Edson Doriguete cita [PRt1IWfpk1s] é literalmente isso. É a via canônica hoje para cues ao vivo — confirma o que o corpus já mostrou.

### Fit PIPT

- **Não é decisão do repositório de repertório**, mas informa o data model: se a PIPT adotar backing tracks, o site precisa suportar:
  - Campo `tem_backing_track: true/false` por música
  - Campo `bpm` (já no roadmap) — obrigatório para click track
  - Campo `compasso` — obrigatório para click track
  - Opcional: campo `routing_multitrack` para documentar "loop 1 = click, loop 2 = pad ambient, loop 3 = drums extras" — resolve o problema observado em [YGj4CFMg7KA] ("loop 3 e 4 tá vindo no teclado").

---

## Metodologias de ensaio (estabelecidas)

### David Santistevan — "Worship Musician's Guide to Preparing for Rehearsal"

Framework em 4 fases ([davidsantistevan.com/preparing-for-rehearsal](https://www.davidsantistevan.com/preparing-for-rehearsal/)):

1. **Orar** — pela celebração, pelas pessoas, antes de qualquer contato musical.
2. **Conhecer o fluxo do culto** — ver setlist inteira + posição da música no arco.
3. **Escuta inicial passiva** — "Não segure seu instrumento. Não tente descobrir. Não toque junto." Apenas ouvir, absorvendo cores e sentimentos.
4. **Criar chart pessoal** — anotar entradas, saídas, padrão rítmico (colcheias/semínimas), tonalidade tímbrica (limpo/distorcido), simplicidade vs complexidade.

Ele estima **1h/semana de preparação individual** para execução decente. Também mantém um "Song Diagram Chart" template gratuito no site.

Santistevan tem uma tese repetida em vários posts: **"Rehearsal is for perfection, not for learning."** Se o músico chega ao ensaio "aprendendo a música", o ensaio virou aula. Confirma o problema #1 identificado no corpus PT-BR: "Ninguém tira as músicas com antecedência" [JbKbXInz9ho, YGWKaXwi2kQ, aYxH5IgqEUQ].

### Bob Kauflin (Sovereign Grace) — Worship Matters

Não achei um framework estruturado de "5 fases de ensaio" em Kauflin. Ele opera em outro plano: livro **Worship Matters** (Crossway, 2008) foca em teologia+prática do líder, e **True Worshipers** (para congregações). Também escreveu **Worship Piano**. ([worshipmatters.com](https://worshipmatters.com/about/)) ([Bob Kauflin — Sovereign Grace Music](https://sovereigngracemusic.com/about/bob-kauflin/))

**Recurso mais aplicável ao PIPT:** o **Worship Matters Intensive** (curso presencial) e **Worship Matters Video Intensive** (online) cobrem "putting songs together, growing in spontaneity, planning a service". ([Worship Matters Video Intensive](https://sovereigngracemusic.com/training/wmvi/))

Marcador: **isso é material Reformado alinhado ao PIPT** (Sovereign Grace é confessional Reformada Batista, próxima da tradição Presbiteriana em teologia de culto). Se o usuário quiser priorizar autores em linha teológica com a IPB, este é o principal.

### Rob Still — "How to Plan and Lead Heavenly Worship Team Rehearsals"

Framework de estrutura de ensaio semanal ([RobStill.com](https://robstill.com/how-to-plan-and-lead-heavenly-worship-team-rehearsals/)) — não li em profundidade mas apareceu como referência recorrente. Vale consulta.

### Comparação com o corpus PT-BR

- **Convergência:** Preparação individual antes do ensaio é lugar-comum na literatura, exatamente o gap que Bill/GuitarChurch [YGWKaXwi2kQ] e Felipe/sftbot [JbKbXInz9ho] apontam como problema #1.
- **Divergência:** os brasileiros analisados dão pouco peso à **oração prévia como fase de preparação musical** — Ana Paula toca nisso [43-ghwysFd0] mas na esfera do líder/dirigente, não do instrumentista. Santistevan e Kauflin colocam oração como fase 1 obrigatória do músico.

### Não confirmado: "Aaron Ivey framework"

Aaron Ivey (ex-Austin Stone) foi citado no briefing. Não achei artigos dele publicando um "framework de ensaio" formal. Além disso, **foi demitido em fev/2024 por conduta abusiva** ([Protestia, 2024](https://protestia.substack.com/p/austin-stone-church-fires-head-worship)). Não recomendo usá-lo como autoridade.

---

## Preparo individual do músico

### Recursos comuns

- **WorshipU** ([worshipu.com](https://worshipu.com/)) — plataforma Bethel Music, 1.200+ lições, tutoriais de música específica para guitarra/teclado/vocal, aulas de songwriting. Assinatura mensal/anual.
- **Worship Artistry** ([worshipartistry.com](https://worshipartistry.com/)) — 700+ tutoriais música-a-música com banda de 5 e harmonia de 3 vozes. Para cada música: video-aula por instrumento + practice loops + chord chart transponível. Foco em amadores/músicos "reais". Assinatura US$ ~15/mês.
- **Worship Online** ([worshiponline.com](https://worshiponline.com/)) — concorrente direto de Worship Artistry; também música-por-música.
- **Musicademy** ([musicademy.com](https://www.musicademy.com/)) — cursos por instrumento, muito material free, sede UK.

Comparação Worship Artistry vs Worship Online ([Worship Ministry Training](https://www.worshipministrytraining.com/worship-online-vs-worship-artistry-the-ultimate-comparison-for-your-worship-team/)): Worship Artistry tem tutoriais mais detalhados por peça; Worship Online tem catálogo maior mas menos profundidade.

### Técnicas destacadas

- **Chart study**: musicista lê o chart pré-ensaio, marca próprias observações, chega com dedos "já sabendo o caminho". Santistevan e Musicademy convergem.
- **Ear training aplicado**: identificar mudanças de acorde por ouvido, decorar padrões harmônicos comuns (I-V-vi-IV etc.), usar Nashville Number System ([Loop Community — NNS](https://loopcommunity.com/blog/2021/09/the-nashville-number-system/)) — permite transposição instantânea sem re-decorar.
- **Memorização**: [Mark Cole — 9 Keys to Memorizing Music](https://www.markcole.ca/9-keys-to-memorizing-music/) — cita: sing along com gravação original, chart por números não por letras, memorização kinestésica (posição das mãos), spaced repetition. Também [Churchfront — Memorize Music and Lyrics](https://churchfront.com/2024/05/24/how-to-memorize-your-music-and-lyrics-for-worship/).

### Fit PIPT

- **Recursos anglófonos são vastos**; o desafio é curadoria. Um item de roadmap útil seria uma página `/recursos-musicos` com links comentados de cursos online, agrupados por instrumento — mas isso é conteúdo, não feature de software.
- **Ligação com o roadmap existente**: o item "Prévia MP3 embutida" (item de "Semana de ensaio") atende diretamente à necessidade de listening prep. Considerar adicionar campo `audio_referencia_url` no `.pro` (Youtube/Spotify/SoundCloud link direto da versão canônica que a equipe adota).

---

## Set flow / arco do set (macro)

### Modelo dominante na CCM (contemporary)

Estrutura de 4–6 músicas em ~20–30 min. Arco típico "high-mid-low-high" ou variações:

- **Abertura (alta)** — call to worship, upbeat, "levantar a sala". ([Worship Online — 10 upbeat opener songs](https://worshiponline.com/10-upbeat-worship-songs-to-open-your-service/))
- **Segunda (alta ou mid)** — construir declaração.
- **Terceira "The Turn" (mid)** — dinâmica cai, letra vira para resposta pessoal. ([Worship Online — planning setlist](https://worshiponline.com/worship-setlist-planning/))
- **Quarta "The Response" (baixa)** — íntima, arranjo mínimo, foco em resposta/comunhão.
- **Quinta (retomada alta)** — declaração de vitória / envio.

Fontes que descrevem essa lógica: [PraiseCharts — Flow in a Worship Set](https://www.praisecharts.com/blog/flow-in-a-worship-set), [Worshipflow — 7 Steps to Perfect Setlist](https://www.worshipflow.com/7-steps-to-create-the-perfect-worship-setlist/), [Santistevan — Next Level Worship Set](https://www.davidsantistevan.com/next-level-worship-set/).

### Modelo dialogical Reformado

Estrutura fundamentalmente diferente — não é curva de energia, é diálogo Deus↔congregação em 3 partes:

1. **Aproximação** — Deus chama, congregação responde com louvor + confissão de pecado.
2. **Palavra** — Deus fala pela leitura e sermão; graça anunciada.
3. **Resposta** — congregação responde com gratidão, ofertas, ceia, envio.

Cada elemento (call to worship, confissão, absolvição, credo, pregação, oração pastoral, ceia, bênção) tem música apropriada. **Música não é "set" separado da liturgia** — está entrelaçada. Fontes: [Reformed Church in America — Reformed Worship](https://www.rca.org/about/worship/); [byFaith — Order of Worship in Reformed Tradition](https://byfaithonline.com/the-order-of-worship-in-the-reformed-tradition/); [The Aquila Report — Principles of Reformed Worship](https://theaquilareport.com/principles-of-reformed-worship/); [Ligonier — Call to Worship](https://learn.ligonier.org/articles/what-is-the-call-to-worship).

### Princípio Regulativo

Historicamente Reformado: só pode ser feito no culto o que Escritura ordena/exemplifica. Impacta seleção de música — texto deve ser doutrinariamente sólido, cantável pela congregação, servir a um dos elementos regulativos (louvor, confissão, credo cantado, resposta ao anúncio da graça). Fontes: [Wikipedia — Regulative Principle](https://en.wikipedia.org/wiki/Regulative_principle_of_worship); [Heritage Baptist — Regulative Principle](https://www.reformedbaptist.org/what-we-believe/believe-about-worship/the-regulative-principle); [Modern Reformation — Regulative Principle Three Approaches](https://www.modernreformation.org/resources/articles/the-regulative-principle-and-biblical-worship-three-reformed-approaches).

Importante: o princípio regulativo **não** exige exclusive psalmody nem proíbe hinos novos. ([The Aquila Report — Reformed Worship and RPW](https://theaquilareport.com/reformed-worship-and-the-regulative-principle-of-worship/))

### Fit PIPT (denominacional)

- **A PIPT é IPB — Reformada.** O corpus analisado é misto: sftbot/Felipe é assembleiano/renovado, GuitarChurch é evangélico genérico, Lucas Bertolozo é técnico neutro. Nenhum dos vídeos analisados opera com liturgia dialogical.
- **Isso é uma tensão real no roadmap.** O item `mensagem_do_set` (Emily [BQgKcap4LaI]) assume um set contínuo/CCM. Numa liturgia Reformada estrita, "mensagem do set" **é do pastor/culto**, não do líder de louvor — e as músicas se distribuem entre elementos (não é uma sequência de 4-5 juntas).
- **Recomendação:** manter `mensagem_do_set` como opcional. Adicionar campo `funcao_liturgica` por música do setlist (enum: `abertura`, `confissao`, `resposta_graca`, `preparacao_pregacao`, `resposta_pregacao`, `ceia`, `envio`, `oferta`) — cobre tanto o modelo CCM da PIPT (que provavelmente é híbrido — IPB moderna faz um "set" antes da pregação) quanto o modelo dialogical estrito. Fonte inspiração: RCA order of worship.

---

## Comunicação em tempo real no palco

### Nashville Number System (NNS) — vocabulário harmônico

Cada nota da escala vira número (I, V, vi, IV etc.). Permite:
- **Sinal de mão silencioso** — DM/líder mostra dedos indicando próximo acorde. ([Loop Community — Nashville Number System](https://loopcommunity.com/blog/2021/09/the-nashville-number-system/)) ([WorshipOnline — Why Number System](https://worshiponline.com/why-number-system/)) ([nashville-numbers.com — for worship teams](https://www.nashville-numbers.com/learn/for-worship-teams))
- **Transposição instantânea** sem re-decorar cifras.
- **Spontaneous worship** direcionada: líder ergue mão atrás do corpo mostrando "6" — banda entra em vi da tonalidade corrente.
- **Cheat sheet 1-6** — a maioria dos acordes de louvor cai entre I e vi, então uma mão basta.

Isso é ausente do corpus PT-BR analisado — nenhum DM brasileiro citou NNS explicitamente. **Mas [b6CrWRVm4ZI]** já usa vocabulário de grau ("Ponte o sexto grau") — é NNS aplicado sem o nome. Vale documentar como opção.

### Hand signals vocabulary

Além do NNS, hand signals para dinâmica ([God and Gigs — 6 ways musicians communicate](https://godandgigs.com/2017/01/20/talking-notes-six-ways-musicians-communicate-on-stage/)) ([Isaac Fry — Signals and Shorthands](https://ifry.substack.com/p/signals-and-shorthands)):
- Palma virada baixo → "abaixa dinâmica"
- Palma virada cima → "sobe dinâmica"
- Dedo circular → "repete essa seção"
- Cruzar braços → "para tudo"
- Bater no peito → "para meu monitor"
- Apontar pessoa → "solo/vocal seu"

Não achei standardização brasileira publicada. Convergem no essencial mas o léxico exato varia por igreja.

### Talkback / mDMing via IEM

Confirmado como padrão profissional. Ver seção "Backing tracks / IEM" acima. O DM tem microfone dedicado só para IEMs. É a via preferida sobre hand signals porque:
- Não visível para congregação (menos "performance atrás da performance")
- Funciona sem contato visual (baterista/backline pode não ver o líder)
- Permite instruções complexas ("mais uma tag, depois cai pra Sol menor")

O corpus PT-BR mostra essa modalidade em uso implicitamente (Emily/Felipe se referem a "microfone voz de Deus" [PRt1IWfpk1s]).

### Fit PIPT

- **Hand signals são gratuitos** — vale treinar a equipe em um vocabulário mínimo compartilhado, independente de tecnologia. Um item de roadmap útil poderia ser um **"glossário de sinais e cues"** publicado no site, com convenções da PIPT (que sinal significa o quê). Baixo esforço, alto impacto pedagógico.
- **NNS pode virar campo opcional no data model** — se a música tem `harmonia_referencia: "I-V-vi-IV | I-V-vi-IV | IV-I/III-vi-V"` documentada em graus, transposição fica trivial. Não urgente mas facilita adoção por outras igrejas.

---

## Teologia do louvor congregacional (Reformada especialmente)

### Autores/livros de referência

**Marcadamente Reformados/Presbiterianos:**
- **Bob Kauflin** (Sovereign Grace Batista Reformada) — **Worship Matters** (2008, Crossway), **True Worshipers** (2015). [worshipmatters.com](https://worshipmatters.com/). Principal autor prático em linha com a teologia PIPT.
- **Matt Merker** (9Marks/Sovereign Grace) — **Corporate Worship: How the Church Gathers as God's People** (2021, Crossway/9Marks). Foca em teologia do "reunir" da igreja local. ([Worship Ministry Training — Merker episode](https://www.worshipministrytraining.com/what-is-corporate-worship-w-matt-merker/))
- **Zac Hicks** (Presbiteriano/EPC) — **The Worship Pastor: A Call to Ministry for Worship Leaders and Teams** (Zondervan, 2016) e **Worship By Faith Alone** (IVP Academic, 2023). Doutorado na Knox Seminary sobre teologia da adoração da Reforma Inglesa. ([zachicks.com](https://zachicks.com/category/worship-pastoring/)) ([Amazon — The Worship Pastor](https://www.amazon.com/Worship-Pastor-Ministry-Leaders-Teams/dp/0310525195))
- **Michael Farley** (Central Presbyterian EPC, St. Louis) — artigos em Modern Reformation, Journal of ETS, Calvin Theological Journal. Especialista em liturgia histórica Reformada. ([Central Pres Worship — Farley](https://centralpresworship.net/author/mifarley/)) ([JETS 51/3 — What is Biblical Worship?](https://etsjets.org/wp-content/uploads/2010/06/files_JETS-PDFs_51_51-3_JETS-51-3-591-613-Farley.pdf))
- **Michael Horton** — **A Better Way** (Baker, 2002); artigo "Defense of Reformed Liturgy" ([PDF](http://www.onthewing.org/user/Ecc_Defense%20of%20Reformed%20Liturgy%20-%20Horton.pdf))
- **Keith & Kristyn Getty** (Presbiterianos irlandeses) — **Sing! How Worship Transforms Your Life, Family, and Church** (2017). Publicando **Sing! Hymnal** (Crossway, 2025). ([Christianity Today — Getty theological pull](https://www.christianitytoday.com/2024/10/keith-kristyn-getty-sing-conference-nashville-modern-hymns-theology-worship/))

**Magazine periódico:**
- **Reformed Worship** ([reformedworship.org](https://www.reformedworship.org/)) — publicação da Calvin Institute of Christian Worship (Christian Reformed Church). Recursos práticos por ano litúrgico, elementos de culto, tópicos. Excelente banco de call-to-worships, orações, ordens de culto por temporada.

**Charismatic/CCM (útil como contraste, não como autoridade primária para PIPT):**
- Aaron Ivey (ex-Austin Stone) — como notado, comprometido moralmente.
- Chris Tomlin, Louie Giglio (Passion) — pouco material teológico sistematizado.
- Ministério Bethel — teologia problemática do ponto de vista Reformado (New Apostolic Reformation). WorshipU serve como fonte técnica; teologia deles não é referência PIPT.

### Princípios que impactam decisões de repertório

- **Texto Escritural** ou fielmente derivado. ([Reformed Worship — Teaching the Faith, Expanding the Song](https://www.reformedworship.org/article/september-2006/teaching-faith-expanding-song))
- **Cantabilidade congregacional** — priorizar músicas que a congregação pode efetivamente cantar (não apenas ouvir a banda cantar). ([The Banner — Reformed look at top worship songs](https://www.thebanner.org/news/2024/03/reformed-look-at-top-worship-songs-offers-caution-guidance))
- **Balanço temático** — não só "amor de Deus" e "vitória"; incluir confissão, lamento, cruz, escatologia. Ferramenta útil: Merker sugere checar diversidade temática do repertório.
- **Denso doutrinariamente** — Getty é a referência prática moderna. Cada hino Getty geralmente cobre um tema doutrinário completo.

### Fit PIPT

- **Alta pertinência** — a análise atual toca em teologia via Ana Paula (diaconia) mas não formaliza um filtro de seleção. Uma **taxonomia teológica de músicas** viria bem: campo `temas_teologicos: [cruz, ressurreicao, providencia, confissao, ...]` já ajuda a detectar viés no repertório e balancear.
- **Recurso de curadoria concreto:** integrar critérios do The Banner review de músicas populares — algumas letras que passam desapercebidas têm problemas doutrinários sutis.

---

## Discipulado da equipe

### Modelos observados na literatura

**Development pipeline** (adotado por Austin Stone, Elevation, etc.):
1. **Recrutamento** — auditions abertas ou por indicação.
2. **Avaliação** — questionário espiritual + entrevista pastoral + audição musical + observação. ([Worship Ministry Training — Auditions & Onboarding](https://www.worshipministrytraining.com/worship-leader-stop-letting-the-wrong-people-in-auditions-onboarding-that-strengthen-your-team/)) ([TheLeadPastor — Auditions template](https://theleadpastor.com/ministry-life/worship-team-auditions-step-by-step-process-templates/))
3. **Onboarding** — shadowing por 1-3 meses, cifra sem palco, cobertura de instrumento titular.
4. **Titular júnior** — participa de escalas com músicos experientes ao lado ("mescla de níveis" — exatamente o que Emily descreve em [BQgKcap4LaI]).
5. **Titular sênior** — pode liderar seu próprio setlist ou ser DM da semana.
6. **Discipulador** — treina próximo pipeline.

**Stepping-stone ministries** ([Worship Initiative — Development & Discipleship](https://www.theworshipinitiative.com/blog-posts/development-discipleship-empowering-youth-for-worship-leadership)):
- Coral mensal, banda jovem, cultos de meio de semana como "arena de ensaio real" para músicos ainda não prontos para dominical.
- Workshops mensais sobre 1-2 músicas, misturando níveis.

**Auditions bem estruturadas** ([Worship Artistry — Conducting Auditions](https://worshipartistry.com/greenroom/leadership/leading-tips/how-to-conduct-auditions-for-the-worship-team)):
- Enviar spiritual questionnaire pré-audição
- Pré-audição: material de referência com expectativas + demo
- Entrevista pastoral em pessoa
- Avaliação musical com **mindset de coaching, não de eliminação**
- Onboarding formal com valores + treinamento + shadowing + feedback

### Convergência com o corpus

- **Emily [BQgKcap4LaI]** já faz mescla de níveis intencional na escala — confirmado como best practice.
- **Felipe [JbKbXInz9ho]** fala em "processo lento, mudança de cultura" — alinhado com literatura anglófona sobre discipulado.
- **Ana Paula [IFZ_R8-NjXY]** — visão de "diaconia" é distintiva; a literatura anglófona majoritária fala em "ministry" ou "worship team". Vocabulário diferente, ethos próximo.

### Fit PIPT

- **Roadmap gap:** o item "Escala de músicos no setlist" é execução — não cobre desenvolvimento. Um item novo útil: **página `/equipe` com pipeline de desenvolvimento visível** (níveis: iniciante em treino → titular júnior → titular sênior → discipulador). Se cada músico tiver um perfil com nível, escala automática pode balancear níveis (a la Emily).
- **Onboarding formal:** adicionar campo `nivel: junior|titular|senior|discipulador` por músico no arquivo de equipe (já existe `data/equipes.yml` planejado). Facilita relatórios "quantos titulares por instrumento? onde há gap?"

---

## Material em português (além do já analisado)

### Cursos formais / faculdades

- **Curso de Direção de Louvor — Faculdade Batista do RJ / Seminário do Sul** ([seminariodosul.com.br/direcao-de-louvor](https://seminariodosul.com.br/direcao-de-louvor/)) — curso vocacional formal em teologia + música. Batista, não Reformado, mas confessional próximo.
- **Escola de Louvor Vineyard Brasil** ([escoladelouvor.com](https://escoladelouvor.com/)) — online, ampla, já formou 3.200+ alunos segundo o site. Vineyard tem teologia carismática — usar com filtro.
- **Jornada da Equipe de Louvor (Vineyard)** ([jornada.vineyard.com.br](https://jornada.vineyard.com.br/)) — programa dedicado a equipes locais.
- **Treinamento Líder de Louvor — Daniel Mindu** ([danielmindu.com.br](https://danielmindu.com.br/treinamentoliderdelouvor/)) — curso 100% online, prático.
- **Lauan Rodrigues — Curso Ministério de Louvor** ([lauanrodrigues.com/ministerio-de-louvor](https://lauanrodrigues.com/ministerio-de-louvor)) — foco em técnica aplicada ao ministério.
- **Com Muito Louvor — Guia Direção Musical** ([commuitolouvor.com.br](https://commuitolouvor.com.br/direcao-musical-no-louvor-guia-completo/)) — artigo denso, PT-BR.

### Ministérios de referência

- **Diante do Trono / Ministério de Adoração e Louvor (CTMDT)** — Belo Horizonte, Lagoinha (Batista Renovada). Centro de treinamento formal desde os anos 2000. Ana Paula Valadão, Ana Nóbrega (2008–2013), Israel Salazar egressos. ([Wikipedia Diante do Trono](https://en.wikipedia.org/wiki/Diante_do_Trono))
- **Antônio Cirilo — Santa Geração** — Contagem/MG (Batista). ~300 composições. ([Instagram @prantoniocirilo](https://www.instagram.com/prantoniocirilo/)) — mais compositor/pastor que didático.
- **Sarah Farias** — cantora gospel; não achei material didático sobre condução.
- **Márcio Mello / criacao musical** ([canal YouTube](https://www.youtube.com/channel/UCzscyu3988uWvgbBQret3ww)) — foco em arranjo/produção musical, não igreja especificamente. Já no corpus.
- **Lucas Bertolozo** ([canal YouTube](https://www.youtube.com/c/LucasBertolozo)) — pedagógico técnico. Já no corpus.

### IPB especificamente

- **Não existe "Central de Louvor" nacional IPB.** Cada igreja opera seu ministério localmente. ([Wikipedia IPB](https://pt.wikipedia.org/wiki/Igreja_Presbiteriana_do_Brasil))
- Igrejas IPB específicas com ministério documentado: [IPB Guanambi — Ministério de Louvor](https://ipbguanambi.ipb.org.br/ministerio/ministerio-de-louvor), [IPB Farol — Louvor](https://farol.ipb.org.br/ministerio/louvor), [IPB Itumbiara](https://itumbiara.ipb.org.br/ministerio/ministerio-de-louvor-ou-ministerio-de-musica.), [IPB Kyrios](https://ipbrsd.ipb.org.br/ministerio/ministerio-kyrios-de-louvor-ipbrsd), [IPI Central de Brasília](https://ipicb.org.br/). São descrições institucionais, não material didático.
- **Não achei um cânone hinológico IPB público único.** Igrejas usam Novo Cântico + repertório congregacional + louvor contemporâneo variável.

### Gap PT-BR

- **Nada teologicamente Reformado em PT-BR sobre condução de louvor** apareceu com destaque na pesquisa. A produção brasileira de peso é carismática/pentecostal (Diante do Trono, Sarah Farias, Vineyard) ou técnico-neutra (Bertolozo, Márcio Mello). **Isso é gap real do ecossistema**, não da pesquisa.
- Para uma referência Reformada em PT-BR, o mais próximo é **Editora Fiel** (publica Kauflin traduzido) e **Cultura Cristã** (editora da IPB) — mas produção original PT-BR sobre teologia+prática de louvor Reformado é escassa.

---

## Recomendações concretas pra o ROADMAP

### Novos itens sugeridos

1. **Campo `funcao_liturgica` por música do setlist** — **P** (pequeno)
   Enum: `abertura`, `confissao`, `resposta_graca`, `preparacao_pregacao`, `resposta_pregacao`, `ceia`, `envio`, `oferta`. Reflete que a PIPT é IPB — o culto Reformado tem elementos litúrgicos com função distinta, não é uma sequência CCM contínua. **Não obriga**: o campo é opcional; para setlists CCM-style continua funcionando sem preenchimento. Fonte: [Reformed worship — dialogical structure](https://byfaithonline.com/the-order-of-worship-in-the-reformed-tradition/).

2. **Campo `temas_teologicos` por música** — **P**
   Array/tags: `cruz`, `ressurreicao`, `providencia`, `atributos_deus`, `confissao_pecado`, `lamento`, `escatologia`, `graca`, `ceia`, `oracao`, etc. Permite detectar viés (só músicas de "vitória", nenhuma de "confissão"), gerar setlists balanceados. Fonte inspiracional: [Matt Merker — Corporate Worship](https://www.worshipministrytraining.com/what-is-corporate-worship-w-matt-merker/), [The Banner review](https://www.thebanner.org/news/2024/03/reformed-look-at-top-worship-songs-offers-caution-guidance).

3. **Campo `audio_referencia_url` por música** — **P**
   Link YouTube/Spotify/SoundCloud da versão canônica que a equipe adota. Habilita "ouvir passivamente durante a semana" (fase 3 do Santistevan). Complementa o item existente "Prévia MP3 embutida". Fonte: [Santistevan — Preparing for Rehearsal](https://www.davidsantistevan.com/preparing-for-rehearsal/).

4. **Página `/glossario-cues` no site** — **P**
   Dicionário controlado da PIPT: hand signals (I=1 dedo, V=5 dedos, "abaixa"=palma pra baixo, etc.), cues de talkback ("suspende", "tira o groove", "grande festa"), abreviações no chart. Baixo custo, alto valor pedagógico — resolve o problema de "cada um interpretou o sinal do outro do jeito diferente". Vale documentar a **convenção da PIPT** especificamente. Fontes: [God and Gigs — musician communication](https://godandgigs.com/2017/01/20/talking-notes-six-ways-musicians-communicate-on-stage/), [Nashville Number System — for worship teams](https://www.nashville-numbers.com/learn/for-worship-teams).

5. **Campo `nivel` por músico no `data/equipes.yml`** — **P**
   Enum `junior`, `titular`, `senior`, `discipulador`. Habilita relatório "quem está pronto para DM esta semana?" e "onde há gap por instrumento". Facilita pipeline de discipulado. Fonte: [Worship Initiative — Development & Discipleship](https://www.theworshipinitiative.com/blog-posts/development-discipleship-empowering-youth-for-worship-leadership).

6. **Campo `routing_multitrack` (se PIPT adotar backing tracks) — postergar** — **M**
   Documentar mapeamento de loops por saída ("loop 1 → click, loop 2 → pad, loop 3 → drums extras"). Resolve o problema visto em [YGj4CFMg7KA]. Adicionar somente se/quando backing tracks entrarem no fluxo.

7. **Exportação para formatos padrão** — **M**
   O `.pro` já é ChordPro. Adicionar botão "exportar para OnSong / WorshipTools Charts / OpenSong". Custo baixo (transformações simples); benefício alto: outros músicos podem usar suas ferramentas preferidas. Fontes: [ChordPro spec](https://www.chordpro.org/), [WorshipTools Charts ChordPro support](https://www.worshiptools.com/en-us/docs/69-ch-chordpro).

### Refinamentos a itens existentes

- **Item "mensagem_do_set"** — manter, mas explicitar que é opcional. Numa liturgia Reformada estrita, a mensagem é do sermão, não do set. O `funcao_liturgica` (recomendação nova acima) é ortogonal e mais forte.

- **Item "Escala de músicos no setlist"** — adicionar sub-item: **balancear níveis automaticamente** (baseado no campo `nivel`) — inspirado em Emily [BQgKcap4LaI] e Worship Ministry Training.

- **Item "Direção musical inline"** — a proposta atual está sólida. Adicionar sub-diretiva opcional `{grau_harmonico:}` por seção (`{grau_harmonico: I-V-vi-IV}`) — habilita display em Nashville Number System. Fonte: [Loop Community — NNS](https://loopcommunity.com/blog/2021/09/the-nashville-number-system/).

- **Item "View Diretor Musical"** — a proposta atual está sólida. Adicionar sub-elemento: **badge grande de contagem de entrada** (`contagem_entrada` visível 5s antes de virar seção) — reforça o achado da análise sobre a onipresença desse cue.

### Descartes / não fazer

- **Não adotar Planning Center Services** — o site custom já cobre o essencial (biblioteca, setlists, ChordPro); Planning Center adiciona escala sofisticada + mobile app polido a custo de trancar tudo num SaaS externo. Migração seria retrocesso na autonomia do projeto.
- **Não adotar MultiTracks/Loop Community como dependência estruturante** — catálogo em inglês, muito repertório PIPT não é coberto. Deixar como opcional (link no `.pro` se a música tiver track disponível).
- **Não construir editor ChordPro no site inicialmente** — [ChordProject Editor](https://github.com/chordproject/chordpro-editor) existe e é bibliografia; pode ser plugado no futuro se aparecer demanda. Priorizar features de consumo, não edição.

### Trade-offs claros

| Decisão | Prós | Contras |
|---|---|---|
| Continuar file-based (git) vs Planning Center | Autonomia total, integração com PR, custo zero | Sem app mobile polido, sem escala automatizada, entrada de dados é manual |
| Backing tracks sim/não | Consistência musical, permite banda enxuta cobrir arranjo complexo | Custo hardware, dependência de tecnologia ao vivo, tira flexibilidade |
| Adotar NNS no data model | Transposição instantânea, portabilidade entre igrejas | Curva de aprendizado; alguns músicos não conhecem |
| Estrutura CCM (set contínuo) vs Reformada (elementos litúrgicos) | CCM é mais familiar à cultura brasileira jovem; Reformada é fiel à tradição IPB | O compromisso do projeto é IPB — o modelo Reformado precisa ser suportado ainda que a prática atual seja híbrida |

---

## Livros/recursos recomendados

Curadoria priorizada para o contexto PIPT (Reformado, IPB, igreja pequena/média em PT-BR):

1. **Bob Kauflin — Worship Matters** (Crossway, 2008; PT-BR pela Fiel) — **prioridade 1.** Livro-referência prático + teológico alinhado à teologia PIPT.
2. **Matt Merker — Corporate Worship** (9Marks/Crossway, 2021) — como a Igreja se reúne; complementa Kauflin no plano eclesiológico.
3. **Zac Hicks — The Worship Pastor** (Zondervan, 2016) — para quem lidera equipe; 16 "hats" do worship pastor. Presbiteriano.
4. **Keith & Kristyn Getty — Sing!** (B&H, 2017) — família + igreja + canção; Reformado.
5. **Reformed Worship magazine** ([reformedworship.org](https://www.reformedworship.org/)) — assinatura ou browsing gratuito por temas litúrgicos.
6. **Sovereign Grace Music — Worship Matters Video Intensive** ([sovereigngracemusic.com/training/wmvi](https://sovereigngracemusic.com/training/wmvi/)) — curso video; se disponível em PT-BR seria ideal.
7. **David Santistevan — blog Beyond Sunday Worship** ([davidsantistevan.com](https://www.davidsantistevan.com/)) — perene sobre ensaio, transições, preparação. Não Reformado mas prático.
8. **Loop Community Blog** ([loopcommunity.com/blog](https://loopcommunity.com/blog/)) — quando backing tracks entrar em pauta.
9. **Nashville Number System Chart** ([nashville-numbers.com/learn/for-worship-teams](https://www.nashville-numbers.com/learn/for-worship-teams)) — cheat sheet gratuito.
10. **Michael Farley — "What is Biblical Worship?"** ([JETS 51/3, 2008 PDF](https://etsjets.org/wp-content/uploads/2010/06/files_JETS-PDFs_51_51-3_JETS-51-3-591-613-Farley.pdf)) — artigo de fundo sobre princípio regulativo em três abordagens Reformadas. Denso mas curto.
11. **Igracemusic.com — RUF Hymnbook Online** ([igracemusic.com/hymnbook](https://www.igracemusic.com/hymnbook/home.html)) — banco de hinos com harmonizações modernas em PT-EN.
12. **Editora Fiel / Cultura Cristã** — buscar catálogos para material Reformado em PT-BR sobre culto.

---

## Gaps que permanecem

O que **não** ficou coberto mesmo após a pesquisa web:

- **Modelo de dados formal para multitracks e stems** — quase toda documentação é operacional ("como setar Ableton") e não estrutural ("como versionar tracks junto com a cifra"). Se a PIPT adotar backing tracks, precisará projetar isso in-house.
- **Integração automática Google Calendar ↔ escala** — nenhum item pronto de mercado que faça isso bem para igrejas pequenas fora de Planning Center. Roadmap já cita `iCal para próximos ensaios` mas mão dupla (escala do site → agenda) é gap.
- **Metodologia Reformada específica de ensaio** — Sovereign Grace tem cursos, mas não achei um framework aberto e sistematizado tipo "5 fases" no idioma Reformado. A dicotomia é: material Reformado é forte em teologia/seleção; material CCM é forte em how-to de ensaio. Adaptar cross-tradition fica com o líder local.
- **Português + Reformado + prático** — combinação escassa online. A curadoria manual (traduzir Kauflin/Merker/Hicks internamente, publicar guias PIPT no site) preenche.
- **Formalização de cues condicionais** — o próprio corpus já apontava esse gap; a literatura anglófona também não formaliza como se documenta "se pastor subir, cai a dinâmica". Continua sendo pergunta de design aberta.
- **Ergonomia/segurança no palco** — poucos resultados focados. Área subatendida. Vale busca dirigida futuramente sobre hearing loss em músicos de igreja + protetores auditivos.
- **Comparativo de licenciamento CCLI para o contexto brasileiro** — não pesquisado a fundo. Se PIPT projeta letras ou grava culto ao vivo, matéria relevante que precisa consulta jurídica.
