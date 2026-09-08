// Baixa o catálogo da API do jogo e as planilhas do programa, e salva tudo em dados/.
// Node puro, sem dependências. Rodar com: node scripts/sincronizar.mjs
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const raiz = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const caminhoConfig = path.join(raiz, 'config', 'fontes.json');
const pastaDados = path.join(raiz, 'dados');
const pastaPrograma = path.join(pastaDados, 'programa');

function buscar(url) {
  return fetch(url, { headers: { accept: 'application/json,text/csv,*/*' } });
}

async function baixarEndpoint(nome, apiBase, caminho) {
  const url = `${apiBase}${caminho}`;
  try {
    const resposta = await buscar(url);
    if (!resposta.ok) {
      console.error(`[FALHOU] ${nome} — HTTP ${resposta.status} em ${url}`);
      return;
    }
    const corpo = await resposta.text();
    let dados;
    try {
      dados = JSON.parse(corpo);
    } catch {
      console.error(`[FALHOU] ${nome} — resposta não é JSON válido (${url})`);
      return;
    }
    const destino = path.join(pastaDados, `${nome}.json`);
    await writeFile(destino, JSON.stringify(dados, null, 2), 'utf8');
    const quantidade = Array.isArray(dados) ? dados.length : Object.keys(dados ?? {}).length;
    console.log(`[OK] ${nome} — ${quantidade} registro(s) salvos em dados/${nome}.json`);
  } catch (erro) {
    console.error(`[FALHOU] ${nome} — ${erro.message} (${url})`);
  }
}

// Conversor de CSV simples: assume vírgula como separador e aspas duplas para escapar.
function csvParaJson(csv) {
  const linhas = csv.split(/\r\n|\n|\r/).filter((linha) => linha.length > 0);
  if (linhas.length === 0) return [];

  function dividirLinha(linha) {
    const campos = [];
    let atual = '';
    let dentroDeAspas = false;
    for (let i = 0; i < linha.length; i++) {
      const char = linha[i];
      if (char === '"') {
        if (dentroDeAspas && linha[i + 1] === '"') {
          atual += '"';
          i++;
        } else {
          dentroDeAspas = !dentroDeAspas;
        }
      } else if (char === ',' && !dentroDeAspas) {
        campos.push(atual);
        atual = '';
      } else {
        atual += char;
      }
    }
    campos.push(atual);
    return campos;
  }

  const cabecalho = dividirLinha(linhas[0]);
  return linhas.slice(1).map((linha) => {
    const valores = dividirLinha(linha);
    const registro = {};
    cabecalho.forEach((chave, indice) => {
      registro[chave] = valores[indice] ?? '';
    });
    return registro;
  });
}

async function baixarAbaPrograma(nomeAba, urlCsv) {
  if (!urlCsv || urlCsv.trim() === '') {
    console.log(`[PULADO] programa/${nomeAba} — URL de CSV não configurada em config/fontes.json`);
    return;
  }
  try {
    const resposta = await buscar(urlCsv);
    if (!resposta.ok) {
      console.error(`[FALHOU] programa/${nomeAba} — HTTP ${resposta.status} em ${urlCsv}`);
      return;
    }
    const csv = await resposta.text();
    const dados = csvParaJson(csv);
    const destino = path.join(pastaPrograma, `${nomeAba}.json`);
    await writeFile(destino, JSON.stringify(dados, null, 2), 'utf8');
    console.log(`[OK] programa/${nomeAba} — ${dados.length} registro(s) salvos em dados/programa/${nomeAba}.json`);
  } catch (erro) {
    console.error(`[FALHOU] programa/${nomeAba} — ${erro.message} (${urlCsv})`);
  }
}

async function main() {
  await mkdir(pastaDados, { recursive: true });
  await mkdir(pastaPrograma, { recursive: true });

  const config = JSON.parse(await readFile(caminhoConfig, 'utf8'));
  const { apiBase, endpoints, programa } = config;

  console.log(`Sincronizando a partir de ${apiBase}...\n`);

  for (const [nome, caminho] of Object.entries(endpoints)) {
    await baixarEndpoint(nome, apiBase, caminho);
  }

  console.log('\nSincronizando planilhas do programa...\n');

  for (const [nomeAba, urlCsv] of Object.entries(programa)) {
    await baixarAbaPrograma(nomeAba, urlCsv);
  }

  console.log('\nSincronização concluída.');
}

main();
