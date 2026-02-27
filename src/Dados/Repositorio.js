import { calcularDadosIdade, calcularDadosMedida } from './Parametros.js';

const CAMINHO_DADOS = './src/Dados/Perfils.json';

function deveExibirMedida(medida, genero) {
  const aplicaPara = medida?.appliesTo;
  if (!aplicaPara || !aplicaPara.length) return true;
  return aplicaPara.includes(genero);
}

function comMedidasCalculadas(perfil) {
  const saida = {};
  const entradas = Object.entries(perfil.medidas || {});

  for (const [chave, medida] of entradas) {
    const valor = Number(medida?.value ?? 0);
    const calculado = calcularDadosMedida(chave, valor);

    saida[chave] = {
      value: valor,
      tag: medida?.tag || calculado.tag,
      range: medida?.range || calculado.range,
      emoji: medida?.emoji || calculado.emoji,
      appliesTo: medida?.appliesTo || []
    };
  }

  return saida;
}

function normalizarPerfil(perfil) {
  const valorIdade = Number(perfil?.identidade?.idade?.value ?? 0);
  const idadeCalculada = calcularDadosIdade(valorIdade);
  const midia = perfil.midia || {};

  return {
    ...perfil,
    identidade: {
      ...perfil.identidade,
      idade: {
        value: valorIdade,
        tag: perfil?.identidade?.idade?.tag || idadeCalculada.tag,
        range: perfil?.identidade?.idade?.range || idadeCalculada.range,
        emoji: perfil?.identidade?.idade?.emoji || idadeCalculada.emoji
      }
    },
    medidas: comMedidasCalculadas(perfil),
    midia: {
      imagens: midia.imagens || [],
      videos: midia.videos || [],
      gifs: midia.gifs || [],
      contagens: {
        imagens: (midia.imagens || []).length,
        videos: (midia.videos || []).length,
        gifs: (midia.gifs || []).length
      }
    },
    textoPesquisavel: [
      perfil.identidade?.nome,
      perfil.identidade?.universo,
      perfil.descricaoCurta,
      perfil.descricaoCompleta,
      ...(perfil.preferencias?.fetiche || [])
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
  };
}

export function buscarMedidasVisiveis(perfil) {
  const genero = perfil.identidade?.genero;

  return Object.entries(perfil.medidas || {})
    .filter(([, medida]) => deveExibirMedida(medida, genero))
    .map(([chave, medida]) => ({ chave, ...medida }));
}

export async function buscarPerfils() {
  const resposta = await fetch(CAMINHO_DADOS);
  if (!resposta.ok) throw new Error('Falha ao carregar perfis');

  const dados = await resposta.json();
  if (!Array.isArray(dados)) return [];

  return dados.map(normalizarPerfil);
}

export async function buscarPerfilPorId(id) {
  if (!id) return null;

  const perfils = await buscarPerfils();
  return perfils.find((perfil) => perfil.id === id) || null;
}