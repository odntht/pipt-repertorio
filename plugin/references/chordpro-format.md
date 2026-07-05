# Formato ChordPro no PIPT Repertório

Referência rápida do formato usado em `data/songs/*.pro`. Fonte da verdade: [docs/superpowers/specs/2026-07-05-pipt-repertorio-design.md §4](../../docs/superpowers/specs/2026-07-05-pipt-repertorio-design.md).

## Tags obrigatórias

- `{title: Nome da música}`
- `{key: G}` (ou `Bm`, `F#m`, `Bb`, etc.)
- `{section: congregacional}` (ou `hinario` / `infantil` / `inadequada`)
- `{status: aprovada}` (ou `em-revisao` / `arquivada`)

## Tags opcionais

- `{artist: Fernandinho}`
- `{tempo: 90}` (ou vazio como placeholder: `{tempo: }`)
- `{youtube: https://...}`
- `{tags: adoracao, cruz}`
- `{notes: começa em Em}`
- `{hinario_num: 061}` (só quando section=hinario)
- `{arrangement_of: outra-slug}` (marca rearranjo de outra música)
- `{arrangement: https://drive.google.com/... | Ensaio 12/06/25}` (repetível)
- `{added: 2026-07-05}` (auto-gerado)

## Corpo

```chordpro
{comment: Refrão}
[G]Uma linha [D]com acordes[Em7] intercalados
     [G]Whitespace antes é preservado
```

- Acordes entre `[...]` — usar regex canônico (ver `site/src/lib/cifra-parser/chord-regex.ts`)
- `{comment: X}` marca seção (INTRO, REFRÃO, PONTE...). Apenas Refrão/Introdução/Solo/Coro são exibidos visualmente; outros viram linhas em branco preservando espaçamento.
- Linhas em branco preservam espaçamento entre seções

## Filename

`{slug}.{qualifier?}.{tom-slugificado}.pro`

- Tom slugificado: `#` → `s`, minúsculo. `G` → `g`, `F#m` → `fsm`, `Bb` → `bb`.
- Qualifiers opcionais antes do tom: `arranjo-1`, `simples`, `grande-lucas`, `v2`.

Exemplos:
```
data/songs/nada-alem-do-sangue.g.pro
data/songs/nada-alem-do-sangue.a.pro
data/songs/em-espirito-em-verdade.arranjo-2.g.pro
data/songs/ainda-que-a-figueira.fernandinho.fsm.pro
```
