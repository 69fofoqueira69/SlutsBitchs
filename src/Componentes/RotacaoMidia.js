// Valida se o caminho da imagem existe e não termina com '/'.
function caminhoValido(src) {
  return typeof src === 'string' && src.trim() && !src.trim().endsWith('/');
}

// Procura a primeira imagem válida da lista.
function primeiraImagemValida(midia = {}) {
  const imagens = (midia.imagens || []).filter(caminhoValido);
  return imagens[0] || '';
}

// Seleciona capa para o card do menu.
export function buscarFotoMenu(midia = {}) {
  if (caminhoValido(midia.fotoMenu)) return midia.fotoMenu;
  if (caminhoValido(midia.fotoPrincipal)) return midia.fotoPrincipal;
  return primeiraImagemValida(midia);
}

// Seleciona imagem principal da página de perfil.
export function buscarFotoPerfil(midia = {}) {
  if (caminhoValido(midia.fotoPerfil)) return midia.fotoPerfil;
  if (caminhoValido(midia.fotoPrincipal)) return midia.fotoPrincipal;
  return primeiraImagemValida(midia);
}
