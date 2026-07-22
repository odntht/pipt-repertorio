# Análise — Direção Musical de Louvor

Síntese extraída de 14 transcripts de vídeos YouTube (~4h30 de conteúdo).
Objetivo: informar decisões de data model e UX para a feature "Direção musical" do PIPT Repertório.

Nota sobre método: as transcripts são autogeradas, com trechos ininteligíveis e homofonias ("Grove"/groove, "couro" ~ solo/riff, "vs"/VST, "DM"/diretor musical, "sete"/set). Onde o texto foi ambíguo, uso "inferência:" explicitamente e evito extrair citações longas.

---

## Fontes analisadas

| Título | Canal | Dur. | ID | Densidade |
|---|---|---:|---|---|
| Líder do Louvor x Diretor Musical (live) | sftbot (Felipe + pastora Emily) | 62 min | BQgKcap4LaI | **alta** |
| 4 Passos para inserir um Diretor Musical | sftbot (Felipe) | 33 min | JbKbXInz9ho | **alta** |
| Ensaio / Bastidores — Direção Musical #10 | Lucas Bertolozo | 30 min | aByWMGp3H7U | **alta** (didática indireta — é um ensaio real, mostra o vocabulário em uso) |
| Direção Musical na Igreja (Na Prática!) | GuitarChurch (Bill) | 15 min | -xALGfXl1Co | **alta** |
| A REAL sobre os Diretores de Banda | GuitarChurch | 14 min | aYxH5IgqEUQ | média |
| Worship não é ruim, você quem toca errado | GuitarChurch | 16 min | rJyB_y8wsAQ | média |
| Saiba como melhorar o desempenho da sua banda com o Diretor Musical | sftbot (Edson Doriguete) | 8 min | PRt1IWfpk1s | **alta** |
| COMO TOCAR TECLADO SEM EMBOLAR COM A BANDA | Lucas Bertolozo | 11 min | niOASEvnrQg | **alta** (guidance de instrumento) |
| Dicas para audição do louvor | GuitarChurch | 10 min | YGWKaXwi2kQ | média |
| Santo Pra Sempre — direção de banda (ao vivo) | GuitarChurch | 8 min | -rwOI1vXmRo | baixa-média (áudio de culto; poucos insights novos além do -xALGfXl1Co) |
| COMO CRIAR UM ARRANJO: duração/tamanho ideal | marciomello | 5.5 min | KfY2Tc4c8jg | média (foco em arranjo p/ mídia, não igreja) |
| Existe Ministério de Louvor? | Ana Paula Valadão | 4 min | IFZ_R8-NjXY | baixa (teologia/nomenclatura, pouca prática) |
| TREM BALA — A arte de criar arranjos | marciomello | 3 min | WU8NO3i_cIE | **baixa** (é a música tocando; sem conteúdo didático) |
| Ana Paula fala sobre preparo antes da Ministração | (canal terceiro) | 2.5 min | 43-ghwysFd0 | baixa (só preparo espiritual) |

---

## Vocabulário identificado

Termos que reaparecem entre canais — candidatos a vocabulário controlado no data model.

### Seções de música (estrutura)

- **Intro / introdução** — abertura instrumental. "Dois intro. Dois 3 4" [Guitar­Church: -xALGfXl1Co]. Contagem antes da entrada.
- **Verso / verse** — parte melódica narrativa. "Verso um dois três quatro" [-xALGfXl1Co, -rwOI1vXmRo]. Marcio Mello alerta que introduções longas fazem público "passar à frente" [KfY2Tc4c8jg].
- **Pré-refrão** — parte de transição/subida entre verso e refrão. "Olha o pré refrão. Vamos vir, bandas. Dois trê..." [GuitarChurch, -rwOI1vXmRo].
- **Refrão / coro / chorus / couro** — parte principal cantada. Aparece MUITO. "vai pro coro" [BQgKcap4LaI]. Nota: em várias transcripts "couro" é a homofonia de "coro"/chorus.
- **Ponte / bridge / bonte** — parte contrastante. "Ponte grande pausa" [aByWMGp3H7U]. Também aparece como "bonte" na transcript por erro de reconhecimento.
- **Instrumental** — trecho sem letra. "puxar só instrumental primeiro aí a igreja vai começar a cantar" [aByWMGp3H7U].
- **Interlúdio** — trecho instrumental entre partes. [aByWMGp3H7U: "interludio"].
- **Tag** — repetição curta de uma linha do refrão como fecho. "Olha a tag. Vamos lá banda" [-rwOI1vXmRo].
- **Solo** — trecho instrumental de destaque. [aByWMGp3H7U].
- **Final** — indicado explicitamente no mapa. "verso... refrão... final." [-xALGfXl1Co].
- **Espontâneo** — ministração improvisada em cima de base. "estendeu a música num espontâneo, deixa só o clique pro Batera não se perder" [aYxH5IgqEUQ].

