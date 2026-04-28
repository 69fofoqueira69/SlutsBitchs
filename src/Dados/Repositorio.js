let cachePerfis = null;

async function carregarBasePerfis() {
  if (cachePerfis) return cachePerfis;

  const resposta = await fetch('./src/data/perfis.json');
  if (!resposta.ok) throw new Error('Não foi possível carregar src/data/perfis.json');

  cachePerfis = await resposta.json();
  return cachePerfis;
}

function separarMidias(midias = []) {
  const imagens = midias.filter((item) => item?.tipo === 'imagem' && item?.completo).map((item) => item.completo);
  const gifs = midias.filter((item) => item?.tipo === 'gif' && item?.completo).map((item) => item.completo);
  return { imagens, gifs };
}

function normalizarPerfil(perfil) {
  const { imagens, gifs } = separarMidias(perfil.midias);
  const fotoPrincipal = imagens[0] || gifs[0] || '';

  return {
    id: perfil.id,
    nome: perfil.nome,
    titulo: perfil.titulo,
    idade: perfil.idade,
    biografia: perfil.biografia,
    midia: { imagens, gifs, fotoPrincipal },
    textoPesquisavel: [perfil.nome, perfil.titulo, perfil.biografia].filter(Boolean).join(' ').toLowerCase()
  };
}

export async function buscarPerfils() {
  const basePerfis = await carregarBasePerfis();
  return basePerfis.map(normalizarPerfil);
}

export async function buscarPerfilPorId(id) {
  if (!id) return null;
  const perfils = await buscarPerfils();
  return perfils.find((perfil) => perfil.id === id) || null;
}
