// Motor do quadro FEAT FORÇADO. Sorteia um artista da aba Feat da planilha
// do programa, sempre excluindo o próprio convidado.
import { normalizarNome } from "./arquivo-gary.js";

/**
 * Sorteia um nome de dados.feat (dados/programa/Feat.json), nunca o
 * convidado da semana. Devolve null se a lista ficar vazia depois de
 * excluir o convidado (nunca sorteia gente errada pra "completar").
 */
export function sortear(nomeConvidado, listaFeat) {
  const nomeConvidadoNormalizado = normalizarNome(nomeConvidado);
  const candidatos = (listaFeat || [])
    .map((linha) => linha["Artista"])
    .filter((nome) => nome && normalizarNome(nome) !== nomeConvidadoNormalizado);

  if (candidatos.length === 0) return null;
  const indice = Math.floor(Math.random() * candidatos.length);
  return candidatos[indice];
}
