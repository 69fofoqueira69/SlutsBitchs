function itensDeMidia(midia) {
  const imagens = (midia.images || []).map((origem) => ({ tipo: 'imagem', origem }));
  const gifs = (midia.gifs || []).map((origem) => ({ tipo: 'gif', origem }));
  const videos = (midia.videos || []).map((origem) => ({ tipo: 'video', origem }));
  return [...imagens, ...gifs, ...videos];
}

function renderizarItemDoVisualizador(item) {
  if (item.tipo === 'video') {
    return `<video class="midia-visualizador-item" controls autoplay src="${item.origem}" aria-label="Vídeo"></video>`;
  }

  return `<img class="midia-visualizador-item" src="${item.origem}" alt="Mídia" loading="lazy">`;
}

function renderizarMiniatura(item, indice) {
  if (item.tipo === 'video') {
    return `
      <button class="midia-miniatura" data-indice="${indice}" aria-label="Abrir vídeo ${indice + 1}">
        <video muted playsinline preload="metadata" src="${item.origem}"></video>
        <span class="midia-etiqueta">Vídeo</span>
      </button>
    `;
  }

  const etiqueta = item.tipo === 'gif' ? '<span class="midia-etiqueta">GIF</span>' : '';
  return `
    <button class="midia-miniatura" data-indice="${indice}" aria-label="Abrir mídia ${indice + 1}">
      <img src="${item.origem}" alt="Miniatura ${indice + 1}" loading="lazy">
      ${etiqueta}
    </button>
  `;
}

export function renderizarGaleriaDeMidia(midia) {
  const itens = itensDeMidia(midia);
  const contagens = midia.counts || {
    images: (midia.images || []).length,
    videos: (midia.videos || []).length,
    gifs: (midia.gifs || []).length
  };

  if (!itens.length) {
    return '<p class="empty-state">Nenhuma mídia cadastrada.</p>';
  }

  return `
    <section class="grade-midia">
      <h2>Mídia</h2>
      <div class="contagens-midia">
        <p>Imagens: ${contagens.images}</p>
        <p>Vídeos: ${contagens.videos}</p>
        <p>GIFs: ${contagens.gifs}</p>
      </div>

      <div class="profile-media-grid" id="miniaturas-galeria">
        ${itens.map(renderizarMiniatura).join('')}
      </div>

      <dialog id="modal-galeria" class="modal-galeria" aria-hidden="true">
        <div class="caixa-galeria">
          <button id="galeria-anterior" class="controle-galeria" aria-label="Anterior">←</button>
          <div id="visualizador-galeria"></div>
          <button id="galeria-proximo" class="controle-galeria" aria-label="Próximo">→</button>
          <button id="galeria-fechar" class="fechar-galeria" aria-label="Fechar">×</button>
          <p id="contador-galeria" class="contador-galeria"></p>
        </div>
      </dialog>
    </section>
  `;
}

export function configurarGaleriaDeMidia(container, midia) {
  const itens = itensDeMidia(midia);
  if (!itens.length) return;

  let indiceAtual = 0;
  let toqueInicialX = 0;

  const modal = container.querySelector('#modal-galeria');
  const visualizador = container.querySelector('#visualizador-galeria');
  const contador = container.querySelector('#contador-galeria');

  function renderizarAtual() {
    visualizador.innerHTML = renderizarItemDoVisualizador(itens[indiceAtual]);
    contador.textContent = `${indiceAtual + 1} / ${itens.length}`;
  }

  function abrirModal(indice = 0) {
    indiceAtual = indice;
    modal.classList.add('aberto');
    modal.setAttribute('aria-hidden', 'false');
    renderizarAtual();
  }

  function fecharModal() {
    modal.classList.remove('aberto');
    modal.setAttribute('aria-hidden', 'true');
  }

  function proximo() {
    indiceAtual = (indiceAtual + 1) % itens.length;
    renderizarAtual();
  }

  function anterior() {
    indiceAtual = (indiceAtual - 1 + itens.length) % itens.length;
    renderizarAtual();
  }

  container.querySelectorAll('.midia-miniatura').forEach((miniatura) => {
    miniatura.addEventListener('click', () => {
      abrirModal(Number(miniatura.dataset.indice));
    });
  });

  container.querySelector('#galeria-fechar').addEventListener('click', fecharModal);
  container.querySelector('#galeria-proximo').addEventListener('click', proximo);
  container.querySelector('#galeria-anterior').addEventListener('click', anterior);

  document.addEventListener('keydown', (evento) => {
    if (!modal.classList.contains('aberto')) return;
    if (evento.key === 'Escape') fecharModal();
    if (evento.key === 'ArrowRight') proximo();
    if (evento.key === 'ArrowLeft') anterior();
  });

  modal.addEventListener('click', (evento) => {
    if (evento.target === modal) fecharModal();
  });

  modal.addEventListener('touchstart', (evento) => {
    toqueInicialX = evento.changedTouches[0].clientX;
  });

  modal.addEventListener('touchend', (evento) => {
    const deslocamento = evento.changedTouches[0].clientX - toqueInicialX;
    if (Math.abs(deslocamento) < 40) return;
    if (deslocamento < 0) proximo();
    else anterior();
  });
}
