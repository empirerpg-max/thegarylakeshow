// Motor do quadro FLOP OU HIT. Encontra lançamentos do catálogo que têm
// histórico real de chart (dados/chartsHistorico.json) e resume pico,
// posição mais recente e trajetória — só com dado que existe de verdade.
import { normalizarNome } from "./arquivo-gary.js";

function apareceNoTexto(texto, nomeNormalizado) {
  return normalizarNome(texto).includes(nomeNormalizado);
}

const MESES_ORDEM = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

/**
 * Lista os lançamentos de dados/musicas.json que têm pelo menos uma entrada
 * em dados/chartsHistorico.json — só esses servem pro Flop ou Hit, porque
 * são os únicos com dado real de chart pra revelar depois do palpite.
 */
export function listarCandidatos(dados) {
  const musicas = dados.musicas || [];
  const historico = dados.chartsHistorico || [];

  return musicas
    .map((musica) => {
      const nomeArtistaNormalizado = normalizarNome(musica.artist);
      const entradas = historico.filter(
        (e) =>
          apareceNoTexto(e.musica, normalizarNome(musica.title)) &&
          apareceNoTexto(e.musica, nomeArtistaNormalizado),
      );
      return { musica, entradas };
    })
    .filter((c) => c.entradas.length > 0);
}

/** Resume o histórico de chart de um candidato: pico e trajetória real. */
export function resumirChart(entradas) {
  const brasil = entradas.filter((e) => e.pais === "BRASIL");
  const base = brasil.length > 0 ? brasil : entradas;

  const ordenadas = base
    .filter((e) => MESES_ORDEM.includes(normalizarNome(e.mes)))
    .slice()
    .sort((a, b) => MESES_ORDEM.indexOf(normalizarNome(a.mes)) - MESES_ORDEM.indexOf(normalizarNome(b.mes)));

  const pico = base.slice().sort((a, b) => a.posicao - b.posicao)[0];
  const maisRecente = ordenadas[ordenadas.length - 1] || pico;

  return {
    pais: base[0]?.pais || "",
    plataforma: base[0]?.plataforma || "",
    pico,
    maisRecente,
    trajetoria: ordenadas.map((e) => `${e.mes}: #${e.posicao}`),
  };
}
