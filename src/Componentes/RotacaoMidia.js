function valido(src) {
  return typeof src === 'string' && src.trim() && !src.trim().endsWith('/');
}

export function buscarMidiaInicialAleatoria(midia = {}) {
  if (valido(midia.fotoPrincipal)) return midia.fotoPrincipal;

  const imagens = (midia.imagens || []).filter(valido);
  return imagens[0] || '';
}
