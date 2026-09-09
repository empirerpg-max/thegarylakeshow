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
3. **Quadros** — Gary escolhe quais e quantos quadros (Shopping, Flop ou Hit,
   Arquivo Gary, Feat Forçado) entram no episódio, na ordem que preferir.
4. **Encerramento** com ritual fixo

Não existe mais limite fixo de quadros por episódio — cada episódio se ajusta
ao que Gary decidir para aquela semana. (Histórico: até aqui a regra era
"no máximo dois quadros", removida a pedido do Gary.)

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

- A API (`https://tanstack-start-app.empirerpg-forum.workers.dev`) ainda não
  pôde ser chamada com sucesso a partir de nenhuma sessão de trabalho — a
  rede bloqueia a conexão por política de proxy (não é um erro da própria
  API). Isso significa que **ninguém rodou `sincronizar.mjs` com sucesso
  ainda** — `dados/*.json` do catálogo do jogo ainda não existem. Antes de
  montar qualquer roteiro ou implementar um quadro que dependa de dados
  reais, rodar a sincronização (de uma máquina com rede livre) e confirmar
  que os arquivos apareceram.
- As URLs em `config/fontes.json` foram conferidas direto no código-fonte do
  backend (`empirerpg-max/empirefinal`, `backend/src/routes/api.ts` e
  controllers). `musicas`, `albuns`, `musicVideos`, `lancamentos` e
  `artistas` (listar-todos) são GETs simples e batem certinho. **Dois
  endpoints foram removidos do sync em massa por não serem GETs simples:**
  - `/api/charts` exige `?action=...` (ex: `getChart`, `getRealTime`,
    `getReleases`) mais parâmetros como `tab`/`date`/`style` dependendo da
    ação — sem isso devolve `{"error": "Ação desconhecida"}`. Além disso,
    o "chart" real é um retrato semanal (posição por rodada), não um
    histórico pronto de picos/semanas — calcular "pico" ou "semanas em
    chart" exigiria baixar várias semanas e cruzar manualmente. Fica como
    trabalho futuro quando o quadro Flop ou Hit for implementado de verdade.
  - `/api/artistas/infos` exige `?nome=<nome>` — é consulta de UM artista
    por vez (biografia, foto, capa), não uma listagem. Não dá pra baixar em
    massa num único GET.
  - **A foto do artista, no entanto, já vem de graça em `artistas.json`**
    (endpoint `/api/artistas/listar-todos`, campo `foto`, sempre uma URL ou
    string vazia) — confirmado lendo `getAllArtistasController` no backend.
    Não precisa do endpoint `/infos` pra isso.
- As URLs de CSV em `config/fontes.json` (bloco `"programa"`) estão vazias —
  Gary precisa preenchê-las com os links de "Publicar na Web" de cada aba da
  planilha do programa (ver seção "Planilha do programa" abaixo).

### Planilha do programa

Gary já iniciou a planilha em:
https://docs.google.com/spreadsheets/d/1F2c1c_ntDcP0iRU_hBPCFvuqZWw-p4bD9ZPfUxoZ2Oc/edit

Ela tem uma aba com a estrutura da aba Shopping (Loja | Artista), já com 2
das 6 lojas preenchidas. Ainda faltam: renomear a aba pra `Shopping`
exatamente, adicionar uma coluna `Foto` (mesmo que o quadro normalmente use
a foto do catálogo via `artistas.json`, serve de reserva pra artista sem
foto cadastrada ou pra imagem específica daquela aparição), e criar as abas
`Episodios` e `Feat`. Claude não tem uma ferramenta de escrita direta em
células de Google Sheets já existentes nesta sessão — isso fica por conta
de Gary editar manualmente, com Claude dando a estrutura exata de colunas.

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
6. **Se o Arquivo Gary estiver entre os quadros do episódio**: rodar
   mentalmente o mesmo levantamento de `montarDossie` (ou de fato rodar
   `node scripts/dossie.mjs "Nome do Artista"`) e trazer as peças com seus
   registros brutos antes de escrever qualquer parte do roteiro relativa a
   esse quadro — nunca inventar posição de chart, data ou contagem de
   comentário que não esteja em `dados/`. Se uma peça vier "indisponível",
   dizer isso a Gary em vez de estimar ou aproximar o dado.

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

## ARQUIVO GARY — motor de busca (implementado)

`js/quadros/arquivo-gary.js` exporta `montarDossie(nomeArtista, dados)`, usado
tanto pelo palco/controle quanto por `scripts/dossie.mjs` (mesma lógica nos
dois lugares, sem duplicação). Recebe um objeto `dados` com as chaves:
`musicas`, `albuns`, `musicVideos`, `artistas` (de `dados/*.json`, vindas do
sync da API pública) e **duas chaves novas que a API pública não fornece**:

