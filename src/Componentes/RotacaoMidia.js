function valido(src) {
  return typeof src === 'string' && src.trim() && !src.trim().endsWith('/');
}

function buscarPrimeiraImagemValida(midia = {}) {
  const imagens = (midia.imagens || []).filter(valido);
  return imagens[0] || '';
}

export function buscarFotoCapa(midia = {}) {
  if (valido(midia.fotoCapa)) return midia.fotoCapa;

  return buscarPrimeiraImagemValida(midia);
}

export function buscarMidiaInicialAleatoria(midia = {}) {
  return buscarFotoCapa(midia);
}
