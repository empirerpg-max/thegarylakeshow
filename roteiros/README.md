# Como pedir um roteiro novo

1. Rode a sincronização de dados antes (veja abaixo), para garantir que `dados/`
   está atualizado com o catálogo mais recente do jogo.
2. Me diga, numa mensagem: nome do convidado, nome do artista dele no jogo, e
   se você já sabe quais dois quadros quer usar (senão eu sugiro, mas a decisão
   final é sempre sua — a regra de ouro é no máximo dois quadros por episódio).
3. Eu vou ler os arquivos em `dados/` (e `dados/programa/` quando existirem),
   te mostrar os registros brutos que encontrei sobre esse artista, e só depois
   escrever o roteiro em `roteiros/[nome-do-convidado].md`, seguindo `MODELO.md`.
4. Se algum dado que o quadro precisa não existir em `dados/`, eu aviso que não
   encontrei — não vou inventar número de chart, lançamento ou fato do jogo.

## Atualizar os dados

No terminal, dentro da pasta do projeto:

```
node scripts/sincronizar.mjs
```

Isso baixa de novo o catálogo da API e as planilhas do programa (quando as
URLs de CSV estiverem preenchidas em `config/fontes.json`) e atualiza os
arquivos em `dados/`.