- `chartsHistorico` — array de `{ posicao, pais, musica, plataforma, mes }`.
  Vem da planilha real de charts (`chartsBase`, fora do escopo da API
  pública) — só dá pra popular lendo a planilha diretamente via Google
  Drive, não pelo `sincronizar.mjs`. **`dados/chartsHistorico.json` tem
  28.431 registros reais, cobrindo ~38 artistas em 80 países, Spotify,
  meses de Janeiro a Julho** — extraído da mesma leitura da planilha
  `chartsBase` (ID `1ThRhljmAS41JmVBPkPtYwe0JQHRx9Pih2PQAPT2ebyA`). Numa
  primeira versão este arquivo tinha sido filtrado só pra "Paul Carter" por
  um corte de escopo malfeito da minha parte — isso estava errado e foi
  corrigido: a planilha sempre teve todos os artistas, o filtro indevido
  que limitava a cobertura era meu, não da fonte de dados.
- `comentarios` — array de `{ artista, musica, contagemComentarios }`. Mesma
  situação: vem de colunas de comentário dentro de `registrosCharts`, não da
  API pública. **Ainda não populado** — nenhum arquivo `dados/comentarios.json`
  existe ainda.

Cada uma das 7 peças (primeiro lançamento, álbum mais antigo, maior hiato, o
esquecido, pior colocação em chart, maior salto de posição, menos
repercussão) verifica sozinha se tem o dado que precisa e devolve
`disponivel: false` com um motivo claro em vez de quebrar ou inventar — rodar
`node scripts/dossie.mjs "Nome"` com `dados/musicas.json` etc. ainda vazios
(API pública bloqueada nesta rede) mostra isso na prática: as peças que
dependem de `chartsHistorico` funcionam (porque esse arquivo tem dado real),
as que dependem do catálogo básico avisam "indisponível" honestamente.

### Pendência: como popular `chartsHistorico` e `comentarios` de verdade

Essas duas fontes **não podem ser baixadas pelo `sincronizar.mjs`** (é um
script Node puro, sem autenticação Google) — só uma sessão do Claude com
acesso ao Google Drive de Gary consegue ler `chartsBase`/`registrosCharts`
diretamente e gerar esses JSON. Na prática: sempre que Gary pedir uma pauta
nova, antes de montar o roteiro, ler essas planilhas de novo (ou confirmar
que o recorte em `dados/` ainda cobre o artista da vez) e atualizar
`dados/chartsHistorico.json`/`dados/comentarios.json` manualmente — não é
automático como o resto do catálogo.

### `dados/musicas.json`, `albuns.json`, `artistas.json`, `comentarios.json`: vieram do Drive, não da API

A API pública (`empire-play/musicas`) continua bloqueada nesta rede. Em vez
de esperar ela liberar, esses quatro arquivos foram extraídos **direto da
planilha "principal" do jogo** (ID `1XYa6Pzd-lou3fzqaZgjhBYNb3Je2PB9Slu7ozzOghUo`)
via Google Drive — mesmo mecanismo já usado pra `chartsHistorico.json`:

- `musicas.json` — 76 faixas, da aba "Musicas".
- `albuns.json` — 71 álbuns, da aba "Albuns".
- `artistas.json` — **117 artistas com nome e foto real** (101 com foto
  preenchida), da aba ARTISTAS na planilha "usuarios"/Gestão
  (`1lFw9l76tYZYCDXhZsoiftIEzCvKcjCrI_oBpvUdwAlo`). Esse arquivo cobre bem
  mais nomes do que `musicas.json`/`albuns.json` (117 vs. 33) — significa
  que o Arquivo Gary reconhece mais artistas como "cadastrados" do que tem
  lançamento para mostrar; a peça de foto do Shopping já pode usar esse
  campo `foto` direto, sem precisar de reserva manual pra maioria dos
  artistas.
- `comentarios.json` — 21 títulos com pelo menos 1 comentário, de uma tabela
  de comentários encontrada na mesma leitura (85 linhas de comentário no
  total). **Limitação importante**: essa tabela só lista títulos que TÊM
  comentário — uma música com zero comentários simplesmente não aparece
  aqui, então a peça "menos repercussão" só compara entre os títulos que
  já têm pelo menos um comentário registrado, não entre todo o catálogo.
  Uma música realmente ignorada (zero comentários) pode estar escondida
  fora desse recorte, e o motor não tem como saber disso hoje.

Com o `chartsHistorico.json` corrigido (ver acima, 28.431 registros reais,
~38 artistas), **6 das 7 peças** funcionam de verdade pra qualquer artista
coberto — testado com Alexxa Hills: primeiro lançamento, álbum mais antigo,
maior hiato, pior colocação em chart, maior salto de posição e menos
repercussão todas retornaram dado real. Só "o que ele espera que ninguém
lembre" ficou indisponível pra ela — e isso é honesto, não uma limitação
minha: a coluna "Média Metacritic" está **vazia em todas as 77 linhas** da
aba Musicas que temos, não só nas dela. Conferido diretamente na planilha
antes de escrever isso.

