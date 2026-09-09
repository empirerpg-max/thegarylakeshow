// Carrega os JSON de dados/ com cache em localStorage, para o palco continuar
// funcionando mesmo se a internet cair no meio do programa.
const PREFIXO_CACHE = 'gary-lake-show:dados:';

function caminhoPara(nome) {
  // nomes com "/" (ex: "programa/Shopping") viram dados/programa/Shopping.json
  return `dados/${nome}.json`;
}

/**
 * Links do tipo "drive.google.com/uc?export=view&id=..." não são confiáveis
 * como <img src> embutido em outro site — o Drive às vezes devolve uma
 * página de aviso em vez da imagem, e a foto aparece quebrada. O formato
 * "thumbnail" é o que o Drive recomenda pra incorporar, e é o mesmo que o
 * backend do jogo já usa (função fixImg em empirePlayController.ts).
 * Converte qualquer link do Drive pra esse formato; outros links (não-Drive)
 * passam direto, sem alteração.
 */
export function resolverImagemDrive(url) {
  if (!url) return url;
  const match = url.match(/[-\w]{25,}/);
  if (!match || !url.includes('drive.google.com')) return url;
  return `https://drive.google.com/thumbnail?id=${match[0]}&sz=w1000`;
}

export async function carregar(nome) {
  const chaveCache = PREFIXO_CACHE + nome;
  try {
    const resposta = await fetch(caminhoPara(nome), { cache: 'no-store' });
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    const dados = await resposta.json();
    try {
      localStorage.setItem(chaveCache, JSON.stringify(dados));
    } catch {
      // localStorage cheio ou indisponível: segue sem cache
    }
    return dados;
  } catch (erro) {
    const cache = localStorage.getItem(chaveCache);
    if (cache) {
      console.warn(`dados.js: falha ao buscar "${nome}" (${erro.message}), usando cache local.`);
      return JSON.parse(cache);
    }
    console.error(`dados.js: falha ao buscar "${nome}" e não há cache local.`, erro);
    throw erro;
  }
}
