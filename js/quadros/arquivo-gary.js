// Motor de busca do quadro ARQUIVO GARY.
// Recebe o catálogo já carregado (de dados/*.json) e o nome de um artista,
// devolve um dossiê: uma lista de peças, cada uma com título curto, o dado
// principal em destaque, e os registros brutos que sustentam aquilo.
//
// Usado tanto pelo palco/controle (via <script type="module">) quanto por
// scripts/dossie.mjs no terminal — é o mesmo código nos dois lugares, para
// nunca haver divergência entre o que aparece no terminal e o que vai ao ar.

const MESES_ORDEM = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

export function normalizarNome(valor) {
  return String(valor ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[​-‍﻿]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function apareceNoTexto(texto, nomeNormalizado) {
  return normalizarNome(texto).includes(nomeNormalizado);
}

// Um item do catálogo (musicas/albuns/musicVideos, já no formato limpo da
// API) "é do artista" se ele é o artist principal ou está em featArtists.
function itemEhDoArtista(item, nomeNormalizado) {
  if (apareceNoTexto(item.artist, nomeNormalizado)) return true;
  return (item.featArtists || []).some((a) => apareceNoTexto(a, nomeNormalizado));
}

function catalogoDoArtista(dados, nomeNormalizado) {
  const fontes = [
    ...(dados.musicas || []),
    ...(dados.albuns || []),
    ...(dados.musicVideos || []),
  ];
  return fontes.filter((item) => itemEhDoArtista(item, nomeNormalizado));
}

function ordenarPorData(itens) {
  return itens
    .filter((i) => i.releaseDateIso)
    .slice()
    .sort((a, b) => a.releaseDateIso.localeCompare(b.releaseDateIso));
}

function formatarItem(item) {
  const partes = [item.artist, item.title].filter(Boolean).join(" — ");
  const extra = [];
  if (item.releaseDateIso) extra.push(`lançado em ${item.releaseDateIso}`);
  if (item.album) extra.push(`álbum: ${item.album}`);
  if (item.metacriticAvg) extra.push(`nota: ${item.metacriticAvg}`);
  return extra.length ? `${partes} (${extra.join(", ")})` : partes;
}

// --- Peça 1: primeiro lançamento registrado ---
function pecaPrimeiroLancamento(catalogo) {
  const comData = ordenarPorData(catalogo);
  if (comData.length === 0) {
    return {
      id: "primeiro-lancamento",
      titulo: "O primeiro lançamento",
      disponivel: false,
      motivo: "Nenhum item do catálogo desse artista tem data de lançamento registrada.",
    };
  }
  const primeiro = comData[0];
  return {
    id: "primeiro-lancamento",
    titulo: "O primeiro lançamento",
    disponivel: true,
    dadoPrincipal: `${primeiro.title} — ${primeiro.releaseDateIso}`,
    contextoSecundario: [primeiro.album, primeiro.metacriticAvg && `nota ${primeiro.metacriticAvg}`]
      .filter(Boolean)
      .join(" · "),
    registrosBrutos: [formatarItem(primeiro)],
  };
}

// --- Peça 2: álbum mais antigo ---
function pecaAlbumMaisAntigo(dados, nomeNormalizado) {
  const albuns = (dados.albuns || []).filter((item) => itemEhDoArtista(item, nomeNormalizado));
  const comData = ordenarPorData(albuns);
  if (comData.length === 0) {
    return {
      id: "album-mais-antigo",
      titulo: "O álbum mais antigo",
      disponivel: false,
      motivo: "Nenhum álbum desse artista tem data de lançamento registrada em dados/albuns.json.",
    };
  }
  const antigo = comData[0];
  return {
    id: "album-mais-antigo",
    titulo: "O álbum mais antigo",
    disponivel: true,
    dadoPrincipal: `${antigo.title} — ${antigo.releaseDateIso}`,
    contextoSecundario: antigo.metacriticAvg ? `nota ${antigo.metacriticAvg}` : "",
    registrosBrutos: [formatarItem(antigo)],
  };
}

// --- Peça 3: maior intervalo sem lançar nada ---
function pecaMaiorIntervalo(catalogo) {
  const comData = ordenarPorData(catalogo);
  if (comData.length < 2) {
    return {
      id: "maior-intervalo",
      titulo: "O maior hiato",
      disponivel: false,
      motivo: "É preciso pelo menos 2 lançamentos com data para calcular um intervalo.",
    };
  }
  let maiorGapDias = -1;
  let par = null;
  for (let i = 1; i < comData.length; i++) {
    const anterior = new Date(comData[i - 1].releaseDateIso);
    const atual = new Date(comData[i].releaseDateIso);
    const gapDias = Math.round((atual - anterior) / (1000 * 60 * 60 * 24));
    if (gapDias > maiorGapDias) {
      maiorGapDias = gapDias;
      par = [comData[i - 1], comData[i]];
    }
  }
  return {
    id: "maior-intervalo",
    titulo: "O maior hiato",
    disponivel: true,
    dadoPrincipal: `${maiorGapDias} dias em silêncio`,
    contextoSecundario: `entre "${par[0].title}" (${par[0].releaseDateIso}) e "${par[1].title}" (${par[1].releaseDateIso})`,
    registrosBrutos: [formatarItem(par[0]), formatarItem(par[1])],
  };
}

// --- Peça 4: o que ele provavelmente esqueceu (antigo + pior nota) ---
function pecaEsquecido(catalogo) {
  const comNota = catalogo.filter((i) => i.metacriticAvg != null && i.metacriticAvg !== "");
  if (comNota.length === 0) {
    return {
      id: "esquecido",
      titulo: "O que ele espera que ninguém lembre",
      disponivel: false,
      motivo: "Nenhum item desse artista tem nota (metacriticAvg) registrada.",
    };
  }
  const ordenado = comNota.slice().sort((a, b) => {
    const notaA = Number(a.metacriticAvg);
    const notaB = Number(b.metacriticAvg);
    if (notaA !== notaB) return notaA - notaB;
    return (a.releaseDateIso || "9999").localeCompare(b.releaseDateIso || "9999");
  });
  const pior = ordenado[0];
  return {
    id: "esquecido",
    titulo: "O que ele espera que ninguém lembre",
    disponivel: true,
    dadoPrincipal: `${pior.title} — nota ${pior.metacriticAvg}`,
    contextoSecundario: pior.releaseDateIso ? `lançado em ${pior.releaseDateIso}` : "",
    registrosBrutos: [formatarItem(pior)],
  };
}

// --- Peça 5: pior colocação em chart ---
// Espera dados.chartsHistorico: [{ artista, musica, pais, plataforma, posicao, mes }]
function pecaPiorColocacao(dados, nomeNormalizado) {
  const historico = dados.chartsHistorico || [];
  const entradas = historico.filter((e) => apareceNoTexto(e.musica, nomeNormalizado));
  if (entradas.length === 0) {
    return {
      id: "pior-colocacao",
      titulo: "A pior colocação em chart",
      disponivel: false,
      motivo: "Nenhuma entrada em dados/chartsHistorico.json menciona esse artista.",
    };
  }
  const pior = entradas.slice().sort((a, b) => Number(b.posicao) - Number(a.posicao))[0];
  return {
    id: "pior-colocacao",
    titulo: "A pior colocação em chart",
    disponivel: true,
    dadoPrincipal: `#${pior.posicao} — ${pior.musica}`,
    contextoSecundario: `${pior.plataforma || ""} · ${pior.pais || ""} · ${pior.mes || ""}`.trim(),
    registrosBrutos: entradas.map(
      (e) => `${e.musica} — #${e.posicao} (${e.plataforma}, ${e.pais}, ${e.mes})`,
    ),
  };
}

// --- Peça 6: maior salto de posição entre meses ---
function pecaMaiorSalto(dados, nomeNormalizado) {
  const historico = dados.chartsHistorico || [];
  const entradas = historico.filter((e) => apareceNoTexto(e.musica, nomeNormalizado));
  // Agrupa por (música + país + plataforma) pra comparar a mesma faixa mês a mês.
  const grupos = new Map();
  for (const e of entradas) {
    const chave = `${normalizarNome(e.musica)}::${e.pais}::${e.plataforma}`;
    if (!grupos.has(chave)) grupos.set(chave, []);
    grupos.get(chave).push(e);
  }

  let maiorSalto = null;
  for (const lista of grupos.values()) {
    const ordenada = lista
      .filter((e) => MESES_ORDEM.includes(normalizarNome(e.mes)))
      .sort((a, b) => MESES_ORDEM.indexOf(normalizarNome(a.mes)) - MESES_ORDEM.indexOf(normalizarNome(b.mes)));
    for (let i = 1; i < ordenada.length; i++) {
      const salto = Number(ordenada[i - 1].posicao) - Number(ordenada[i].posicao);
      if (!maiorSalto || Math.abs(salto) > Math.abs(maiorSalto.salto)) {
        maiorSalto = { salto, de: ordenada[i - 1], para: ordenada[i] };
      }
    }
  }

  if (!maiorSalto) {
    return {
      id: "maior-salto",
      titulo: "O maior salto de posição",
      disponivel: false,
      motivo: "Não há pelo menos 2 meses seguidos da mesma faixa em dados/chartsHistorico.json.",
    };
  }

  const direcao = maiorSalto.salto > 0 ? "subiu" : "caiu";
  return {
    id: "maior-salto",
    titulo: "O maior salto de posição",
    disponivel: true,
    dadoPrincipal: `${maiorSalto.para.musica} ${direcao} ${Math.abs(maiorSalto.salto)} posições`,
    contextoSecundario: `de #${maiorSalto.de.posicao} (${maiorSalto.de.mes}) para #${maiorSalto.para.posicao} (${maiorSalto.para.mes})`,
    registrosBrutos: [
      `${maiorSalto.de.musica} — #${maiorSalto.de.posicao} em ${maiorSalto.de.mes}`,
      `${maiorSalto.para.musica} — #${maiorSalto.para.posicao} em ${maiorSalto.para.mes}`,
    ],
  };
}

// --- Peça 7: lançamento com menos repercussão ---
// Espera dados.comentarios: [{ artista, musica, contagemComentarios }]
function pecaMenosRepercussao(dados, nomeNormalizado) {
  const comentarios = dados.comentarios || [];
  const doArtista = comentarios.filter(
    (c) => apareceNoTexto(c.artista, nomeNormalizado) || apareceNoTexto(c.musica, nomeNormalizado),
  );
  if (doArtista.length === 0) {
    return {
      id: "menos-repercussao",
      titulo: "O lançamento que ninguém comentou",
      disponivel: false,
      motivo: "Nenhuma entrada em dados/comentarios.json menciona esse artista.",
    };
  }
  const menos = doArtista.slice().sort(
    (a, b) => Number(a.contagemComentarios || 0) - Number(b.contagemComentarios || 0),
  )[0];
  return {
    id: "menos-repercussao",
    titulo: "O lançamento que ninguém comentou",
    disponivel: true,
    dadoPrincipal: `${menos.musica} — ${menos.contagemComentarios || 0} comentário(s)`,
    contextoSecundario: "",
    registrosBrutos: [`${menos.musica}: ${menos.contagemComentarios || 0} comentário(s)`],
  };
}

/**
 * Monta o dossiê completo de um artista.
 * `dados` é um objeto com as chaves já carregadas de dados/*.json:
 *   { musicas, albuns, musicVideos, artistas, chartsHistorico, comentarios }
 * Chaves ausentes são tratadas como listas vazias — cada peça avisa
 * separadamente quando falta o que ela precisa, em vez de quebrar tudo.
 */
export function montarDossie(nomeArtista, dados) {
  const nomeNormalizado = normalizarNome(nomeArtista);
  if (!nomeNormalizado) {
    return { encontrado: false, aviso: "Nome de artista vazio." };
  }

  const artistas = dados.artistas || [];
  const cadastrado = artistas.some((a) => normalizarNome(a.nome) === nomeNormalizado);
  const catalogo = catalogoDoArtista(dados, nomeNormalizado);
  const apareceEmCharts = (dados.chartsHistorico || []).some((e) => apareceNoTexto(e.musica, nomeNormalizado));
  const apareceEmComentarios = (dados.comentarios || []).some(
    (c) => apareceNoTexto(c.artista, nomeNormalizado) || apareceNoTexto(c.musica, nomeNormalizado),
  );

  if (!cadastrado && catalogo.length === 0 && !apareceEmCharts && !apareceEmComentarios) {
    return {
      encontrado: false,
      aviso:
        `Não encontrei "${nomeArtista}" nem no catálogo nem na lista de artistas. ` +
        `Confira a grafia exata (o motor ignora maiúsculas/acentos/espaços, mas não corrige erro de digitação).`,
    };
  }

  const pecas = [
    pecaPrimeiroLancamento(catalogo),
    pecaAlbumMaisAntigo(dados, nomeNormalizado),
    pecaMaiorIntervalo(catalogo),
    pecaEsquecido(catalogo),
    pecaPiorColocacao(dados, nomeNormalizado),
    pecaMaiorSalto(dados, nomeNormalizado),
    pecaMenosRepercussao(dados, nomeNormalizado),
  ];

  return {
    encontrado: true,
    artista: nomeArtista,
    pecas,
  };
}
