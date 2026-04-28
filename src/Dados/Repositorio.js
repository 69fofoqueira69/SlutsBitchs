import { calcularDadosIdade } from './Parametros.js';
import { personagens } from './Personagens.js';

function mapearSexoParaGenero(sexo) {
  if (sexo === 108) return 'Mulher';
  if (sexo === 109) return 'Homem';
  return 'Não informado';
}

function extrairIdade(idadeTexto) {
  const idadeNumerica = Number.parseInt(String(idadeTexto || '').match(/\d+/)?.[0] || '0', 10);
  return Number.isFinite(idadeNumerica) ? idadeNumerica : 0;
}

function separarMidias(midias = []) {
  const imagens = [];
  const gifs = [];

  for (const item of midias) {
    if (!item?.completo) continue;

    if (item.tipo === 'gif') {
      gifs.push(item.completo);
      continue;
    }

    if (item.tipo === 'imagem') {
      imagens.push(item.completo);
    }
  }

  return { imagens, gifs };
}

function normalizarPerfil(personagem) {
  const idadeValor = extrairIdade(personagem.idade);
  const idadeCalculada = calcularDadosIdade(idadeValor);
  const { imagens, gifs } = separarMidias(personagem.midias);
  const fotoPrincipal = imagens[0] || gifs[0] || '';

  return {
    id: personagem.id,
    identidade: {
      nome: personagem.nome,
      genero: mapearSexoParaGenero(personagem.sexo),
      universo: 'Realidade',
      idade: {
        value: idadeValor,
        tag: personagem.titulo || idadeCalculada.tag,
        range: idadeCalculada.range,
        emoji: idadeCalculada.emoji
      }
    },
    descricaoCurta: personagem.biografia,
    descricaoCompleta: personagem.biografia,
    detalhesFisicosBasicos: {
      altura: 'Não informado'
    },
    preferencias: {
      ocupacao: personagem.titulo || 'Não informado',
      fetiche: []
    },
    medidas: {},
    midia: {
      imagens,
      gifs,
      fotoPrincipal,
      fotoMenu: fotoPrincipal,
      fotoPerfil: fotoPrincipal
    },
    textoPesquisavel: [personagem.nome, personagem.titulo, personagem.biografia]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
  };
}

export function buscarMedidasVisiveis(perfil) {
  return Object.entries(perfil.medidas || {}).map(([chave, medida]) => ({ chave, ...medida }));
}

export async function buscarPerfils() {
  return personagens
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