### Dinâmica

- **Grande pausa** — todo mundo para (ou fica só uma camada). "refrão grande pausa" e "Ponte Grande pausa" [aByWMGp3H7U] — usadíssimo por Lucas Bertolozo.
- **Suave** — dinâmica baixa. "suave" [aByWMGp3H7U]; "verso um entra bateria suave" [-xALGfXl1Co].
- **Crescendo** — subir progressivamente. "crescendo" [aByWMGp3H7U]; "toda banda cresce" [aByWMGp3H7U].
- **Vai cair** / **cair** — descida brusca de dinâmica. "vai cair" [-rwOI1vXmRo]; "vai cair sempre" — inferência: mudança abrupta para trecho mais suave.
- **Não deixa morrer** — manter energia, não deixar a música se apagar. "Glória a Deus. Não deixa morrer, tá pessoal" [-rwOI1vXmRo] — usado quando o diretor quer que a banda sustente após um refrão que naturalmente cairia.
- **Todo mundo alto / construindo** — subida coletiva. "todo mundo alto com a construindo" [aByWMGp3H7U].
- **Vem, banda** — comando pra banda entrar/subir. "Vem, vem, banda" [-xALGfXl1Co].
- **Dinâmica** (termo genérico) — "não sabe nem a dinâmica da música, não sabe nem a hora que cresce, a hora que desce" [aYxH5IgqEUQ]. Bill (GuitarChurch) usa como sinônimo de "arco de intensidade".
- **Ambiência / ambientação** — colchão sonoro (pad, textura). "ela toda ambientação" [aByWMGp3H7U]; "delay/reverb ambiência" [-xALGfXl1Co].

### Elementos técnicos

- **Mapa (da música / de ensaio)** — o esquema estrutural. "eu percebi que aqui no final do mapa dela..." [-xALGfXl1Co]; "É melhor forma de fazer isso é através de um mapa de ensaio" [PRt1IWfpk1s: Edson explicita — "estrutura da música + observações do diretor musical em relação a cada parte, dinâmica, entrada ou saída de instrumento, abertura de vozes"].
- **Clique** — click track. "clique pro Batera não se perder" [aYxH5IgqEUQ]; "trocar conversa" ~ trocar por clique [BQgKcap4LaI, inferência].
- **VS / v** — VST/tracks/multitracks. "eu vou editar aqui. Eu não quero esse quinto verso... e nesse final eu vou adicionar uma sessão de clique da música" [-xALGfXl1Co]. Bill usa "multitracks" também.
- **Guia** — provavelmente click com contagem verbal. "tirando a questão do clique e da guia amanhã" [-xALGfXl1Co].
- **Voz de Deus** — microfone do diretor que vai só para o retorno dos músicos, não pro público. "esse canal que vai direto para os músicos é popularmente conhecido no meio musical como a voz de Deus" [PRt1IWfpk1s].
- **Tom / tonalidade** — "escolheu as músicas... precisa destino tom da música" [BQgKcap4LaI].
- **BPM / andamento** — "escolher uma música que o BPM tá lento demais e o querer fazer uma média e com BPM rápido demais... como é que vai ser essa transição" [BQgKcap4LaI].
- **Modular / subir o tom** — "subiu o Tom aí tem que mudar o tom aí na mesa" [aByWMGp3H7U].
- **Virada** — drum fill. "faz uma virada aí entendeu para ficar bem Evidente" [aByWMGp3H7U]; "excelente virada hein Davi" [aByWMGp3H7U].
- **Groove / grove** — levada. "já põe o Grove" [aByWMGp3H7U].
- **Levada** (inferência a partir de "Grove") — padrão rítmico da bateria/base.
- **Inversões** — inversões de acorde. "Pode Até Rolar umas inversões nas últimas" [aByWMGp3H7U].
- **Dobrar (as cordas)** — reforçar linha. "Henrique aí você dubla as cordas" [aByWMGp3H7U] — inferência: dobrar em oitava ou repetir a linha em outro timbre.
- **Chapar (acordes)** — tocar acorde longo sem ritmo. "só chapando os acordes" [niOASEvnrQg: Lucas].
- **Furar a Mix** — dar corpo/presença suficiente pra guitarra aparecer na mixagem. "não vou nem entrar no assunto de como furar a Mix" [rJyB_y8wsAQ].
- **Naipe** — família de instrumentos (guitarras, teclados, vocais). "líder eh geral daquele naipe" [aYxH5IgqEUQ].

