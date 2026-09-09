// Imprime no terminal o mesmo dossiê do Arquivo Gary que aparece no palco —
// serve pra Gary montar a pauta antes de gravar, sem precisar abrir o site.
// Usa exatamente a mesma lógica de js/quadros/arquivo-gary.js (nenhum código
// duplicado): se o palco encontra uma peça, o terminal encontra a mesma.
//
// Uso:
//   node scripts/dossie.mjs "Nome do Artista"
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { montarDossie } from "../js/quadros/arquivo-gary.js";

const raiz = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const pastaDados = path.join(raiz, "dados");

async function carregarJson(nome) {
  try {
    const conteudo = await readFile(path.join(pastaDados, `${nome}.json`), "utf8");
    return JSON.parse(conteudo);
  } catch {
    return [];
  }
}

async function main() {
  const nomeArtista = process.argv.slice(2).join(" ").trim();
  if (!nomeArtista) {
    console.error('Uso: node scripts/dossie.mjs "Nome do Artista"');
    process.exitCode = 1;
    return;
  }

  const [musicas, albuns, musicVideos, artistas, chartsHistorico, comentarios, certificacoes] = await Promise.all([
    carregarJson("musicas"),
    carregarJson("albuns"),
    carregarJson("musicVideos"),
    carregarJson("artistas"),
    carregarJson("chartsHistorico"),
    carregarJson("comentarios"),
    carregarJson("certificacoes"),
  ]);

  const dados = { musicas, albuns, musicVideos, artistas, chartsHistorico, comentarios, certificacoes };
  const dossie = montarDossie(nomeArtista, dados);

  if (!dossie.encontrado) {
    console.log(`\n${dossie.aviso}\n`);
    return;
  }

  console.log(`\n=== ARQUIVO GARY: ${dossie.artista} ===\n`);
  for (const peca of dossie.pecas) {
    console.log(`--- ${peca.titulo} ---`);
    if (!peca.disponivel) {
      console.log(`(indisponível: ${peca.motivo})\n`);
      continue;
    }
    console.log(`Dado principal: ${peca.dadoPrincipal}`);
    if (peca.contextoSecundario) console.log(`Contexto: ${peca.contextoSecundario}`);
    console.log("Registros brutos:");
    for (const registro of peca.registrosBrutos) {
      console.log(`  - ${registro}`);
    }
    console.log("");
  }
}

main();
