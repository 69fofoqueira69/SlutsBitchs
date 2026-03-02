function itensMidia(midia) {
  const formatar = (tipo, src) => ({ tipo, src });
  const valido = (src) => typeof src === 'string' && src.trim() && !src.trim().endsWith('/');

  const imagens = (midia.imagens || []).filter(valido).map((src) => formatar('imagem', src));
  const gifs = (midia.gifs || []).filter(valido).map((src) => formatar('gif', src));

  return [...imagens, ...gifs];
}

function embaralhar(array) {
  const copia = [...array];

  for (let i = copia.length - 1; i > 0; i -= 1) {
    const randomBuffer = new Uint32Array(1);
    crypto.getRandomValues(randomBuffer);
    const j = randomBuffer[0] % (i + 1);
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }

  return copia;
}

function selecionarDestaques(itens, limite = 6) {
  return itens.slice(0, limite);
}

function renderizarItemVisualizador(item) {
  return `<img class="gallery-viewer-media" src="${item.src}" alt="Mídia" loading="lazy">`;
}

function renderizarMiniatura(item, indice) {
  const emblema = item.tipo === 'gif' ? '<span class="media-badge">GIF</span>' : '';
  return `
    <button class="media-thumb" data-index="${indice}" aria-label="Abrir mídia ${indice + 1}">
      <img src="${item.src}" alt="Miniatura ${indice + 1}" loading="lazy">
      ${emblema}
    </button>
  `;
}

export function renderizarGaleria(midia) {
  const itens = embaralhar(itensMidia(midia));
  const destaques = selecionarDestaques(itens);
  const totalMidias = itens.length;
  const itensSerializados = encodeURIComponent(JSON.stringify(itens));

  if (!itens.length) {
    return '<p class="empty-state">Nenhuma mídia cadastrada.</p>';
  }

  return `
    <section class="media-grid">
      <h2>Mídia</h2>
      <div class="media-counts">
        <p>Total de mídias: ${totalMidias}</p>
      </div>

      <div class="profile-media-grid" id="gallery-thumbs">
        ${destaques.map((item, indice) => renderizarMiniatura(item, indice)).join('')}
      </div>

      ${itens.length > destaques.length ? '<p class="media-note">Mostrando algumas mídias. Abra qualquer item para navegar por todas.</p>' : ''}

      <dialog id="gallery-modal" class="gallery-modal" aria-hidden="true" data-items="${itensSerializados}">
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

export function configurarGaleria(container) {
  const modal = container.querySelector('#gallery-modal');
  if (!modal) return;

  let itens = [];

  try {
    itens = JSON.parse(decodeURIComponent(modal.dataset.items || '[]'));
  } catch {
    itens = [];
  }

  if (!itens.length) return;

  let indiceAtual = 0;
  let toqueInicialX = 0;

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