### Papéis

- **DM / diretor musical / diretor de banda** — indistintamente usados.
- **Líder de louvor / dirigente / ministro de louvor** — condutor espiritual do culto. Ana Paula rejeita a nomenclatura "Ministro de louvor" [IFZ_R8-NjXY]: "você é um guitarrista... você bate a bateria. É diaconia, é serviço."
- **Colíder** — como Emily descreve o DM: "eu acho que o DM é ele tá ali como um Colíder" [BQgKcap4LaI].

---

## Frameworks e modelos

### Felipe (sftbot) — "4 passos para inserir a direção musical" [JbKbXInz9ho]

1. **Trazer soluções, não problemas.** Identificar insatisfações musicais concretas (não ataques pessoais) e propor caminhos. Não criar "ambiente de reclamação".
2. **Caminhar com seu time.** Identificar (ou *levantar*) a pessoa com perfil de DM: alguém que já ajuda com cifras, escuta muita música, tem noção musical.
3. **Processo lento — mudança de cultura.** "Vai demorar. A gente ficou um ano só experimentando." Insistir; nada de regras impostas de cima.
4. (Comercial — comprar o curso dele.)

### Felipe + Emily (sftbot) — Ciclo de decisão de repertório [BQgKcap4LaI]

Duas fases documentadas:
- **Fase antiga:** DM + líder de louvor da dupla decidiam via WhatsApp, música por música.
- **Fase atual (2 meses antes da live):** todos os líderes de louvor + DM geral se reúnem uma vez por mês e definem o **mês inteiro** num quadro. Uma música-âncora se repete várias semanas para "penetrar no coração da igreja".
- Depois disso, DM da semana + líder da semana afinam por WhatsApp (mapa, repetições específicas, momentos de fala).

Reuniões: **quinzenais**, 1h–1h30. Alternam entre "burocráticas" (repertório, escala) e "de crescimento" (leitura de livro juntos, feedback, discipulado).

### Emily — Composição da escala [BQgKcap4LaI]

- Recusa "banda fechada" (mesmo time toca sempre junto). Motivos: gera panelinha, comparação, discrepância de qualidade entre cultos.
- Regra: **mesclar** músicos experientes com intermediários e iniciantes em cada culto.
- Efeito colateral: discipulado natural — o mais forte puxa o mais fraco; o mais forte "desce do salto".
- Custo: dá mais trabalho fazer a escala; ganho compensa.

### Edson Doriguete (sftbot) — Atribuições do diretor musical [PRt1IWfpk1s]

Lista explícita (parafraseada):
1. **Organizar o ensaio** — diretrizes de como acontece, ordem das músicas, como tratar dúvidas.
2. **Transportar o estúdio para o ao vivo** — adaptar arranjos que não são executáveis com o time disponível.
3. **Cuidar dos arranjos e questões técnicas** — timbres, estrutura, repetições, tom.
4. **Fazer (ou delegar) o mapa de ensaio.**

Também define o "microfone voz de Deus" como ferramenta padrão.

### Bill (GuitarChurch) — Fluxo semanal do diretor de banda [-xALGfXl1Co]

