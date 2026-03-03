function listaMidias(midia = {}) {
  const valido = (src) => typeof src === 'string' && src.trim() && !src.trim().endsWith('/');
  const imagens = (midia.imagens || []).filter(valido);
  const gifs = (midia.gifs || []).filter(valido);
  return [...imagens, ...gifs];
}

function fotoPrincipal(midia = {}) {
  const valido = (src) => typeof src === 'string' && src.trim() && !src.trim().endsWith('/');

  if (valido(midia.fotoPrincipal)) return midia.fotoPrincipal;

  const imagens = (midia.imagens || []).filter(valido);
  if (imagens.length) return imagens[0];

  const midias = listaMidias(midia);
  return midias[0] || '';
}

export function buscarMidiaInicialAleatoria(midia = {}) {
  return fotoPrincipal(midia);
}
