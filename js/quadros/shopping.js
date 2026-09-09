// Motor do quadro SHOPPING. Gera 3 dicas reais sobre o artista escondido em
// cada loja, e resolve a foto grande da revelação. Usado só pelo
// controle.html — o palco nunca importa este arquivo diretamente com o nome
// do artista, só recebe a dica pronta via sync.js no momento certo (regra do
// CLAUDE.md: nada de gabarito adiantado no HTML do palco).
import { normalizarNome } from "./arquivo-gary.js";
import { resolverImagemDrive } from "../dados.js";

function apareceNoTexto(texto, nomeNormalizado) {
  return normalizarNome(texto).includes(nomeNormalizado);
}

function itemEhDoArtista(item, nomeNormalizado) {
  if (apareceNoTexto(item.artist, nomeNormalizado)) return true;
  return (item.featArtists || []).some((a) => apareceNoTexto(a, nomeNormalizado));
}

/**
 * Gera até 3 dicas reais sobre um artista, a partir do catálogo carregado.
 * Cada dica é construída só com dado que existe de verdade — se faltar
 * material suficiente, devolve menos de 3 dicas (nunca inventa pra completar).
 */
export function gerarDicas(nomeArtista, dados) {
  const nomeNormalizado = normalizarNome(nomeArtista);
  const catalogo = [
    ...(dados.musicas || []),
    ...(dados.albuns || []),
  ].filter((item) => itemEhDoArtista(item, nomeNormalizado));

  const dicas = [];

  // Dica de gênero (campo real "genero" em dados/musicas.json)
  const generos = [...new Set(catalogo.map((i) => i.genero).filter(Boolean))];
  if (generos.length === 1) {
    dicas.push(`O estilo predominante do trabalho dele(a) é ${generos[0].toLowerCase()}.`);
  } else if (generos.length > 1) {
    dicas.push(`Transita entre ${generos.map((g) => g.toLowerCase()).join(" e ")}.`);
  }

  // Dica de volume de catálogo
  if (catalogo.length > 0) {
    const plural = catalogo.length === 1 ? "lançamento registrado" : "lançamentos registrados";
    dicas.push(`Tem ${catalogo.length} ${plural} no catálogo do jogo.`);
  }

  // Dica de estreia (data mais antiga com releaseDateIso)
  const comData = catalogo
    .filter((i) => i.releaseDateIso)
    .slice()
    .sort((a, b) => a.releaseDateIso.localeCompare(b.releaseDateIso));
  if (comData.length > 0) {
    const ano = comData[0].releaseDateIso.slice(0, 4);
    dicas.push(`Estreou no jogo em ${ano}.`);
  }

  // Dica de feat (se tiver colaborado com alguém)
  const feats = new Set();
  catalogo.forEach((i) => {
    if (apareceNoTexto(i.artist, nomeNormalizado)) {
      (i.featArtists || []).forEach((f) => feats.add(f));
    } else {
      feats.add(i.artist);
    }
  });
  if (feats.size > 0 && dicas.length < 3) {
    dicas.push(`Já teve uma parceria registrada com ${[...feats][0]}.`);
  }

  // Dica de chart (se existir histórico real)
  const historico = (dados.chartsHistorico || []).filter((e) => apareceNoTexto(e.musica, nomeNormalizado));
  if (historico.length > 0 && dicas.length < 3) {
    const melhor = historico.slice().sort((a, b) => a.posicao - b.posicao)[0];
    dicas.push(`Já chegou à posição #${melhor.posicao} num chart (${melhor.pais}).`);
  }

  return dicas.slice(0, 3);
}

/** Resolve nome + foto do artista a partir de dados/artistas.json. */
export function resolverArtista(nomeArtista, dados) {
  const nomeNormalizado = normalizarNome(nomeArtista);
  const artistas = dados.artistas || [];
  const encontrado = artistas.find((a) => normalizarNome(a.nome) === nomeNormalizado);
  return {
    nome: nomeArtista,
    foto: resolverImagemDrive(encontrado?.foto || ""),
  };
}

/**
 * Monta o card completo de uma loja: artista, dicas e foto. `fotoReserva` é
 * a coluna "Foto (reserva)" da aba Shopping — usada só quando o artista não
 * tem foto cadastrada em dados/artistas.json.
 */
export function montarCardLoja(loja, nomeArtista, dados, fotoReserva = "") {
  const fotoDoCatalogo = resolverArtista(nomeArtista, dados).foto;
  return {
    loja,
    artista: nomeArtista,
    dicas: gerarDicas(nomeArtista, dados),
    foto: fotoDoCatalogo || resolverImagemDrive(fotoReserva),
  };
}