- **Semana inteira:** ouve o repertório passivamente.
- **Sábado:** senta pra tirar detalhe por detalhe, ajustar timbres, editar VS (cortar estrofes/pontes que não vão ser usadas, adicionar loop de clique após o fim para o pastor orar).
- **Domingo:**
  - Chegada + montagem + passagem de som (**só ajustar som — nunca aprender música**).
  - Passagem de liturgia com diretor de culto (alinhar quais partes da música colam com quais momentos do culto).
  - Culto: dirige com voz de Deus e sinais.

### Bill — Guia p/ audição de louvor [YGWKaXwi2kQ]

Hierarquia de critérios de aprovação de um novo músico:
1. **Mindset:** vá pra ser aprovado, não pra provar nada.
2. **Preparo com antecedência** (tirar a música no metrônomo).
3. **Setup essencial** (não levar cadeia complexa de pedais).
4. **Responsabilidade + espiritualidade** (vida de oração, pontualidade).
5. **Tocar SÓ o que a música pede** (não inventar solos onde não tem guitarra na gravação). Ele conta o caso de Worthy do Elevation Worship, onde ficou parado no início.
6. **Comprometimento além da música** (não atrasar, ter reposição de corda).

---

## Papel: Líder de Louvor vs Diretor Musical

Vários vídeos exploram essa distinção. Convergências:

**Líder de louvor** (ou "dirigente"):
- Escolhe as músicas (Emily é enfática: "quem escolhe as músicas são os líderes... o DM é suporte") [BQgKcap4LaI].
- Define a **mensagem/tema** do set (ex.: "quero terminar falando sobre paternidade de Deus") [BQgKcap4LaI, fala de Emily sobre Marcos].
- Ministra à igreja — foca em conduzir a congregação em adoração.
- Toma decisões espontâneas durante o culto (repetir mais um refrão, mudar música, ir pra oração).

**Diretor musical**:
- Traduz a mensagem/visão do líder em **decisões musicais**: arranjos, estruturas, timbres, ordem de entrada.
- Faz o mapa da música (quando/como cada instrumento entra, dinâmica por seção).
- Organiza ensaio e execução.
- Segue o líder durante o culto: comunica pra banda quando líder pede mais uma repetição, sinaliza mudanças, mantém banda no mesmo compasso durante orações.
- Faz "equilíbrio de realidade": se líder quer arranjo que o time não dá conta, sugere simplificar. Se BPMs não combinam, sinaliza. "É minha, olha esse medley, essa música aqui a 4 por 4 e a outra nesses por 8 não vai rolar" [BQgKcap4LaI].
- Bill (GuitarChurch) descreve ainda a "corda bamba" da oração pastoral: manter o clima musical enquanto o pastor fala, ajustando volume à energia da oração [-xALGfXl1Co].

**Insight-chave (Emily) — não é hierarquia, é serviço mútuo:**
> "O DM é submisso ao líder, não é ele que manda em tudo. Fica todo mundo servindo um ao outro." [BQgKcap4LaI]

**Contraponto de nomenclatura (Ana Paula Valadão)** [IFZ_R8-NjXY]:
- Nega o termo "Ministério de louvor" e "Ministro de louvor". Para ela, música na igreja é **diaconia** (serviço), não ministério (transmissão da verdade do evangelho). O pastor é quem deveria dirigir o louvor.
- Isso é um contraponto teológico — mas na prática todos os outros vídeos usam livremente "Ministério de Louvor" / "líder de louvor". Vale registrar como divergência de vocabulário.

---

## Guidance por instrumento

### Teclado (Lucas Bertolozo — niOASEvnrQg)

Três regras práticas para não "embolar":

1. **Pedal de sustain**: tirar e pisar novamente ao trocar de acorde. Sem pedal = som seco; com pedal mal usado = tudo empapado.
2. **Região do teclado**: com banda tocando, ficar nos **médios**. Graves colidem com baixo, agudos colidem com guitarra/solo.
3. **Rítmica**: se violão já está fazendo o ritmo, o teclado **chapa** acordes (deixa parado) e faz pequenas ornamentações. Não repetir ritmo com outros instrumentos.

Emily comenta no mesmo sentido [BQgKcap4LaI]: liderar de teclado a limitava — "onde eu podia dar 10, eu tava dando 8".

### Guitarra (GuitarChurch — rJyB_y8wsAQ, YGWKaXwi2kQ, -xALGfXl1Co, aYxH5IgqEUQ)

