function valido(src) {
  return typeof src === 'string' && src.trim() && !src.trim().endsWith('/');
}

function buscarPrimeiraImagemValida(midia = {}) {
  const imagens = (midia.imagens || []).filter(valido);
  return imagens[0] || '';
}

export function buscarFotoMenu(midia = {}) {
  if (valido(midia.fotoMenu)) return midia.fotoMenu;
  if (valido(midia.fotoPrincipal)) return midia.fotoPrincipal;

  return buscarPrimeiraImagemValida(midia);
}

export function buscarFotoPerfil(midia = {}) {
  if (valido(midia.fotoPerfil)) return midia.fotoPerfil;
  if (valido(midia.fotoPrincipal)) return midia.fotoPrincipal;

  return buscarPrimeiraImagemValida(midia);
}

export function buscarMidiaInicialAleatoria(midia = {}) {
  return buscarFotoPerfil(midia);
}
