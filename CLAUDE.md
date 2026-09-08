# The Gary Lake Show — guia para Claude

Este repositório tem dois papéis: (1) hospedar as telas que o Gary compartilha
ao vivo durante o programa (GitHub Pages), e (2) ser onde Gary e Claude montam
a pauta e o roteiro de cada episódio.

O usuário (Gary) não é programador. Ele atua como gerente de produto e não
consegue rodar quase nada na própria máquina. Sempre que ele precisar executar
algo, dar o comando exato e dizer onde colar. Nunca pedir para "verificar o
console" sem explicar exatamente como.

## O programa

"The Gary Lake Show" é um podcast dentro de um jogo de simulação de carreira
artística. Um convidado por semana, tela compartilhada durante o programa.
Formato inspirado no Lorelive e no Lady Night: **blocos com quadros fixos, não
perguntas soltas.**

Tom: irônico, direto, sem bajular o convidado.

## Estrutura fixa do episódio

1. **Abertura do Gary** — manchetes da semana do jogo, Gary sozinho, 2 a 3 min.
2. **Aquecimento** — perguntas rápidas de carreira, sem tela compartilhada, 5 min.
3. **Quadro fixo**
4. **Quadro rotativo**
5. **Encerramento** com ritual fixo

### Regra de ouro

**Nunca mais de dois quadros por episódio.**

## Fichas dos quadros

### SHOPPING (quadro fixo)

Grade de 6 lojas de shopping, cada uma escondendo um artista do jogo. O
convidado escolhe uma loja, Gary lê três dicas, revela a foto grande e o
convidado decide: explode ou salva. Placar corre o episódio inteiro.

- Nome interno: `shopping`
- Thumbnail/legenda de corte: "Quem fica no shopping?"
- Dados: aba **Shopping** da planilha do programa (`dados/programa/Shopping.json`)

### FLOP OU HIT

Sorteio de um lançamento do catálogo (capa, título, artista, sem números na
tela). O convidado crava flopou ou hitou. Depois revela o dado real vindo de
`/api/charts`: pico, semanas em chart, posição. A tela marca acertou ou errou.

- Dados: `dados/musicas.json`, `dados/albuns.json`, `dados/musicVideos.json`, `dados/charts.json`

### ARQUIVO GARY

Gary seleciona o convidado e o sistema filtra o catálogo inteiro por ele,
montando peças: primeiro lançamento registrado, pior colocação em chart, álbum
mais antigo, maior salto de posição. Gary escolhe qual puxar e ela aparece na
tela sem aviso prévio.

- Dados: todo o catálogo (`dados/*.json`), filtrado pelo nome do artista

### FEAT FORÇADO

Roleta sorteia um artista do jogo, excluindo o próprio convidado. Cronômetro
de 60 segundos na tela, aviso sonoro nos 10 segundos finais. O convidado
descreve o projeto: nome do single, conceito de capa, era.

- Dados: aba **Feat** da planilha do programa (`dados/programa/Feat.json`), ou `dados/artistas.json`

## Onde ficam os dados e como consultá-los

- `dados/*.json` — catálogo do jogo (músicas, álbuns, music videos,
  lançamentos recentes, charts, lista de artistas, infos de artistas).
  Baixado da API do projeto `empirerpg-max/empiregame` via
  `scripts/sincronizar.mjs`. **Fica versionado no Git** — é assim que Claude
  consegue ler o catálogo nas conversas de roteiro, sem precisar de acesso à
  internet a cada sessão.
- `dados/programa/*.json` — abas da planilha própria de Gary (Episódios,
  Shopping, Feat), convertidas de CSV publicado. Também versionado.
- `config/fontes.json` — URL base da API e URLs dos CSV das planilhas.
- Para atualizar: `node scripts/sincronizar.mjs` (ver roteiros/README.md).

### Pendências conhecidas desta fundação

- A API (`https://tanstack-start-app.empirerpg-forum.workers.dev`) não pôde
  ser testada durante a criação deste repositório porque a rede da sessão
  bloqueou a conexão por política de proxy (não é um erro da própria API).
  Isso significa que **ninguém rodou `sincronizar.mjs` com sucesso ainda** —
  `dados/*.json` do catálogo do jogo ainda não existem. Antes de montar
  qualquer roteiro, rodar a sincronização e confirmar que os arquivos
  apareceram.
- Ainda não se sabe se `/api/artistas/infos` tem um campo com URL de foto do
  artista (necessário para o quadro Shopping). Checar isso na primeira vez
  que `dados/artistasInfos.json` existir, procurando chaves como `foto`,
  `imagem`, `avatar`, `photoUrl` ou similar nos registros.
- As URLs de CSV em `config/fontes.json` (bloco `"programa"`) estão vazias —
  Gary precisa preenchê-las com os links de "Publicar na Web" das abas
  Episódios, Shopping e Feat da planilha dele.

## Instrução obrigatória para pautas e roteiros

Quando Gary pedir uma pauta ou um roteiro:

1. **Ler primeiro os arquivos em `dados/`** (e `dados/programa/` quando
   existirem) antes de escrever qualquer coisa.
2. Trazer material concreto e verificável sobre o convidado — nomes de
   lançamentos, posições em chart, datas — só se estiverem presentes nos
   arquivos de dados.
3. **Nunca inventar** lançamento, posição em chart ou qualquer fato do jogo.
   Se o dado não estiver em `dados/`, dizer explicitamente "não está em
   dados/" em vez de preencher o buraco.
4. Antes de escrever o roteiro final, **mostrar a Gary os registros brutos**
   (trechos dos JSON) que sustentam cada peça do roteiro, para ele conferir.
5. Seguir a estrutura de `roteiros/MODELO.md` e salvar o roteiro em
   `roteiros/[nome-do-convidado].md`.

## Regras do site (palco/controle)

- `palco.html` é a tela compartilhada ao vivo. **Nenhuma resposta, dica,
  gabarito ou foto de revelação pode existir no HTML do palco antes da hora.**
  O palco só recebe conteúdo em tempo real, mandado pelo `controle.html` via
  `js/sync.js`. Se o gabarito entrar no DOM adiantado, o programa perde a
  surpresa ao vivo — isso vale para qualquer lógica de quadro implementada no
  futuro em `js/quadros/`.
- `controle.html` é só para Gary ver. Nunca deve ser compartilhado na tela.
- Cores `--fogo-laranja` e `--fogo-vermelho` (em `css/tema.css`) são
  reservadas só para a animação de explosão do quadro Shopping.
- Nunca usar texto pequeno no palco: o convidado pode estar assistindo pelo
  celular.

## O que esta fundação NÃO fez (de propósito)

Nenhuma lógica de quadro foi implementada. `js/quadros/` está vazia. Isso é
trabalho de uma etapa futura.