- **Ouvir as linhas da gravação e reproduzir com fidelidade**, não sair inventando. Se a versão tem uma linha melódica que "guia melodicamente", tocar essa linha (não só ritmo). Se não tem guitarra na intro, ficar quieto.
- **Timbre por seção**: Bill mostra sua Divton configurada com 5 posições (clean, com delay, high gain, crunch com reverb/delay, clean com reverb) e troca pisando um botão por seção da música [-xALGfXl1Co].
- **Não brigar com violão**: se violão faz o ritmo, guitarra faz linhas e ambiência, não power chord com pestana [rJyB_y8wsAQ].
- **Setup simples para audição**: nada de pedaleira barroca [YGWKaXwi2kQ].

### Baixo

Nenhuma menção específica encontrada além de "baixo faz os graves — teclado não invade essa região" [niOASEvnrQg]. Aparece pontualmente no ensaio de Lucas Bertolozo pedindo "libera o baixo" (relacionado a captador/instalar) [aByWMGp3H7U].

### Bateria

- Marcação de **viradas** aparece explicitamente no ensaio: "faz uma virada aí para ficar bem evidente esse contraste" [aByWMGp3H7U].
- **Chimbal fechado vs. aberto**: "esse groove pode ser com um chimbal mais fechadinho, você só abre de vez em quando isso fica mais maldoso" [aByWMGp3H7U].
- **Bumbo quatro-quatro (bumbo quo)**: comando explícito de Lucas — "pode pôr o bumbo quo também Davi" [aByWMGp3H7U] (inferência: bumbo em todos os tempos).
- **Clique / metrônomo**: função do batera ficar "amarrado no ritmo" mesmo em espontâneo [aYxH5IgqEUQ].

### Vocal

- Emily: quando lidera de instrumento, se sente limitada. **Liderar solto** (só cantando) é mais livre [BQgKcap4LaI].
- Bill: **não deixar morrer** a energia após o pastor terminar oração — os vocais precisam conduzir a igreja de volta [-xALGfXl1Co].
- Preparo de voz: "faço aula de canto até hoje" — Emily [BQgKcap4LaI].

### Backing vocal

Nenhuma menção específica de arranjo/técnica encontrada nos 14 vídeos.

---

## Fluxo de trabalho (setlist → ensaio → culto)

Duas visões, complementares:

### Visão sftbot (Felipe + Emily) — foco em processo e discipulado

```
Reunião mensal de líderes (2h antes do fim do mês)
  └─ decide repertório do mês inteiro
     └─ DM geral distribui pros DMs semanais
        └─ DM semanal + líder semanal ajustam no WhatsApp (mapa, repetições, tema)
           └─ Ensaio da semana
              └─ Culto de domingo
                 └─ Feedback ("caixinha de sugestões" da igreja na segunda)
Reunião quinzenal do time inteiro (1h–1h30)
  └─ alternar burocracia (repertório/escala) com crescimento (livro juntos, feedback)
```

### Visão GuitarChurch (Bill) — foco no dia a dia do músico/DM

```
Semana: ouvir passivamente
Sábado: sentar, tirar detalhes, ajustar timbres, editar VS
         (cortar seções que não serão usadas, adicionar clique de "espera" pós-final)
Domingo:
  1. Montagem + passagem de som (SÓ som — nada de arranjo aqui)
  2. Passagem de liturgia com diretor de culto (amarrar músicas aos momentos)
  3. Culto — dirigir com voz de Deus, ajustes em tempo real
```

### Visão Lucas Bertolozo — o ensaio em si

O vídeo 30-min é o próprio ensaio [aByWMGp3H7U]. O DM (Lucas):
- Chama seções pelo nome antes delas começarem ("verso um dois três quatro", "olha o pré refrão", "olha a tag").
- Faz contagem de entrada explicit­a ("um dois três quatro").
- Corrige em tempo real: dá comandos de dinâmica ("suave", "cresce"), pede viradas específicas ("faz uma virada aí para ficar bem evidente"), sugere timbre de bateria ("chimbal mais fechadinho").
- Também trata pepino técnico (baixo desconecta, pede troca de captador).

---

## Problemas comuns citados

Valida ou desafia items do ROADMAP:

