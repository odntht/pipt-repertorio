# Análise — Direção Musical de Louvor (v2)

Síntese extraída de **30 transcripts** de vídeos YouTube (~5h30 de conteúdo). Versão v2 acrescenta 16 arquivos transcritos localmente com whisper-cpp (modelo large-v3-turbo): 15 micro-clipes da série numerada "Nº Episódio — DIREÇÃO MUSICAL NA IGREJA!" do canal sftbot (5–13 min cada, mostrando cues do DM ao vivo durante ensaio/culto) + o "Ensaio / Bastidores — Direção Musical #14" do Lucas Bertolozo (46 min, complementa o #10).

Objetivo: informar decisões de data model e UX para a feature "Direção musical" do PIPT Repertório.

Nota sobre método: as transcripts do YouTube são autogeradas, com trechos ininteligíveis e homofonias ("Grove"/groove, "couro"/coro/solo, "vs"/VST, "DM"/diretor musical, "sete"/set). As novas transcripts whisper foram melhores em PT, mas alucinaram em trechos musicais (filtragem já aplicada em pré-processamento — remoção de "A CIDADE NO BRASIL", "Se inscreva", "Música", pontos isolados). Ainda assim, os micro-clipes da série sftbot têm cobertura fraca por natureza (vídeos curtos, poucas linhas por arquivo). Onde o texto foi ambíguo, uso "inferência:" explicitamente e evito extrair citações longas. Cues genuínos aparecem como frases curtas repetidas com semântica de comando ("Verso", "Coro suave", "Solta a tag", "Vou jogar lá embaixo agora") — foi esse o filtro usado para separar sinal de alucinação.

---

## Fontes analisadas

### Vídeos didáticos / aulas (14 originais)

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

### Micro-clipes de cues ao vivo — série sftbot (15 novos)

Todos são cortes curtos do DM falando com a banda durante ensaio/culto. Não têm conteúdo didático narrado; o valor é observacional (vocabulário em uso). Cobertura por vídeo é baixa mas o **conjunto** é altamente convergente.

| Ep. | ID | Dur. | Linhas úteis | Observação |
|---:|---|---:|---:|---|
| 1º | LIRQV-Ss4bY | 8 min | ~14 | Contagem antes de seção, "coro suave" |
| 2º | ft8ROCQNNsQ | 5.3 min | ~10 | "Muita nota" (crítica de guitarrista), posicionamento no palco |
| 3º | 1uDClAEWoF0 | 5.8 min | ~6 | Cobertura fraca — só cue de tom pós-virada |
| 5º | lRKvJdJAo0c | 5.3 min | ~11 | "Vencedor seis por oito", "Bebizinho, batera, entra", "Segue na tag" |
| 10º | yGZT7-U2R2I | 6.7 min | ~15 | "Groove Pleno", "Vamos jogar para a igreja, o pastor vai estar subindo" |
| 15º | _TxvDMLuUbM | 6.3 min | ~24 | "Verso Patrícia", "Vou encerrar", "Me dá um sinal" (DM ↔ líder) |
| 20º | psnEAxBXpBg | 7.6 min | ~11 | "Vamos jogar lá embaixo", "Vou ficar repetindo o interlúdio" (loop aberto) |
| 25º | YGj4CFMg7KA | 6.7 min | ~13 | Troubleshooting de multitrack ("loop 3 e 4 tá vindo no teclado") |
| 30º | 6JHSPQw4ghc | 6.4 min | ~29 | "Pegadinha, Osvaldo", "Três tags, vem!" (contagem de tags), feedback de letra |
| 34º | fN5xGT4jex0 | ~7 min | ~35 | Cues para solistas nominais, emenda de músicas |
| 35º | UqBFVYYilvo | ~7 min | ~13 | Cue condicional: "se o pastor subir, joga pra baixo" |
| 40º | uXYnEZkvFZY | ~5 min | ~12 | "Um, dois, três, guitarra" (contagem+entrada), "Grande festa" |
| 43º | cHIkbDV-1SA | ~6 min | ~19 | "Render um pouquinho mais", "Vou lá embaixo. Preparado?" |
| 44º | fcaobJ7blr0 | ~7 min | ~39 | "Tchau, guitarra" (cue de saída), "Vai desacelerando / se acelera" (rall/accel) |
| 45º | b6CrWRVm4ZI | ~9 min | ~70 | "Ponte o sexto grau" (cue harmônico por grau), "Pausa em dó" |

### Ensaio complementar (1 novo)

| Título | Canal | Dur. | ID | Densidade |
|---|---|---:|---|---|
| Ensaio / Bastidores — Direção Musical #14 | Lucas Bertolozo | 46 min | zVoDm8UDtOw | **alta** (ensaio real, vocabulário refinado; complementa aByWMGp3H7U) |

---

## Vocabulário identificado

Termos que reaparecem entre canais — candidatos a vocabulário controlado no data model. As entradas novas na v2 estão marcadas com **[NOVO]** ou têm citação a IDs dos novos vídeos.

### Seções de música (estrutura)

- **Intro / introdução** — abertura instrumental. "Dois intro. Dois 3 4" [-xALGfXl1Co]. Contagem antes da entrada. Confirmado nos novos vídeos ("Intro / Toda banda / 1, 2, 3, 4" [zVoDm8UDtOw]).
- **Verso / verse** — parte melódica narrativa. "Verso um dois três quatro" [-xALGfXl1Co, -rwOI1vXmRo]. Numerado explicitamente nos novos: "Verso 1", "Verso 2" [zVoDm8UDtOw]; "Vamos pro verso 2, tá?" [6JHSPQw4ghc]. Também aparece como cue direto: "Verso" [LIRQV-Ss4bY].
- **Pré-refrão** — parte de transição/subida entre verso e refrão. "Olha o pré refrão" [-rwOI1vXmRo]; confirmado como termo canônico em [zVoDm8UDtOw: "Pré-refrão"].
- **Refrão / coro / chorus / couro** — parte principal cantada. Numerado explicitamente: "Refrão 1" [zVoDm8UDtOw]; "Coro" como cue solto [lRKvJdJAo0c, LIRQV-Ss4bY]. Nota: "couro"/"pouro"/"ouro" nas transcripts são homofonias de "coro".
- **Ponte / bridge** — parte contrastante. Também numerada: "Ponte 1", "Ponte 2" [lRKvJdJAo0c, cHIkbDV-1SA, zVoDm8UDtOw]. "Vamos pegar da ponte de novo, completa" [zVoDm8UDtOw].
- **Instrumental** — trecho sem letra. "puxar só instrumental primeiro" [aByWMGp3H7U]; "Vai rolar aquele instrumental grande" [_TxvDMLuUbM]; "Instrumental Mi Bemol" (com tom explícito) [cHIkbDV-1SA]; "Instrumental!" [b6CrWRVm4ZI].
- **Interlúdio** — trecho instrumental entre partes [aByWMGp3H7U, yGZT7-U2R2I, psnEAxBXpBg, zVoDm8UDtOw]. Uso confirmado como termo canônico da série sftbot.
- **Tag** — repetição curta de uma linha do refrão como fecho. "Olha a tag" [-rwOI1vXmRo]; "Segue na tag, Segue na tag" [lRKvJdJAo0c]; "Solta a tag" [zVoDm8UDtOw]; "Três tags, vem!" [6JHSPQw4ghc] — repetições de tag são contadas.
- **Solo** — trecho instrumental de destaque. "Solo do Anderson aqui" [fN5xGT4jex0]; "o próximo solo é da menina" [fN5xGT4jex0].
- **Final** — indicado explicitamente. "verso... refrão... final" [-xALGfXl1Co]; "Atenção para o final, a pausa é de novo, o ataque é final" [zVoDm8UDtOw]; "Final" [1uDClAEWoF0].
- **[NOVO] Ending / Outro** — Lucas Bertolozo usa como sinônimo estrutural distinto de "final". Nomes anglófilos aparecem juntos: "Intro / Outro / Ending" [zVoDm8UDtOw]. Inferência: `outro` = coda breve; `ending` = seção de fechamento com estrutura própria (ataque final + pausa).
- **[NOVO] Turnaround** — trecho de retorno/gancho antes de repetir a estrutura. "Turnaround" listado ao lado de "Verso / Pré-refrão / Refrão" [zVoDm8UDtOw]. Termo raro nas transcripts brasileiras — só aparece no Lucas Bertolozo.
- **Espontâneo** — ministração improvisada em cima de base. "estendeu a música num espontâneo, deixa só o clique pro Batera não se perder" [aYxH5IgqEUQ]. Confirmado como seção nomeável em ensaio: "É um espontâneo — vamos pegar da ponte de novo, completa" [zVoDm8UDtOw]; "Vamos jogar lá embaixo espírito bem" (=jogar pra dinâmica baixa para o espontâneo) [UqBFVYYilvo].

### Dinâmica

- **Grande pausa** — todo mundo para (ou fica só uma camada). "refrão grande pausa", "Ponte Grande pausa" [aByWMGp3H7U]; "Ponte, grande pausa" [zVoDm8UDtOw].
- **Suave** — dinâmica baixa. [aByWMGp3H7U, -xALGfXl1Co]; "coro suave" [LIRQV-Ss4bY]; "bom verso, suave hein" [fN5xGT4jex0]; "Coro suado" (=suave, alucinação leve) [fcaobJ7blr0].
- **Crescendo / cresce** — subir progressivamente. [aByWMGp3H7U]; "Refrão, cresce" [zVoDm8UDtOw].
- **Vai cair / cair** — descida brusca de dinâmica. "vai cair" [-rwOI1vXmRo].
- **[NOVO] Lá embaixo / jogar lá embaixo** — cue de queda de dinâmica muito recorrente na série sftbot. "Vamos jogar lá embaixo agora" [psnEAxBXpBg]; "Vamos jogar lá embaixo espírito bem, vem, lá embaixo, lá embaixo" [UqBFVYYilvo]; "Vou lá embaixo. Preparado?" [cHIkbDV-1SA]; "da glória lá embaixo" [_TxvDMLuUbM]; "a gente vai jogar pra baixo ela" [UqBFVYYilvo]. Inferência: sinônimo coloquial de "cair" — o DM sinaliza que a próxima seção fica em dinâmica baixa. **Mais frequente que "cair" no corpus novo**.
- **[NOVO] Lá em cima** — subir dinâmica. "Grande festa, bora, bora lá em cima" [uXYnEZkvFZY].
- **[NOVO] Não vai estourar / vai estourar não** — evitar estouro dinâmico. "vai estourar não" [UqBFVYYilvo]. Cue de teto.
- **Não deixa morrer** — manter energia, não deixar a música se apagar [-rwOI1vXmRo].
- **[NOVO] Suspende o chão / fica só o prato / harmonia vai tirando a mão** — cue detalhado de esvaziamento por camadas. "Suspendo o chão / aí a harmonia vai tirando a mão / fica só o prato" [zVoDm8UDtOw]. É o "grande pausa" descrito por camadas: bateria cai (sobra só o prato), harmonia sai. Vocabulário mais fino que "grande pausa".
- **[NOVO] Tira o groove / sai o groove** — parar a levada, tirando bateria/base rítmica. "Tira o groove, tira o groove, tira o groove" [UqBFVYYilvo]; "Sai o Groove, sai o Groove" [fcaobJ7blr0].
- **[NOVO] Render / render um pouquinho mais** — estender a seção atual. "Nós vamos render um pouquinho mais, tá bom?" [cHIkbDV-1SA].
- **[NOVO] Groove pleno** — dinâmica cheia com levada firme. "Groove Pleno" [yGZT7-U2R2I]; "Pleno, bora!" [6JHSPQw4ghc]. Contraparte "cheia" do "suave".
- **[NOVO] Grande festa** — cue de energia máxima. "Grande festa, bora, bora lá em cima" [uXYnEZkvFZY].
- **[NOVO] Energia** (como verbo/cue) — "Mais energia, vem!" [6JHSPQw4ghc]; "Energia de ponte, hein?" [6JHSPQw4ghc]; "Vamos dar energia" [LIRQV-Ss4bY]; "Energia nesse vinho!" [fN5xGT4jex0]. Uso onipresente na série sftbot como sinônimo de "subir a intensidade agora".
- **Todo mundo alto / construindo** — subida coletiva [aByWMGp3H7U].
- **Vem, banda** — comando pra banda entrar/subir [-xALGfXl1Co]. Confirmado: "Vem embora" [YGj4CFMg7KA]; "vem" isolado em quase todos os episódios da série sftbot.
- **Ambiência / ambientação** — colchão sonoro [aByWMGp3H7U, -xALGfXl1Co].
- **[NOVO] Respira** — cue de pausa breve/relaxamento antes de próxima seção. "Respira, groove, bora" [6JHSPQw4ghc]; "Respira" [lRKvJdJAo0c].
- **[NOVO] Pausa (do ataque) / ataque final** — pausa que precede um ataque explícito. "Atenção para a pausa do ataque" [zVoDm8UDtOw]; "Atenção para o final, a pausa é de novo, o ataque é final" [zVoDm8UDtOw]; "Pausa em dó" (tom explícito) [b6CrWRVm4ZI].

### Elementos técnicos

- **Mapa (da música / de ensaio)** — o esquema estrutural. [-xALGfXl1Co, PRt1IWfpk1s].
- **Clique** — click track. [aYxH5IgqEUQ, BQgKcap4LaI, zVoDm8UDtOw: "Clique / Junto?"].
- **VS / v / multitracks** — VST/tracks. [-xALGfXl1Co]. Confirmado nos novos vídeos com troubleshooting em tempo real: "Henrique, eu acho que o loop 3 e 4 está vindo junto com a bateria também" — depois "Achei, tá vindo no teclado" [YGj4CFMg7KA]. Sinaliza que loops multitrack são numerados e podem "vazar" no monitor errado.
- **Guia** — click com contagem verbal [-xALGfXl1Co].
- **Voz de Deus** — canal do DM que vai só ao retorno dos músicos [PRt1IWfpk1s].
- **Tom / tonalidade** — [BQgKcap4LaI]. Confirmado com uso muito comum de tom relativo/cifrado no ao vivo: "Todo mundo segura em Mi" [fN5xGT4jex0]; "Muita de poder, si bemol" (=Vento de Poder, tom de Sib) [fcaobJ7blr0]; "Vai desacelerando, sol menor" [fcaobJ7blr0]; "Pausa em dó" [b6CrWRVm4ZI]; "Instrumental Mi Bemol" [cHIkbDV-1SA]; "Lembrando, depois da virada, sol, certeza" [1uDClAEWoF0] — DM lembra o tom em que a próxima seção cairá após virada.
- **BPM / andamento** — [BQgKcap4LaI].
- **[NOVO] Compasso citado como identificador** — "Vencedor seis por oito" (nome da música + fórmula de compasso 6/8 como lembrete) [lRKvJdJAo0c]. "conta dois compassos" [uXYnEZkvFZY].
- **[NOVO] Vai desacelerando / se acelera** (rall / accel em vocabulário coloquial) — "Vai desacelerando, sol menor, se acelera" [fcaobJ7blr0]. "Não, se acelera não, na pegada" — DM corrige a si mesmo. Confirma que mudanças de andamento também são chamadas em tempo real.
- **Modular / subir o tom** — [aByWMGp3H7U].
- **[NOVO] Mudar a harmonia (para a harmonia da ponte)** — cue de troca harmônica no meio da música. "Acho que a gente pode fazer a ponte, né? / Nós vamos mudar a harmonia para a harmonia da ponte" [fcaobJ7blr0].
- **[NOVO] Grau harmônico (sexto grau)** — cue harmônico usando graus. "Ponte o sexto grau" [b6CrWRVm4ZI]. Sinaliza que a ponte é construída no VI grau da tonalidade — vocabulário mais teórico do que aparece na série sftbot em geral.
- **Virada** — drum fill [aByWMGp3H7U].
- **Groove / grove** — levada [aByWMGp3H7U, yGZT7-U2R2I, fcaobJ7blr0, UqBFVYYilvo, 6JHSPQw4ghc].
- **Inversões** — inversões de acorde [aByWMGp3H7U].
- **Dobrar (as cordas)** — reforçar linha [aByWMGp3H7U].
- **Chapar (acordes)** — tocar acorde longo sem ritmo [niOASEvnrQg].
- **Furar a Mix** — presença suficiente pra guitarra aparecer [rJyB_y8wsAQ].
- **Naipe** — família de instrumentos [aYxH5IgqEUQ].
- **[NOVO] Emenda direta entre músicas** — "próxima música vai entrar no coro, aí dá a glória direto" [fN5xGT4jex0]; "Vento de Poder, direto, direto, Vento de Poder, pode cantar bem" [fcaobJ7blr0]. Cue explícito de que a próxima música entra sem intro, no refrão da atual.

### Papéis

- **DM / diretor musical / diretor de banda** — indistintamente usados.
- **Líder de louvor / dirigente / ministro de louvor** — condutor espiritual [IFZ_R8-NjXY].
- **Colíder** — como Emily descreve o DM [BQgKcap4LaI].
- **[NOVO] Solista nominal** — cues chamam o cantor pelo nome antes da parte: "Verso Patrícia, tá?" [_TxvDMLuUbM]; "Solo do Anderson" [fN5xGT4jex0]; "próximo solo é da menina" [fN5xGT4jex0]; "Pessoal, Henrique" [6JHSPQw4ghc]. Sugere que a atribuição *quem canta cada parte* é decidida por música e chamada em tempo real.

---

## Cues ao vivo — o vocabulário em uso (NOVO)

Subseção nova. Os 15 micro-clipes da série numerada sftbot são valiosos justamente por **não** serem aulas: mostram o que um DM efetivamente **fala** durante o ensaio/culto. Isso é o vocabulário fonte para uma UX de anotações inline.

### Padrão dominante: chamar seção + contar entrada

O template mais recorrente é `{nome da seção}` + `{contagem}` + `{quem entra ou dinâmica}`:

- "Um, dois, três, ponte." [fcaobJ7blr0]
- "Um, dois, três, guitarra" [uXYnEZkvFZY]
- "Verso / 1, 2, 3" [LIRQV-Ss4bY]
- "Atenção, vamos aqui pro verso, parou agora, parou, bom verso, suave hein" [fN5xGT4jex0]
- "Refrão / Um, dois, três, quatro" [zVoDm8UDtOw]

Aparece em **todos** os 16 novos vídeos. Contagens variam entre "1 2 3", "1 2 3 4", "2 3 4", "dois compassos", "3 2 4 3".

### Cues de dinâmica são metáforas espaciais/emocionais, não notação

Em vez de `pp` / `mf` / `ff`, os DMs dizem:
- **Espaciais**: "lá embaixo" / "lá em cima" / "joga pra baixo" [psnEAxBXpBg, UqBFVYYilvo, cHIkbDV-1SA, uXYnEZkvFZY].
- **Fenomenológicas**: "suspende o chão", "fica só o prato" [zVoDm8UDtOw]; "tira o groove" [fcaobJ7blr0]; "grande festa" [uXYnEZkvFZY]; "energia de ponte" [6JHSPQw4ghc].
- **Ação**: "respira" [6JHSPQw4ghc, lRKvJdJAo0c]; "não vai estourar" [UqBFVYYilvo].

Isso confirma o achado da v1 (rejeitar notação clássica no data model) e **reforça**: o campo deveria aceitar frases coloquiais como valor primário; enums são só atalhos.

### Cues condicionais / handoff com o pastor

Muito comum na série sftbot — o DM prepara a banda para reagir ao pastor:

- "O pastor pode subir no meio dessa música, a gente vai jogar pra baixo ela / Ela vai continuar no disco, tá?" [UqBFVYYilvo]
- "Vamos jogar para a igreja, o pastor vai estar subindo aqui, pastor na área, abaixo, vem" [yGZT7-U2R2I]
- "Pastor chegar na área! Pode ir, Pastor!" [fcaobJ7blr0]
- "Quem é o pastor de agora? / Me dá um sinal que ninguém tá olhando pra mim / No final desse coro agora, pode aproximar" [_TxvDMLuUbM]
- "Vou encerrar essa música" [_TxvDMLuUbM]
- "tempo desse pastor não é muito musical não, não é parada aqui" (aside crítico do DM) [fcaobJ7blr0]

Isso é uma classe de cue **inexistente** no data model atual: a música tem "planos condicionais" (se X, então Y). Difícil formalizar, mas pode virar campo `observacoes_liturgia` no mapa.

### Cues de "solta a igreja"

Correlato litúrgico: o DM sinaliza quando a música deixa de ser da banda e passa a ser da congregação.

- "Joga pra igreja, tá?" [_TxvDMLuUbM]
- "Vamos jogar para a igreja" [yGZT7-U2R2I]
- "Pode vibrar com a igreja" [_TxvDMLuUbM]

### Cues de saída explícitos

Novidade importante: existe cue de **saída** de instrumento, não só de entrada.

- "Tchau, guitarra" [fcaobJ7blr0]
- "Sai o groove" [fcaobJ7blr0]
- "Tchau, tchau, tchau" (contexto de finalização) [UqBFVYYilvo, psnEAxBXpBg]

Reforça a proposta de campo `sai` no mapa (não só `entra`).

### Cues de repetição em tempo real

Muito frequente. Sugere que setlist precisa suportar overrides fáceis.

- "Mais uma", "Mais duas" (repetições anunciadas) [yGZT7-U2R2I, YGj4CFMg7KA, 6JHSPQw4ghc, b6CrWRVm4ZI]
- "Confia em mim, faz mais uma" [b6CrWRVm4ZI]
- "Três tags, vem! / A última" [6JHSPQw4ghc]
- "Vou repetir" [fN5xGT4jex0]
- "Vou ficar repetindo o interlúdio" [psnEAxBXpBg] — cue de loop aberto até novo aviso
- "Vamos pegar da ponte de novo, completa" [zVoDm8UDtOw]

### Cues de troubleshooting durante o ensaio

Também surgem — parte do trabalho do DM é debug técnico:

- "Henrique, eu acho que o loop 3 e 4 está vindo junto com a bateria também, dá uma conferida quando você puder / Achei, tá vindo no teclado / O 3 e 4 tá vindo no teclado" [YGj4CFMg7KA]
- "Baixei aqui, o Santo Mestre está muito alto, não se botou aqui" [psnEAxBXpBg]
- "Melhorou, Brenda? / Como que tá aí? / Aguda, né? / Faz um pouquinho mais pra cima" [zVoDm8UDtOw]
- "Ou travou a letra ou está na letra errada" [6JHSPQw4ghc]

### Cues de correção pontual

- "Muita nota" (guitarrista tocando demais) [ft8ROCQNNsQ]
- "Pegadinha, Osvaldo" (aviso de mudança inesperada) [6JHSPQw4ghc]
- "não achei a palavra, desculpa" — auto-correção do DM [fcaobJ7blr0]

### Cobertura fraca — só cues úteis

Marcados como baixa densidade: **1uDClAEWoF0 (3º Ep)** e **ft8ROCQNNsQ (2º Ep)** — poucas linhas úteis por transcript, mas ainda contribuem cues genuínos ("depois da virada, sol"; "muita nota"; posicionamento de palco).

---

## Frameworks e modelos

### Felipe (sftbot) — "4 passos para inserir a direção musical" [JbKbXInz9ho]

1. **Trazer soluções, não problemas.**
2. **Caminhar com seu time.** Levantar pessoa com perfil de DM.
3. **Processo lento — mudança de cultura.** "Vai demorar. A gente ficou um ano só experimentando."
4. (Comercial — comprar o curso dele.)

### Felipe + Emily (sftbot) — Ciclo de decisão de repertório [BQgKcap4LaI]

- **Fase antiga:** DM + líder de louvor decidiam via WhatsApp, música por música.
- **Fase atual:** todos os líderes + DM geral se reúnem 1×/mês e definem o **mês inteiro**. Música-âncora se repete várias semanas.
- Depois: DM da semana + líder afinam por WhatsApp (mapa, repetições, momentos de fala).
- Reuniões: quinzenais, 1h–1h30. Alternam burocracia (repertório/escala) e crescimento (livro juntos, feedback).

### Emily — Composição da escala [BQgKcap4LaI]

- Recusa "banda fechada".
- Regra: mesclar músicos experientes com intermediários e iniciantes.
- Efeito: discipulado natural.

### Edson Doriguete (sftbot) — Atribuições do DM [PRt1IWfpk1s]

1. Organizar o ensaio.
2. Transportar o estúdio para o ao vivo.
3. Cuidar dos arranjos e questões técnicas.
4. Fazer (ou delegar) o mapa de ensaio.

Também define o "microfone voz de Deus".

### Bill (GuitarChurch) — Fluxo semanal [-xALGfXl1Co]

- Semana: ouvir passivamente.
- Sábado: sentar, tirar detalhes, editar VS.
- Domingo: montagem + passagem de som (SÓ som) → passagem de liturgia → culto.

### Bill — Guia p/ audição de louvor [YGWKaXwi2kQ]

1. Mindset. 2. Preparo com antecedência. 3. Setup essencial. 4. Responsabilidade + espiritualidade. 5. Tocar SÓ o que a música pede. 6. Comprometimento.

### Sobre a série numerada sftbot — **não é um framework sequenciado**

Análise: os 16 episódios "Nº Episódio — DIREÇÃO MUSICAL NA IGREJA!" **não** são capítulos progressivos de uma aula. São micro-clipes de bastidores/ensaio, cada um mostrando um cue diferente. A numeração é editorial (série de vinhetas), não didática. O valor deles é observacional — vocabulário em uso — não framework.

Assim, a v2 **não acrescenta framework teórico novo**. Os quatro frameworks (Felipe/Emily/Edson/Bill) continuam sendo os pilares.

---

## Cruzamento: cues ao vivo × frameworks teóricos

Onde os novos cues **confirmam** os frameworks:

- **Edson [PRt1IWfpk1s]** disse que o mapa deve conter "entrada ou saída de instrumento". Os novos vídeos confirmam com cues explícitos: "Tchau, guitarra" [fcaobJ7blr0], "Bebizinho, batera, entra" [lRKvJdJAo0c], "Entra a bateria" [zVoDm8UDtOw]. **Saída** é tão comum quanto **entrada** — a v1 tinha sub-representado o cue de saída.
- **Bill [-xALGfXl1Co]** descreveu a "corda bamba" da oração pastoral (manter clima enquanto pastor fala). Os cues condicionais da série sftbot ("O pastor pode subir no meio dessa música, a gente vai jogar pra baixo ela" [UqBFVYYilvo], "Vou encerrar essa música / Me dá um sinal" [_TxvDMLuUbM]) **confirmam e detalham** esse padrão como uma classe de cue distinta.
- **Emily [BQgKcap4LaI]** falou de repetições contadas por ocasião ("esse couro em vez de 2x eu quero 4x"). Confirmado em campo: "Três tags, vem! / A última" [6JHSPQw4ghc]; "Mais duas pontes dessa" [YGj4CFMg7KA]; "Vou ficar repetindo o interlúdio" [psnEAxBXpBg].
- **Ensaio Lucas #10 [aByWMGp3H7U]** já mostrava contagem antes de cada seção. **Ensaio Lucas #14 [zVoDm8UDtOw]** reforça e sistematiza — as seções são explicitamente numeradas (Verso 1, Verso 2, Refrão 1, Ponte 1) e o vocabulário de dinâmica cresce em precisão ("suspende o chão / fica só o prato / harmonia tirando a mão").

Onde os novos cues **contradizem ou refinam**:

- A v1 propôs enum de dinâmica com `suave / medio / forte / grande_pausa / crescendo / cair`. Os novos vídeos mostram que **na prática** os DMs usam vocabulário coloquial muito mais rico ("lá embaixo", "grande festa", "energia de ponte", "groove pleno", "suspende o chão", "tira o groove"). Enum estrito seria estreito demais. **Revisão:** manter enum como sugestão de atalho, mas o campo primário deveria ser texto livre com autocomplete alimentado por um léxico observado.
- A v1 tratava "notação musical formal" (pp/mf/ff) como gap. Continua sendo gap — os novos vídeos **não** trazem nenhuma notação formal. Ao contrário, reforçam a inutilidade dela para este contexto.

---

## Papel: Líder de Louvor vs Diretor Musical

(Sem mudanças estruturais na v2 — as fontes novas são cues ao vivo, não conteúdo teórico sobre papéis.)

Vários vídeos exploram essa distinção. Convergências:

**Líder de louvor** (ou "dirigente"):
- Escolhe as músicas [BQgKcap4LaI].
- Define a **mensagem/tema** do set [BQgKcap4LaI].
- Ministra à igreja.
- Toma decisões espontâneas durante o culto.

**Diretor musical**:
- Traduz a mensagem/visão do líder em decisões musicais.
- Faz o mapa da música.
- Organiza ensaio e execução.
- Segue o líder durante o culto.
- Faz "equilíbrio de realidade": se líder quer arranjo que o time não dá conta, sugere simplificar [BQgKcap4LaI].
- Bill descreve a "corda bamba" da oração pastoral [-xALGfXl1Co].

**Refino v2** — a série sftbot mostra que na hora H o DM também:
- Chama solistas pelo nome ("Verso Patrícia", "Solo do Anderson") [_TxvDMLuUbM, fN5xGT4jex0]
- Sinaliza handoff pro pastor ("Pastor chegar na área! Pode ir, Pastor!") [fcaobJ7blr0]
- Faz troubleshooting técnico ao vivo (multitracks vazando, monitor de vocalista) [YGj4CFMg7KA, zVoDm8UDtOw]

**Insight-chave (Emily) — não é hierarquia, é serviço mútuo:**
> "O DM é submisso ao líder, não é ele que manda em tudo. Fica todo mundo servindo um ao outro." [BQgKcap4LaI]

**Contraponto de nomenclatura (Ana Paula Valadão) [IFZ_R8-NjXY]**: música na igreja é **diaconia**, não ministério. Vale registrar como divergência de vocabulário.

---

## Guidance por instrumento

### Teclado (Lucas Bertolozo — niOASEvnrQg)

1. Pedal de sustain: tirar e pisar novamente ao trocar de acorde.
2. Região do teclado: ficar nos médios.
3. Rítmica: se violão faz o ritmo, teclado chapa acordes.

Emily [BQgKcap4LaI]: liderar de teclado a limitava.

### Guitarra (GuitarChurch — rJyB_y8wsAQ, YGWKaXwi2kQ, -xALGfXl1Co, aYxH5IgqEUQ)

- Ouvir as linhas da gravação e reproduzir.
- Timbre por seção (5 posições na Divton).
- Não brigar com violão.
- Setup simples para audição.

**Refino v2 — feedback ao vivo pra guitarrista:**
- "Muita nota" [ft8ROCQNNsQ] — o cue mais direto: o guitarrista está tocando demais.
- "Tchau, guitarra" [fcaobJ7blr0] — cue de saída explícita da guitarra (comum em seções de dinâmica baixa).
- "Um, dois, três, guitarra" [uXYnEZkvFZY] — cue de entrada com contagem específica pra guitarra.

### Baixo

Nenhuma menção específica adicional nos novos vídeos. Confirma que baixo aparece pouco no vocabulário de cue ao vivo — provavelmente por ser instrumento "base" pouco chamado.

### Bateria

Original: viradas [aByWMGp3H7U], chimbal fechado vs. aberto, bumbo quatro-quatro, clique.

**Refino v2:**
- Cues de camada específicos: "Suspende o chão / fica só o prato" [zVoDm8UDtOw] — bateria tira tudo menos o prato de condução.
- Entrada explícita: "Entra a bateria" (em várias posições numeradas) [zVoDm8UDtOw]; "Bebizinho, batera, entra" [lRKvJdJAo0c] — inferência: "bebizinho" = bumbo pequeno / inglês (kick).
- Saída de levada: "Tira o groove" / "Sai o groove" [UqBFVYYilvo, fcaobJ7blr0].

### Vocal

Original: Emily prefere liderar solto; Bill fala em não deixar morrer; preparo de voz.

**Refino v2:**
- Cue de vocalista errado: "Ou travou a letra ou está na letra errada" [6JHSPQw4ghc].
- Confirmação de "gang vocal" (=todos os backings em uníssono) [_TxvDMLuUbM].
- Solistas nominais atribuídos por seção: "Verso Patrícia" [_TxvDMLuUbM]; "Solo do Anderson" [fN5xGT4jex0].

### Backing vocal

Ainda pouca menção. "Gang vocal" [_TxvDMLuUbM] é o único termo novo (usado para backing em bloco).

---

## Fluxo de trabalho (setlist → ensaio → culto)

### Visão sftbot (Felipe + Emily) — processo e discipulado

```
Reunião mensal de líderes → repertório do mês → DM geral distribui → DM semanal + líder ajustam no WhatsApp → Ensaio → Culto → Feedback
Reunião quinzenal do time inteiro (alternando burocracia e crescimento)
```

### Visão GuitarChurch (Bill) — dia a dia

```
Semana: ouvir passivamente
Sábado: tirar detalhes, editar VS
Domingo: montagem + passagem de som (só som) → passagem de liturgia → culto
```

### Visão Lucas Bertolozo — o ensaio em si

Dois vídeos agora: #10 [aByWMGp3H7U] e #14 [zVoDm8UDtOw]. Detalhes na próxima seção.

### Visão série sftbot ao vivo — o cue em si

Novidade v2: os micro-clipes mostram que a atividade **em tempo real** do DM tem 5 categorias:

1. Chamar seção + contar entrada.
2. Ajustar dinâmica (quase sempre em vocabulário espacial "lá embaixo/lá em cima").
3. Chamar instrumentos (entrar / sair) e solistas nominais.
4. Reagir ao pastor (handoff / preparar espontâneo / "jogar pra igreja").
5. Troubleshoot técnico (monitor, multitracks, letra).

---

## Observações do ensaio Lucas Bertolozo #14 [zVoDm8UDtOw] vs #10 [aByWMGp3H7U]

Ambos são ensaios completos, mesmo canal, mesmo DM. Comparando:

| Dimensão | #10 (aByWMGp3H7U) | #14 (zVoDm8UDtOw) |
|---|---|---|
| Duração transcript | ~30 min de ensaio | ~46 min (inclui setup + monitoração) |
| Vocabulário de seção | verso / pré-refrão / refrão / ponte / instrumental / tag | + `turnaround`, `outro`, `ending`, seções **numeradas** (Verso 1, Refrão 1, Ponte 1) |
| Vocabulário de dinâmica | "grande pausa", "cresce", "chimbal fechadinho" | + "suspende o chão / fica só o prato / harmonia tirando a mão" — mais fino, por camada |
| Chamadas ao instrumentista | "Henrique dubla as cordas", "Davi bumbo quo" (nominais) | "Entra a bateria" (posicional) + monitor: "Melhorou, Brenda? / Faz um pouquinho mais pra cima" |
| Foco | Arranjo (dobras, inversões, viradas) | Estrutura + pausas ("pausa do ataque", "ataque final") + setup técnico inicial |
| Cue de espontâneo | Comentário geral | Explícito: "Ah, é um espontâneo / Vamos pegar da ponte de novo, completa" |
| Multitracks | Não aparece | Diálogo inicial de conexão: "Tudo conectado certinho? / Chegou não / Fecha o violão que eu vou plugar" |

**Conclusão comparativa:** #14 amplia o vocabulário estrutural (Turnaround, Ending, seções numeradas) e o de dinâmica por camada. #10 é mais rico em direção *instrumental* (o que cada músico faz). Os dois **complementam** um ao outro em vez de contradizer.

Para o data model: a numeração de seções (Verso 1 vs Verso 2) do #14 sugere que **múltiplas instâncias da mesma seção precisam ser distinguíveis** — não basta um único "verso" no enum, o mapa da música precisa suportar `verso_1`, `verso_2`, `refrao_1`, `refrao_2` ou algo equivalente.

---

## Problemas comuns citados

(Sem mudanças na v2 — a série sftbot não traz problemas novos, só mostra o vocabulário em cima dos problemas já mapeados.)

- **Ninguém tira as músicas com antecedência** [JbKbXInz9ho, YGWKaXwi2kQ, aYxH5IgqEUQ].
- **Ensaio vira reunião de dúvidas técnicas** [JbKbXInz9ho, -xALGfXl1Co].
- **"Cada um vai pra um lado no espontâneo"** [BQgKcap4LaI, PRt1IWfpk1s].
- **Excesso de música nova, igreja não decora** [BQgKcap4LaI].
- **Panelinha entre times** [BQgKcap4LaI].
- **Excesso de "criatividade"** [rJyB_y8wsAQ, YGWKaXwi2kQ, aYxH5IgqEUQ, ft8ROCQNNsQ: "muita nota"].
- **Direção musical vista como "engessa o Espírito Santo"** [-xALGfXl1Co, aYxH5IgqEUQ].
- **Falta de conhecimento sobre o papel de DM** [PRt1IWfpk1s].

Refino v2: adiciono como problema observado nos novos vídeos:
- **Multitracks vazando no canal errado durante o ensaio** — corrigido em tempo real [YGj4CFMg7KA]. Sugere valor em documentar routing de tracks no data model.
- **Monitor mal ajustado** — DM chama vocalistas por nome no ensaio pra ajustar [zVoDm8UDtOw]. Não é problema de repertório, mas informa a UX do "modo palco" (idealmente cada músico tem sua view).

---

## Ferramentas mencionadas

Sem novas ferramentas nomeadas na v2 (a série sftbot mostra as ferramentas em uso, não fala delas).

- **VST / multitracks / VS** [-xALGfXl1Co]. Confirmado como comum: "loop 3 e 4" [YGj4CFMg7KA].
- **Clique / click track** — universal.
- **Metrônomo** [YGWKaXwi2kQ].
- **Guitarra Divton (M Studio da Ziron)** [-xALGfXl1Co].
- **Preset de guitarra (GP2)** [aYxH5IgqEUQ].

Nenhuma menção específica a Planning Center, Ableton Live como setlist manager, OnSong, MultiTracks.com, Loop Community.

---

## Sugestões concretas de features / data model

Baseado no material completo (v1 + v2). Mudanças da v2 marcadas com **[v2]**.

### Campos do data model — esquema

**A. Metadados da música**

- `tom` (canônico da equipe) — universal
- `bpm` — [YGWKaXwi2kQ, BQgKcap4LaI]
- `compasso` (4/4, 6/8) — [BQgKcap4LaI, lRKvJdJAo0c: "Vencedor seis por oito"]
- `duracao_estimada` — [KfY2Tc4c8jg]

**B. Mapa da música (song-level)** — o "mapa" citado por Edson [PRt1IWfpk1s] e Bill [-xALGfXl1Co]:

- Sequência de **seções** enumeradas com nome canônico:
  - `intro`, `verso`, `pre_refrao`, `refrao`, `ponte`, `instrumental`, `interludio`, `tag`, `solo`, `final`
  - **[v2] Acrescentar:** `turnaround`, `outro`, `ending`, `espontaneo` — vistos em [zVoDm8UDtOw, UqBFVYYilvo].
  - **[v2] Suportar numeração** (`verso_1`, `verso_2`, `ponte_1`, `ponte_2`, `refrao_1`) — [zVoDm8UDtOw, lRKvJdJAo0c: "Ponte 1 / Ponte 2"; cHIkbDV-1SA]. Múltiplas instâncias da mesma seção precisam ser identificáveis individualmente.
- Cada seção tem:
  - `dinamica`: **[v2 revisado]** texto livre com autocomplete a partir de léxico observado (`suave`, `grande_pausa`, `crescendo`, `cair`, `la_embaixo`, `la_em_cima`, `groove_pleno`, `grande_festa`, `energia`, `suspende`, `tira_o_groove`, `respira`, `nao_deixa_morrer`). Enum estrito seria estreito demais.
  - `entra`: lista de instrumentos que entram — [PRt1IWfpk1s, zVoDm8UDtOw: "Entra a bateria"]
  - **[v2] `sai`**: lista de instrumentos que saem — cue de saída é tão comum quanto o de entrada. "Tchau, guitarra" [fcaobJ7blr0], "Sai o groove" [fcaobJ7blr0].
  - **[v2] `contagem_entrada`**: string curta (ex.: `"1,2,3,4"`, `"2,3,4"`, `"1,2,3,vem"`, `"dois compassos"`) — cue universalmente presente antes da seção. Vira asset visual no modo palco.
  - **[v2] `tom_da_secao`** (opcional): se a seção muda de tom (comum em instrumentais/pausas), permitir override — "Instrumental Mi Bemol" [cHIkbDV-1SA]; "Pausa em dó" [b6CrWRVm4ZI]; "Lembrando, depois da virada, sol" [1uDClAEWoF0]; "Muita de poder, si bemol" [fcaobJ7blr0].
  - `observacoes`: texto livre.

**C. Direção por instrumento (namespaced)**

Confirmado. Namespaces:
- `bateria`, `baixo`, `teclado`, `guitarra`, `violao`, `vocal`, `backing_vocal`

**[v2] Extensão observada:** vocal_backing pode ter subcampo `gang_vocal` (uníssono em bloco) — [_TxvDMLuUbM].

**[v2] Solistas nominais** — surge campo natural `solista` por seção (quem canta o verso/solo). Emily já sinalizava; a série sftbot confirma: "Verso Patrícia" [_TxvDMLuUbM], "Solo do Anderson" [fN5xGT4jex0]. **Nova sugestão:** campo `solista` por seção do mapa, populado com nome do vocalista/solista.

**D. Notas contextuais de execução (setlist-level)** — já no ROADMAP:

- "Hoje sem bateria" / "modular na 3ª estrofe" / "pular ponte" — validado.
- **[v2] Repetições override**: contagem-alvo de tag/refrão/ponte por ocasião. "Três tags, vem! / A última" [6JHSPQw4ghc]; "Mais duas pontes dessa" [YGj4CFMg7KA]. Reforça o item "Notas de execução por setlist".
- **[v2] Loop aberto**: alguns cues sugerem repetição indefinida até novo aviso — "Vou ficar repetindo o interlúdio" [psnEAxBXpBg]. Marcador de "loop até sinal do DM" no mapa por ocasião.

**E. Direção do arco do set**

- `mensagem_do_set` — Emily [BQgKcap4LaI].
- `momento_de_fala` — Emily.
- **[v2] `handoff_pastor`**: marca no setlist onde/como a música cede espaço pro pastor. Ex.: "O pastor pode subir no meio dessa música, a gente vai jogar pra baixo ela" [UqBFVYYilvo]; "Pastor chegar na área!" [fcaobJ7blr0]. Pode ser um flag por seção do mapa ou anotação no setlist.
- **[v2] `emenda_para_proxima`**: campo no setlist indicando emenda direta com a próxima música. "próxima música vai entrar no coro, aí dá a glória direto" [fN5xGT4jex0]; "Vento de Poder, direto, direto" [fcaobJ7blr0]. Enum: `direto_no_coro`, `direto_na_intro`, `pausa_curta`, `oração_no_meio`.

### Vocabulário controlado vs. texto livre — **revisado**

| Dimensão | Recomendação v1 | Recomendação v2 |
|---|---|---|
| Nomes de seção | Enum | **Enum + numeração livre** (`verso_1`, `refrao_2`). Adicionar `turnaround`, `outro`, `ending`. |
| Dinâmica | Enum + texto | **Texto livre com autocomplete** (léxico observado). Enum estrito seria estreito para o vocabulário coloquial dominante. |
| Instrumento | Enum | Enum — inalterado. |
| Papel/tipo de ação (entra/sai/dobra/chapa) | Enum | Enum — inalterado. **Adicionar `sai` explicitamente** (v1 tratava só `entra`). |
| Descrição musical fina | Texto livre | Inalterado. |
| Timbre/preset de guitarra | Texto livre + referência | Inalterado. |
| **[v2] Contagem de entrada** | (não previsto) | **Texto livre curto** com autocomplete (`1,2,3,4`, `2,3,4,vem`, `dois compassos`). |
| **[v2] Solista** | (não previsto) | Referência ao vocalista da equipe (opcional por seção). |

### Granularidade recomendada

Convergência forte, ampliada: **por seção** é o certo.
- Todos os cues do ensaio Lucas #10, Lucas #14 e da série sftbot são por seção.
- Sub-granularidade só útil em casos específicos, resolvíveis com texto livre.
- **[v2]** A numeração de seções (Verso 1, Verso 2, Ponte 1, Ponte 2) sugere que a "seção" é a unidade certa **mas** precisa de identidade — não basta enum com um valor por tipo.

Rejeito **por compasso**.

### UX

- **Toggle "esconder direções"** — validado.
- **View filtrada por naipe** — validado.
- **View "diretor musical"** — mostra mapa da música destacado. Reforçado pela série sftbot: o DM opera mentalmente no mapa, não na cifra.
- **View "líder de louvor"** — foca em letra + mensagem + notas de fala.
- **Contagem de entrada visual** — **[v2] Fortemente reforçado**. Aparece em virtualmente todos os novos vídeos. Sugestão concreta: mostrar `contagem_entrada` como badge grande antes da próxima seção.
- **Marcador de repetição customizável no setlist** — validado. Emily; "Três tags, vem!" [6JHSPQw4ghc].
- **[v2] View "monitor/handoff pastor"** — pequeno indicador visual no setlist quando a música tem cue condicional de pastor. Ex.: ícone de microfone amarelo quando "handoff_pastor" está setado, com nota expandível ("se subir, jogar pra baixo, continuar tocando").
- **[v2] Autocomplete em campo de dinâmica** — puxar do léxico observado (33 termos únicos catalogados na v2). Reduz atrito na entrada e padroniza sem forçar enum.
- **[v2] Léxico de cues como paleta** — mostrar botões rápidos (`Suave`, `Lá embaixo`, `Grande festa`, `Tira o groove`, `Suspende`, `Cresce`, `Grande pausa`, `Respira`, `Não deixa morrer`) para popular observações de seção com um toque.

---

## Ideias extra (fora de "direção musical")

Sugestões que apareceram nas transcripts mas se encaixam em outras seções do ROADMAP:

- **Player de referência da versão canônica** — Bill [rJyB_y8wsAQ, YGWKaXwi2kQ] e Lucas [niOASEvnrQg].
- **Escala/agenda com mescla de níveis** — Emily [BQgKcap4LaI].
- **"Contador de repetições"** — Emily.
- **Notas de aprovação por música com decisão explícita** — Ana Paula [IFZ_R8-NjXY].
- **Timer/duração estimada por música e por setlist** — Marcio Mello [KfY2Tc4c8jg].
- **Preparo espiritual** — Ana Paula [43-ghwysFd0].
- **[v2] Documentação de routing de multitracks** — [YGj4CFMg7KA]: "loop 3 e 4 tá vindo no teclado". Pode virar seção "backing/tracks" no doc da música com routing por saída (loop 1 → click, loop 2 → guia, loop 3 → pad, loop 4 → sub-drums, etc.).
- **[v2] "Modo monitor" no ensaio** — vocalistas e DM precisam se comunicar sobre mix pessoal ("Melhorou, Brenda? / Aguda, né?" [zVoDm8UDtOw]). Não é feature de repertório — mas talvez um campo `notas_monitor` por músico/naipe.

---

## Gaps de cobertura

O que estes 30 vídeos NÃO cobrem e permanece em aberto:

- **Notação musical formal** (pp / mf / ff / ritardando etc.). Zero vídeo usa notação clássica; todos usam vocabulário coloquial ("suave", "lá embaixo", "grande pausa", "suspende o chão"). **Reforçado na v2:** os 16 novos vídeos também são 100% coloquiais. Confirma que o projeto **não** deve exigir notação clássica.
- **Multi-instrumento em notação simultânea** (partitura de banda).
- **Como versionar o mapa** quando o arranjo evolui.
- **Backing tracks / stems** — mencionado casualmente (Bill edita VS; "loop 3 e 4" [YGj4CFMg7KA]), mas nenhum vídeo explica como as igrejas menores lidam com isso.
- **Modo compacto para "banda enxuta"** — Edson [PRt1IWfpk1s] fala em "adaptar arranjo pro time disponível", mas nenhum vídeo detalha.
- **Integração com escala/agenda** — nenhum vídeo mostra ferramenta; todos os DMs parecem usar WhatsApp.
- **Convenção de "quem começa"** — mencionado ("teclado começa suave", "só voz e violão") mas nunca formalizado. Subcampo do mapa (seção `intro` com `entra: [teclado, voz]`).
- **[v2 — permanece aberto] Formalização dos cues condicionais litúrgicos** — "se pastor subir, cai a dinâmica" é padrão observado, mas nenhum vídeo formaliza como se documenta previamente. Fica como pergunta de design.
- **[v2 — permanece aberto] Comunicação síncrona no palco** — os cues ao vivo dependem de o DM **falar** com a banda. Se o produto oferecer "modo palco", ele não substitui essa fala — no máximo, o marcador visual antecipa parte dos cues.
