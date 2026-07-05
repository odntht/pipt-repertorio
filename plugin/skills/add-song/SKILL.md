---
name: add-song
description: Adiciona uma música ao repertório — recebe texto de cifra (arquivo, cola inline, ou URL de Cifra Club), parseia via o parser TS canônico, valida ChordPro, gera arquivo em data/songs/, faz commit. Útil quando você tem 1-5 cifras pra adicionar de uma vez sem passar pelo form do site.
---

# add-song — Adicionar música ao repertório

## Quando usar

- Você tem cifras num arquivo/email/WhatsApp e quer adicionar direto sem passar pelo form web
- Você quer adicionar múltiplas em batch
- Uma submissão do site caiu em `needs-fix` e você quer corrigir e commitar direto

## Fluxo

1. Perguntar ao usuário a fonte da cifra (arquivo local, cola inline, ou URL Cifra Club).
2. Se URL, buscar o HTML e extrair o corpo textual (regex + limpeza).
3. Rodar o parser TS canônico do repo pra converter em ChordPro:
   - Parser mora em `site/src/lib/cifra-parser/`
   - Regex canônico de acorde: `site/src/lib/cifra-parser/chord-regex.ts`
   - Regra de slugify de tom: `site/src/lib/chordpro/slugify-tom.ts`
4. Mostrar o `.pro` gerado pro usuário aprovar.
5. Salvar em `data/songs/{slug}.{tom}.pro` (ver spec §4.4 pra convenção).
6. Rodar `astro check` e `vitest run` pra garantir que nada quebrou.
7. Commit + push (se remoto existir).

## Regras

- **Não** sobrescrever arquivo existente sem confirmação dupla.
- Se detectar duplicata (mesmo slug+tom), oferecer sufixo (`.v2`, `.arranjo-2`, `.<artista>`).
- Sempre validar campos obrigatórios: `title`, `key`, `section`, `status`.
- Preservar whitespace de alinhamento em linhas cifra+letra (o parser lida com isso).

## Escopo no Plano A

Este comando fica documentado mas **não implementado** no Plano A. Suas regras servem de referência pro form paste-and-parse do site (Plano C) e pra migração (Plano B). Implementação plena virá no Plano B.