- **Ninguém tira as músicas com antecedência** — recorrente [JbKbXInz9ho, YGWKaXwi2kQ, aYxH5IgqEUQ]. Bill: "chegar no dia sem ter tirado é desrespeito." Valida ideia de "prévia MP3 embutida" e reforça o Modo palco / autoscroll.
- **Ensaio vira reunião de dúvidas técnicas** — [JbKbXInz9ho, -xALGfXl1Co]. "Passagem de som não é pra aprender música." Reforça que documentação/direção musical precisa existir *antes* do ensaio.
- **"Cada um vai pra um lado no espontâneo"** — [BQgKcap4LaI, PRt1IWfpk1s]. Falta de comunicação sobre o mapa da música.
- **Excesso de música nova, igreja não decora** — [BQgKcap4LaI, Emily]. "A gente tem mania de fazer música nova, não deixa a mensagem penetrar." Diretamente relevante para o item "Última vez tocada" do ROADMAP.
- **Panelinha e comparação entre times** — [BQgKcap4LaI]. Feedback de que "o culto de manhã foi ruim, o da noite foi bom" quando são times separados.
- **Excesso de "criatividade" sem noção do que a música pede** — [rJyB_y8wsAQ, YGWKaXwi2kQ, aYxH5IgqEUQ]. Guitarrista virando jazzista onde não cabe.
- **Direção musical vista como "engessa a ação do Espírito Santo"** — [-xALGfXl1Co, aYxH5IgqEUQ]. Bill dedica um vídeo inteiro a rebater essa crítica.
- **Falta de conhecimento sobre o próprio papel de DM** — [PRt1IWfpk1s]. Muitas igrejas não têm essa função porque não sabem que existe.

---

## Ferramentas mencionadas

- **VST / multitracks / VS** — Bill (GuitarChurch) usa e mostra editando (cortar/rearranjar seções, adicionar clique de espera) [-xALGfXl1Co].
- **Clique / click track** — universal.
- **Metrônomo** para preparação individual [YGWKaXwi2kQ].
- **Guitarra Divton (M Studio da Ziron)** — Bill mostra especificamente por ter troca de banco rápida [-xALGfXl1Co] (curiosidade — não é ferramenta de direção).
- **Preset de guitarra (GP2)** — Bill vende o dele; menciona também Kemper, Baby, Tank G, Matrix Box como referências físicas [aYxH5IgqEUQ].

**Nenhuma menção específica** a Planning Center, Ableton Live como setlist manager, OnSong, MultiTracks.com, Loop Community — ferramentas comuns no mundo worship EN mas ausentes deste corpus.

---

## Sugestões concretas de features / data model

Todas atribuídas explicitamente à(s) fonte(s) de origem.

### Campos do data model — sugestão de esquema

Baseado nos padrões que aparecem nos vídeos, um "documento de direção" por música deveria capturar:

**A. Metadados da música** (já quase todos previstos no ChordPro atual)
- `tom` (canônico da equipe) — universal
- `bpm` — [YGWKaXwi2kQ, BQgKcap4LaI: "escolher uma música que o BPM tá lento demais e outra rápido demais, como é que vai ser essa transição"]
- `compasso` (4/4, 6/8) — [BQgKcap4LaI: "essa música 4 por 4 e a outra 6 por 8 não vai rolar"]
- `duracao_estimada` — [KfY2Tc4c8jg fala de duração para plataformas, mas em igreja o líder precisa disso para caber na liturgia]

**B. Mapa da música (song-level)** — o "mapa" citado por Edson [PRt1IWfpk1s] e Bill [-xALGfXl1Co]:
- Sequência de **seções** enumeradas com nome canônico:
  - `intro`, `verso`, `pre_refrao`, `refrao`, `ponte`, `instrumental`, `interludio`, `tag`, `solo`, `final`
  - (Vocabulário controlado — todos os DMs usam esses termos.)
- Cada seção tem:
  - `dinamica`: enum (`suave`, `medio`, `forte`, `grande_pausa`, `crescendo`, `cair`) — extraído de [aByWMGp3H7U]
  - `entra` / `sai`: lista de instrumentos que entram ou saem — [PRt1IWfpk1s explicita: "entrada ou saída de instrumento"]
  - `observacoes`: texto livre (para "chimbal mais fechado", "dobrar as cordas", etc.)

