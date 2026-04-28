import { calcularDadosIdade } from './Parametros.js';

// Cache simples para evitar múltiplos fetches do mesmo JSON.
let cachePerfis = null;

// Carrega a base mock em JSON (fonte única de dados do projeto).
async function carregarBasePerfis() {
  if (cachePerfis) return cachePerfis;

  const resposta = await fetch('./src/data/perfis.json');
  if (!resposta.ok) throw new Error('Não foi possível carregar src/data/perfis.json');

  cachePerfis = await resposta.json();
  return cachePerfis;
}

// Converte o código numérico para o texto exibido na interface.
function mapearSexoParaGenero(sexo) {
  if (sexo === 108) return 'Mulher';
  if (sexo === 109) return 'Homem';
  return 'Não informado';
}

// Extrai apenas o número da idade, mesmo que venha com texto adicional.
function extrairIdade(idadeTexto) {
  const idadeNumerica = Number.parseInt(String(idadeTexto || '').match(/\d+/)?.[0] || '0', 10);
  return Number.isFinite(idadeNumerica) ? idadeNumerica : 0;
}

// Separa mídias por tipo para facilitar o consumo pelos componentes.
function separarMidias(midias = []) {
  const imagens = [];
  const gifs = [];

  for (const item of midias) {
    if (!item?.completo) continue;
    if (item.tipo === 'gif') gifs.push(item.completo);
    if (item.tipo === 'imagem') imagens.push(item.completo);
  }

  return { imagens, gifs };
}

// Normaliza o objeto bruto de personagem para o formato padrão do app.
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
    // Campo auxiliar para busca textual no menu.
    textoPesquisavel: [personagem.nome, personagem.titulo, personagem.biografia]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
  };
}

// Retorna todos os perfis ordenados por nome.
export async function buscarPerfils() {
  const basePerfis = await carregarBasePerfis();

  return basePerfis
    .map(normalizarPerfil)
    .sort((a, b) => (a.identidade?.nome || '').localeCompare((b.identidade?.nome || ''), 'pt-BR', {
      sensitivity: 'base'
    }));
}

// Retorna um único perfil pelo id da URL.
export async function buscarPerfilPorId(id) {
  if (!id) return null;

  const perfils = await buscarPerfils();
  return perfils.find((perfil) => perfil.id === id) || null;
}
