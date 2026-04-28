function caminhoValido(src) {
  return typeof src === 'string' && src.trim() && !src.trim().endsWith('/');
}

function primeiraImagemValida(midia = {}) {
  const imagens = (midia.imagens || []).filter(caminhoValido);
  return imagens[0] || '';
}

export function buscarFotoMenu(midia = {}) {
  if (caminhoValido(midia.fotoPrincipal)) return midia.fotoPrincipal;
  return primeiraImagemValida(midia);
}

export function buscarFotoPerfil(midia = {}) {
  if (caminhoValido(midia.fotoPrincipal)) return midia.fotoPrincipal;
  return primeiraImagemValida(midia);
}