**C. Direção por instrumento (namespaced)**
- Confirmação de todos os canais: instrumentos têm papéis distintos. Um campo `direcao_por_instrumento` com sub-namespaces:
  - `bateria`: virada em X, chimbal fechado no groove Y
  - `baixo`: sobe em oitava no refrão final
  - `teclado`: chapa acordes; entra pad no verso 3
  - `guitarra`: timbre/preset por seção; dobrar a linha do vocal em X
  - `violao`: dedilhado / batida
  - `vocal`: quem lidera, quando entra a segunda voz
- Recomendação: **namespaces** > texto livre único, pois:
  - Bill mostra 5 timbres por música por seção [-xALGfXl1Co] — só faz sentido no namespace guitarra.
  - Emily descreve o item "templates de direção por equipe" no ROADMAP como valioso porque *cada naipe tem seu próprio ensaio individual*.

**D. Notas contextuais de execução (setlist-level)** — já no ROADMAP como item separado; validado pelas transcripts:
- "Hoje sem bateria" / "modular na 3ª estrofe" / "pular ponte" — Bill mostra editando o VS pra cortar seções por causa da liturgia [-xALGfXl1Co]. Isso é override do mapa canônico só naquela ocasião.

**E. Direção do arco do set** (novo — não estava explícito no ROADMAP)
- Emily [BQgKcap4LaI] enfatiza que o líder define **uma mensagem por set**. Um campo no setlist tipo `mensagem_do_set` (ex.: "paternidade de Deus") + `momento_de_fala` marcado entre músicas seria útil.

### Vocabulário controlado vs. texto livre

Recomendação baseada no que se repete inter-canais:

| Dimensão | Recomendação | Justificativa |
|---|---|---|
| Nomes de seção | **Enum** | Vocabulário 100% convergente (intro/verso/refrão/ponte/instrumental/tag/final) [todos os vídeos] |
| Dinâmica | **Enum + texto** | Enum coberto ("suave", "grande pausa", "crescendo", "cair", "não deixa morrer" [-rwOI1vXmRo, aByWMGp3H7U]); texto para nuance |
| Instrumento | **Enum** | Fechado (bateria, baixo, teclado, guitarra, violão, vocal, backing) |
| Papel/tipo de ação (entra/sai/dobra/chapa) | **Enum** | Vocabulário técnico convergente entre Lucas Bertolozo e ensaio |
| Descrição musical fina (virada, riff, ambiência) | **Texto livre** | Muito idiossincrática — "chimbal fechadinho", "mais maldoso" não cabem em enum |
| Timbre/preset de guitarra | **Texto livre + referência opcional** | Bill nomeia posições (1/2/3/4/5) mas depende do setup individual |

### Granularidade recomendada

Convergência forte: **por seção** é o certo, não por linha nem por compasso.
- Todos os cues do ensaio de Lucas Bertolozo [aByWMGp3H7U] são por seção ("olha o pré refrão", "grande pausa", "refrão todos juntos").
- Edson [PRt1IWfpk1s] define mapa como "estrutura + observações **por parte**".
- Bill edita VS **por seção** [-xALGfXl1Co].
- Sub-granularidade só útil em casos específicos (ex.: "última repetição do refrão faz inversão" [aByWMGp3H7U]) — resolvíveis com texto livre dentro da seção.

Rejeito **por compasso**: nenhuma transcript sugere esse nível de granularidade — é excesso pro contexto de igreja.

### UX

- **Toggle "esconder direções"** (já no ROADMAP) — validado. Bill mostra que músicos experientes preferem cifra limpa; DM/líder precisam ver tudo.
- **View filtrada por naipe** (já no ROADMAP como "Templates de direção por equipe") — validado por múltiplos vídeos. Cada instrumento tem guidance específico.
- **View "diretor musical"** — nova sugestão: mostra mapa da música destacado (dinâmica + entrada de instrumentos), com cifra em segundo plano. Baseada no fato de que o DM não precisa da cifra em foco enquanto conduz.
- **View "líder de louvor"** — nova sugestão: mostra letra + mensagem do set + notas de "quando falar". A cifra vira secundária. [Emily foca em mensagem, não cifra — BQgKcap4LaI].
- **Contagem de entrada visual** — inspirada no jeito que Lucas [aByWMGp3H7U] e Bill [-xALGfXl1Co] contam antes de cada seção. Pode ser só um "2 3 4" antes do refrão na tela.
- **Marcador de repetição customizável no setlist** — Emily [BQgKcap4LaI] pede "esse couro em vez de 2x eu quero 4x". Setlist deveria permitir override de contagem por música por ocasião. Complementa "Notas de execução por setlist".

