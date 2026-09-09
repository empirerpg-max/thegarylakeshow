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

Fonte: `dados/chartsHistorico.json` (28.431 registros reais, ~38 artistas,
80 países — corrigido nesta versão; uma extração anterior tinha, por erro
meu, ficado limitada só ao Paul Carter, o que estava errado).

```
Alexxa Hills - deal with it — Spotify:
  BRASIL:  #1 (Julho, único mês com registro — single mais recente dela no chart)
  ÁFRICA DO SUL, ALEMANHA, ANGOLA, ARGENTINA, ESTADOS UNIDOS, REINO UNIDO,
  FRANÇA, JAPÃO, e outros ~70 países: também #1 em Julho
  (exceções: Austrália #2, Chipre #3, Porto Rico #4)
```

> **Por que essa faixa:** é da própria convidada (mais pessoal que puxar de
> outro artista), e tem resultado real e forte — #1 em quase todo o mundo.
> Ainda não é um sorteio aleatório de verdade entre todo o catálogo (isso
> exigiria uma lógica de sorteio no site, que não foi implementada ainda) —
> por ora é uma escolha manual sobre dado real.

#### Roteiro do quadro

- Mostrar capa + título + artista de "deal with it" (Alexxa Hills), sem número na tela.
- Alexxa Hills crava: flopou ou hitou?
- Revelar: #1 no Spotify em praticamente todo o mundo (Brasil incluso) em Julho.
- Tela marca acertou ou errou (spoiler: provavelmente ela acerta — é difícil
  cravar "flopou" numa própria música e estar errada quando ela bombou assim).

### Quadro: Arquivo Gary

#### Munição de pesquisa (vinda de dados/)

Fonte: `node scripts/dossie.mjs "Alexxa Hills"` — reproduzido abaixo (rodado
depois da correção do `chartsHistorico.json`, que antes tinha ficado
indevidamente limitado só ao Paul Carter).

```
--- O primeiro lançamento ---
Bloodrush — 2020-08-18

--- O álbum mais antigo ---
Bloodrush — 2020-08-18

--- O maior hiato ---
1126 dias em silêncio
entre "Bloodrush" (2020-08-18) e "baddest of them all remix with TED" (2023-09-18)

--- A pior colocação em chart ---
#50 (o fundo do chart — é um Top 50, confirmado que nenhuma música do
dataset inteiro passa de posição 50) — "TED - Miss Perfect Blonde
feat. Alexxa Hills", Spotify, várias países empatados em #50 em Abril
(ex.: África do Sul, Alemanha, Angola)

--- O maior salto de posição ---
"TED - Miss Perfect Blonde feat. Alexxa Hills" caiu 16 posições:
de #34 (Fevereiro) para #50 (Abril)

--- O lançamento que ninguém comentou ---
"deal with it" — 2 comentário(s)

--- indisponível (sem dado real, e isso é honesto) ---
O que ele espera que ninguém lembre → a coluna "Média Metacritic" está
vazia em TODAS as 77 linhas da aba Musicas que temos, não só nas dela —
não é uma lacuna específica da Alexxa, é o jogo inteiro sem essa métrica
preenchida ainda.
```

#### Roteiro do quadro

- Gary abre a "pasta confidencial" de Alexxa Hills no palco.
- Escolher UMA das 6 peças disponíveis para puxar ao vivo. Duas sugestões
  fortes: "O maior hiato" (1126 dias entre Bloodrush e o remix com TED) ou
  "A pior colocação em chart" (#50 num feat com o TED — bom gancho pra
  perguntar sobre trabalhar em faixa de outro artista vs. carreira solo).
- Perguntar a ela sobre o contexto antes de revelar o dado.

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
