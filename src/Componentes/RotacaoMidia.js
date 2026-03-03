function listaMidias(midia = {}) {
  const valido = (src) => typeof src === 'string' && src.trim() && !src.trim().endsWith('/');
  const imagens = (midia.imagens || []).filter(valido);
  const gifs = (midia.gifs || []).filter(valido);
  return [...imagens, ...gifs];
}

function indiceAleatorio(maximo) {
  return Math.floor(Math.random() * maximo);
}

function configurarFallbackImagem(imagem, lista, estado) {
  const tentarProximaMidia = () => {
    if (!lista.length || estado.tentativas >= lista.length) return;

    estado.tentativas += 1;
    estado.indiceAtual = (estado.indiceAtual + 1) % lista.length;
    imagem.src = lista[estado.indiceAtual];
  };

  imagem.addEventListener('error', tentarProximaMidia);
  imagem.addEventListener('load', () => {
    estado.tentativas = 0;
  });
}

export function buscarMidiaInicialAleatoria(midia = {}) {
  const midias = listaMidias(midia);
  if (!midias.length) return '';

  return midias[indiceAleatorio(midias.length)];
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

    if (!lista.length) return;

    const estado = {
      indiceAtual: indiceAleatorio(lista.length),
      tentativas: 0
    };

    imagem.src = lista[estado.indiceAtual];
    configurarFallbackImagem(imagem, lista, estado);

    if (lista.length <= 1) return;

    const timer = setInterval(() => {
      estado.indiceAtual = (estado.indiceAtual + 1) % lista.length;
      imagem.src = lista[estado.indiceAtual];
    }, intervaloMs);

    timers.push(timer);
  });

  container.__rotacaoMidiaTimers = timers;
}
