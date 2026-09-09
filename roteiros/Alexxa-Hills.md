# Roteiro — Alexxa Hills

- **Convidado (jogador):** Adriano
- **Nome do artista no jogo:** Alexxa Hills
- **Data de gravação:** 09/09/2026

## Quadros deste episódio

- [x] Shopping
- [x] Flop ou Hit
- [x] Arquivo Gary
- [x] Feat Forçado

---

## 1. Abertura do Gary (2–3 min, sem convidado na tela)

Manchetes da semana do jogo. Tom irônico, direto.

> **Pendência:** a aba Episodios da planilha do programa não tem manchetes
> preenchidas para esta semana (`dados/programa/Episodios.json`, campo
> "Manchetes da Semana" vazio). Não vou inventar manchete — Gary precisa
> preencher essa coluna ou me passar as manchetes na hora antes de gravar.

- Manchete 1: [preencher]
- Manchete 2: [preencher]
- Manchete 3: [preencher]

## 2. Aquecimento (5 min, sem tela compartilhada)

Perguntas rápidas de carreira. Não usa dados do catálogo, é sobre a pessoa/personagem.

- Como foi decidir que a Alexxa Hills faria parte do próximo álbum logo depois do "villain (deluxe edition)"?
- Tem algum ritual de estúdio que você/Alexxa não abre mão antes de gravar uma faixa nova?
- Se pudesse reescrever uma letra antiga da carreira dela, qual seria e por quê?

## 3. Quadros

### Quadro: Shopping

#### Munição de pesquisa (vinda de dados/)

Fonte: `dados/programa/Shopping.json` (aba Shopping da planilha do programa),
fotos de `dados/artistas.json`.

```
Praça de alimentação → Rose Thompson (foto cadastrada)
Estacionamento       → Poxxie Freitas (SEM foto cadastrada em dados/artistas.json)
Gucci                → SA5M (foto cadastrada)
Calvin Klein         → Rayna (foto cadastrada)
We Pink              → Samantha Cooper (foto cadastrada)
Apple Store          → Sabine (foto cadastrada)
```

> **Aviso:** Poxxie Freitas não está em `dados/artistas.json` (117 artistas
> extraídos até agora, ela não caiu nesse recorte). Sem foto de reserva
> preenchida na planilha, o card dela no palco vai ficar sem imagem. Ou
> Gary preenche a coluna "Foto (reserva)" na aba Shopping com um link
> manual, ou aceita a loja sem foto grande na revelação.

#### Roteiro do quadro

- Alexxa Hills escolhe uma das 6 lojas.
- Gary lê três dicas sobre o artista escondido (usar `dados/artistas.json` e
  `dados/musicas.json` desse artista específico como munição — não escrito
  aqui porque a dica não pode vazar antes da hora).
- Revelar foto grande → Alexxa decide: explode ou salva.
- Repetir para quantas lojas o tempo de programa permitir.

### Quadro: Flop ou Hit

#### Munição de pesquisa (vinda de dados/)

Fonte: `dados/chartsHistorico.json` (histórico real, só cobre Paul Carter).

```
Paul Carter - Lion's Den — Spotify, BRASIL:
  Abril:  #3
  Maio:   #1   (pico)
  Junho:  #12
  Julho:  #22
```

> **Por que esse lançamento:** é o único do catálogo com histórico de chart
> completo (mês a mês) que temos hoje — os outros lançamentos em
> `dados/musicas.json` não têm posição de chart registrada em
> `dados/chartsHistorico.json`. Sorteio "de verdade" (aleatório entre vários)
> só vai ser possível quando mais artistas tiverem histórico de chart
> extraído.

#### Roteiro do quadro

- Mostrar capa + título + artista de "Lion's Den" (Paul Carter), sem número na tela.
- Alexxa Hills crava: flopou ou hitou?
- Revelar: pico #1 no Spotify Brasil em Maio, caiu pra #22 em Julho.
- Tela marca acertou ou errou.

### Quadro: Arquivo Gary

#### Munição de pesquisa (vinda de dados/)

Fonte: `node scripts/dossie.mjs "Alexxa Hills"` — reproduzido abaixo.

```
--- O primeiro lançamento ---
Bloodrush — 2020-08-18

--- O álbum mais antigo ---
Bloodrush — 2020-08-18

--- O maior hiato ---
1126 dias em silêncio
entre "Bloodrush" (2020-08-18) e "baddest of them all remix with TED" (2023-09-18)

--- O lançamento que ninguém comentou ---
"deal with it" — 2 comentário(s)

--- indisponíveis (sem dado real) ---
O que ele espera que ninguém lembre → sem nota (metacriticAvg) registrada
A pior colocação em chart → sem entrada em dados/chartsHistorico.json
O maior salto de posição → mesmo motivo
```

#### Roteiro do quadro

- Gary abre a "pasta confidencial" de Alexxa Hills no palco.
- Escolher UMA das 4 peças disponíveis para puxar ao vivo (sugestão: "O maior
  hiato" — 1126 dias entre Bloodrush e o remix com TED é um gancho de
  conversa forte).
- Perguntar a ela o que aconteceu nesse hiato antes de revelar o contexto.

### Quadro: Feat Forçado

#### Munição de pesquisa (vinda de dados/)

Fonte: `dados/programa/Feat.json` (aba Feat da planilha do programa).

```
Toshie Genji    (SEM foto cadastrada em dados/artistas.json)
Toonya Parker   (foto cadastrada)
Harriet         (foto cadastrada)
Merry Shuester  (SEM foto cadastrada em dados/artistas.json)
Lolenne         (SEM foto cadastrada em dados/artistas.json)
```

> **Aviso:** 3 dos 5 candidatos da roleta não têm foto cadastrada ainda.
> Não afeta o sorteio em si (o Feat Forçado não usa foto), só avise Gary
> que a tela desses três vai ficar sem imagem se algum dia esse quadro
> precisar mostrar o rosto do sorteado.

#### Roteiro do quadro

- Roleta sorteia 1 dos 5 nomes acima (nunca a própria Alexxa Hills — ela já
  está fora da lista).
- Cronômetro de 60s, aviso sonoro nos 10s finais.
- Alexxa descreve: nome do single, conceito de capa, era — como se fosse um
  feat real com o artista sorteado.

## 4. Encerramento (ritual fixo)

- Pergunta de encerramento: [não preenchida em `dados/programa/Episodios.json` — Gary define]
- Ritual fixo: [ainda não descrito em nenhum lugar do repositório — primeira vez que este roteiro é montado, então não existe um ritual anterior para repetir; Gary precisa definir qual é]