**Isso é um recorte manual, não a fonte completa.** O catálogo real do jogo
provavelmente tem mais de 76 músicas e mais de 33 artistas — esse foi só o
volume que coube numa única leitura de Drive. Quando a API pública for
liberada, `sincronizar.mjs` deve voltar a ser a fonte principal (cobre o
catálogo inteiro de verdade). Até lá, se Gary pedir um artista fora desses
33 nomes, o motor avisa "não encontrado" — o que significa "fora deste
recorte", não necessariamente "não existe no jogo".

### Telas (implementado)

- `controle.html`: ao escolher o quadro "Arquivo Gary", aparece um campo pra
  digitar o nome do artista + botão "Buscar dossiê". As peças encontradas
  aparecem com o dado **já visível pra Gary**, cada uma com botão "Puxar do
  arquivo" (manda a peça pro palco) e "Ver registros brutos" (expande a lista
  usada de prova, só no controle). Botão "Fechar o arquivo" volta o palco pro
  logo.
- `palco.html`: ao abrir o quadro, mostra só a capa (nome do convidado, sem
  nenhuma peça). Cada clique em "Puxar do arquivo" manda o título da peça
  primeiro (sem o dado), e o dado surge grande 1,2s depois automaticamente.
  Nenhuma peça, dado ou registro fica no HTML antes do clique correspondente
  — tudo chega via `sync.js` no momento exato.

## SHOPPING — implementado (com interação de mão dupla)

Diferente do Arquivo Gary, o Shopping usa o `js/sync.js` nos **dois
sentidos**: o controle manda o quê exibir, mas o **palco também manda
mensagem de volta** quando o convidado clica numa loja — é o próprio
convidado que interage com a tela, não Gary escolhendo por ele.

- `js/quadros/shopping.js` exporta `gerarDicas` (3 dicas reais por artista,
  construídas só com campos que existem em `dados/musicas.json` — gênero,
  quantidade de lançamentos, ano de estreia, feat, melhor posição em chart
  quando existir; nunca inventa dica pra completar 3 se não tiver material),
  `resolverArtista` (nome + foto de `dados/artistas.json`) e `montarCardLoja`
  (junta os dois).
- `controle.html`: ao escolher "Shopping", mostra as 6 lojas com o nome do
  artista **visível só pra Gary**, as dicas geradas, botão "Revelar foto no
  palco", e botões "Explodiu"/"Salvou" que atualizam um placar da sessão.
  Também escuta o palco: quando o convidado clica numa loja lá, o card
  correspondente aqui fica com borda azul.
- `palco.html`: mostra as 6 lojas **só pelo nome**, sem nenhum artista
  associado no HTML. O convidado clica numa — o clique dispara
  `enviar('shopping:loja-escolhida', ...)` do próprio palco de volta pro
  controle. Quando Gary revela a foto ou marca o resultado, o palco atualiza
  em tempo real (foto grande, depois "EXPLODIU" em fogo laranja/vermelho ou
  "SALVOU" em azul).
- **Sem foto cadastrada**: nem todo artista de `dados/programa/Shopping.json`
  tem `foto` em `dados/artistas.json` (ex.: Poxxie Freitas, na aba Shopping
  atual). O card do controle avisa isso explicitamente em vez de mostrar
  campo vazio sem explicação — a coluna "Foto (reserva)" da planilha existe
  exatamente pra esse caso, mas ainda não foi preenchida.
- **Imagens de loja**: controladas por Gary direto na planilha, na coluna
  **"Foto loja"** da aba Shopping (`dados/programa/Shopping.json`, campo
  `"Foto loja"`) — um link de imagem por loja. O palco usa essa foto no
  botão da loja; se a coluna estiver vazia pra alguma loja, o botão cai pra
  só o nome em texto, sem quebrar. Claude não gera nem escolhe logo de marca
  por conta própria — a imagem é sempre a que Gary colocar nessa coluna.

## Verificação de nota Metacritic (checado a fundo)

Antes de reportar "indisponível" nessa peça, Claude já verificou o campo
"Média Metacritic" em **5 planilhas diferentes** (Musicas e Albuns da
planilha principal, `chartsBase`, ARTISTAS da planilha de Gestão, e
`saidosCharts`) — buscando literalmente a palavra "Metacritic" em cada uma.
Resultado: aparece só nos cabeçalhos de coluna, nunca com um número
preenchido do lado, em nenhuma das ~148 linhas de música/álbum lidas até
agora. Se existir nota de verdade em algum lugar, é numa fonte que Claude
ainda não tem o ID/link — pedir a Gary o nome de uma música com nota
conhecida pra localizar a fonte certa antes de insistir que "não existe".

## O que esta fundação NÃO fez (de propósito)

Flop ou Hit e Feat Forçado ainda não têm interação implementada no
palco/controle (só o roteiro manual de cada um foi montado até agora,
ver `roteiros/Alexxa-Hills.md`). Arquivo Gary e Shopping já funcionam de
ponta a ponta.
