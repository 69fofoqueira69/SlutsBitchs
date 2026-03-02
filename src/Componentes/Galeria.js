function itensMidia(midia) {
  const formatar = (tipo, src) => ({ tipo, src });
  const valido = (src) => typeof src === 'string' && src.trim() && !src.trim().endsWith('/');

  const imagens = (midia.imagens || []).filter(valido).map((src) => formatar('imagem', src));
  const gifs = (midia.gifs || []).filter(valido).map((src) => formatar('gif', src));
  const videos = (midia.videos || []).filter(valido).map((src) => formatar('video', src));

  return [...imagens, ...gifs, ...videos];
}

function embaralhar(array) {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function selecionarDestaques(itens, limite = 6) {
  if (itens.length <= limite) {
    return itens.map((item, indice) => ({ item, indiceOriginal: indice }));
  }

  return embaralhar(
    itens.map((item, indice) => ({ item, indiceOriginal: indice }))
  ).slice(0, limite);
}

function renderizarItemVisualizador(item) {
  if (item.tipo === 'video') {
    return `<video class="gallery-viewer-media" controls autoplay src="${item.src}" aria-label="Vídeo"></video>`;
  }

  return `<img class="gallery-viewer-media" src="${item.src}" alt="Mídia" loading="lazy">`;
}

function renderizarMiniatura(item, indice) {
  if (item.tipo === 'video') {
    return `
      <button class="media-thumb media-thumb-video" data-index="${indice}" aria-label="Abrir vídeo ${indice + 1}">
        <video muted playsinline preload="metadata" src="${item.src}"></video>
        <span class="media-badge">Vídeo</span>
      </button>
    `;
  }

  const emblema = item.tipo === 'gif' ? '<span class="media-badge">GIF</span>' : '';
  return `
    <button class="media-thumb" data-index="${indice}" aria-label="Abrir mídia ${indice + 1}">
      <img src="${item.src}" alt="Miniatura ${indice + 1}" loading="lazy">
      ${emblema}
    </button>
  `;
}

export function renderizarGaleria(midia) {
  const itens = itensMidia(midia);
  const itensPreview = itens.filter((item) => item.tipo !== 'video');
  const origemDestaques = itensPreview.length ? itensPreview : itens;
  const destaques = selecionarDestaques(origemDestaques);
  const contagens = midia.contagens || {
    imagens: (midia.imagens || []).length,
    videos: (midia.videos || []).length,
    gifs: (midia.gifs || []).length
  };

  if (!itens.length) {
    return '<p class="empty-state">Nenhuma mídia cadastrada.</p>';
  }

  return `
    <section class="media-grid">
      <h2>Mídia</h2>
      <div class="media-counts">
        <p>Imagens: ${contagens.imagens}</p>
        <p>Vídeos: ${contagens.videos}</p>
        <p>GIFs: ${contagens.gifs}</p>
      </div>

      <div class="profile-media-grid" id="gallery-thumbs">
        ${destaques.map(({ item, indiceOriginal }) => renderizarMiniatura(item, indiceOriginal)).join('')}
      </div>

      ${itens.length > destaques.length ? '<p class="media-note">Mostrando algumas mídias aleatórias. Abra qualquer item para navegar por todas.</p>' : ''}

      <dialog id="gallery-modal" class="gallery-modal" aria-hidden="true">
        <div class="gallery-dialog">
          <button id="gallery-prev" class="gallery-control" aria-label="Anterior">←</button>
          <div id="gallery-viewer"></div>
          <button id="gallery-next" class="gallery-control" aria-label="Próximo">→</button>
          <button id="gallery-close" class="gallery-close" aria-label="Fechar">×</button>
          <p id="gallery-counter" class="gallery-counter"></p>
        </div>
      </dialog>
    </section>
  `;
}

export function configurarGaleria(container, midia) {
  const itens = itensMidia(midia);
  if (!itens.length) return;

  let indiceAtual = 0;
  let toqueInicialX = 0;

  const modal = container.querySelector('#gallery-modal');
  const viewer = container.querySelector('#gallery-viewer');
  const counter = container.querySelector('#gallery-counter');

  function renderizarAtual() {
    viewer.innerHTML = renderizarItemVisualizador(itens[indiceAtual]);
    counter.textContent = `${indiceAtual + 1} / ${itens.length}`;
  }

  function abrirModal(indice = 0) {
    indiceAtual = indice;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    renderizarAtual();
  }

  function fecharModal() {
    modal.classList.remove('is-open');
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

  container.querySelectorAll('.media-thumb').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      abrirModal(Number(thumb.dataset.index));
    });
  });

  container.querySelector('#gallery-close').addEventListener('click', fecharModal);
  container.querySelector('#gallery-next').addEventListener('click', proximo);
  container.querySelector('#gallery-prev').addEventListener('click', anterior);

  document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('is-open')) return;
    if (event.key === 'Escape') fecharModal();
    if (event.key === 'ArrowRight') proximo();
    if (event.key === 'ArrowLeft') anterior();
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) fecharModal();
  });

  modal.addEventListener('touchstart', (event) => {
    toqueInicialX = event.changedTouches[0].clientX;
  });

  modal.addEventListener('touchend', (event) => {
    const delta = event.changedTouches[0].clientX - toqueInicialX;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) proximo();
    else anterior();
  });
}