---

## Ideias extra (fora de "direção musical")

Sugestões que apareceram nas transcripts mas se encaixam em outras seções do ROADMAP:

- **Player de referência da versão canônica** — Bill [rJyB_y8wsAQ, YGWKaXwi2kQ] e Lucas [niOASEvnrQg] repetem "escutar a gravação original com atenção". Casa com "Prévia MP3 embutida" no ROADMAP; sugere que possa haver **múltiplas** referências por música (versão original + versão da equipe).
- **Escala/agenda com mescla de níveis** — Emily [BQgKcap4LaI] descreve escala mesclando níveis. O item "Escala de músicos no setlist" do ROADMAP poderia incluir um metadado de nível de cada músico, e a view de escala mostrar o mix.
- **"Contador de repetições"** — Emily traz *dados* pro time: "essa música a gente só cantou 2 vezes esse trimestre" [BQgKcap4LaI]. Casa com "Última vez tocada" + sugere dashboard de contagem.
- **Notas de aprovação por música com decisão explícita** — Ana Paula [IFZ_R8-NjXY] tem posição forte sobre nomenclatura. Se o repertório da PIPT tem músicas com controvérsia teológica, o campo `notas_lideranca` do ROADMAP deveria acomodar isso — talvez com um flag "revisar em X" ou "aprovada com ressalva".
- **Timer/duração estimada por música e por setlist** — Marcio Mello [KfY2Tc4c8jg] insiste em duração de arranjos. Pra culto isso importa porque a liturgia tem janelas. Sugestão: campo `duracao_media` + soma no setlist.
- **Preparo espiritual** — Ana Paula [43-ghwysFd0]: "preparação de longo prazo" + "preparação de curto prazo (10 min antes)". Não vira feature de site, mas pode virar item no "modo palco" (ex.: "10 min de silêncio antes do culto" como opção).

---

## Gaps de cobertura

O que estes 14 vídeos NÃO cobrem e permanece em aberto:

- **Notação musical formal** (pp / mf / ff / ritardando etc. do ROADMAP). Zero vídeo usa notação clássica; todos usam vocabulário coloquial ("suave", "grande pausa", "cair"). Sugere que o projeto **não** deve exigir notação clássica — mas pode oferecer como opcional para músicos com formação erudita.
- **Multi-instrumento em notação simultânea** (ex.: partitura de banda). Ninguém trabalha assim no corpus — todos trabalham com cifra + mapa por seção.
- **Como versionar o mapa** quando muda ao longo do tempo (o arranjo evolui). Nenhum vídeo trata disso; o projeto vai precisar decidir sozinho.
- **Backing tracks / stems** — mencionado casualmente (Bill edita VS), mas nenhum vídeo explica como as igrejas menores lidam com isso. Fica em aberto.
- **Modo compacto para "banda enxuta"** — Edson [PRt1IWfpk1s] fala em "adaptar arranjo pro time disponível", mas nenhum vídeo detalha o processo. Item para pesquisa futura.
- **Integração com escala/agenda** — nenhum vídeo mostra ferramenta; todos os DMs parecem usar WhatsApp. Confirma o gap que o ROADMAP já identifica.
- **Convenção de "quem começa"** — mencionado várias vezes ("teclado começa suave", "só voz e violão") mas nunca formalizado. É um subcampo natural do mapa (seção `intro` com `entra: [teclado, voz]`).

**Nota sobre a série sftbot ausente:** foram identificados na tarefa 16 vídeos da série "Nº Episódio - DIREÇÃO MUSICAL NA IGREJA!" (canal sftbot) que não têm captions disponíveis. Provavelmente conteúdo mais aprofundado e prático da mesma linha de raciocínio dos 3 vídeos do Felipe já cobertos aqui — permanecem como gap de cobertura.
