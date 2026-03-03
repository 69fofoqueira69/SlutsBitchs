import { calcularDadosIdade, calcularDadosMedida } from './Parametros.js';

const CAMINHOS_DADOS = [
  new URL('./Perfils.json', import.meta.url).href,
  './src/Dados/Perfils.json',
  './src/data/Perfils.json'
];

async function carregarDadosPerfis() {
  let ultimoErro = null;

  for (const caminho of CAMINHOS_DADOS) {
    try {
      const resposta = await fetch(caminho);
      if (!resposta.ok) {
        ultimoErro = new Error(`Falha ao carregar perfis em ${caminho} (status ${resposta.status})`);
        continue;
      }

      return await resposta.json();
    } catch (erro) {
      ultimoErro = erro;
    }
  }

  throw ultimoErro || new Error('Falha ao carregar perfis');
}

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
      gifs: midia.gifs || [],
      fotoPrincipal: midia.fotoPrincipal || '',
      fotoMenu: midia.fotoMenu || '',
      fotoPerfil: midia.fotoPerfil || ''
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
  const dados = await carregarDadosPerfis();
  if (!Array.isArray(dados)) return [];

  return dados
    .map(normalizarPerfil)
    .sort((a, b) => (a.identidade?.nome || '').localeCompare((b.identidade?.nome || ''), 'pt-BR', {
      sensitivity: 'base'
    }));
}

export async function buscarPerfilPorId(id) {
  if (!id) return null;

  const perfils = await buscarPerfils();
  return perfils.find((perfil) => perfil.id === id) || null;
}
