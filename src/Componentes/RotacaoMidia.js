function listaMidias(midia = {}) {
  const valido = (src) => typeof src === 'string' && src.trim() && !src.trim().endsWith('/');
  const imagens = (midia.imagens || []).filter(valido);
  const gifs = (midia.gifs || []).filter(valido);
  return [...imagens, ...gifs];
}

export function serializarMidias(midia) {
  return encodeURIComponent(JSON.stringify(listaMidias(midia)));
}

export function configurarRotacaoMidia(container, seletorImagem, intervaloMs = 2500) {
  const timersAnteriores = container.__rotacaoMidiaTimers || [];
  timersAnteriores.forEach((timer) => clearInterval(timer));

  const timers = [];

  container.querySelectorAll(seletorImagem).forEach((imagem) => {
    const lista = JSON.parse(decodeURIComponent(imagem.dataset.midias || '[]'));

    if (lista.length <= 1) return;

    let indiceAtual = 0;
    const timer = setInterval(() => {
      indiceAtual = (indiceAtual + 1) % lista.length;
      imagem.src = lista[indiceAtual];
    }, intervaloMs);

    timers.push(timer);
  });

  container.__rotacaoMidiaTimers = timers;
}
