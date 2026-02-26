function mediaItems(media) {
  const images = (media.images || []).map((src) => ({ type: 'image', src }));
  const gifs = (media.gifs || []).map((src) => ({ type: 'gif', src }));
  const videos = (media.videos || []).map((src) => ({ type: 'video', src }));
  return [...images, ...gifs, ...videos];
}

function renderViewerItem(item) {
  if (item.type === 'video') {
    return `<video class="gallery-viewer-media" controls autoplay src="${item.src}" aria-label="Vídeo"></video>`;
  }

  return `<img class="gallery-viewer-media" src="${item.src}" alt="Mídia" loading="lazy">`;
}

function renderThumbnail(item, index) {
  if (item.type === 'video') {
    return `
      <button class="media-thumb media-thumb-video" data-index="${index}" aria-label="Abrir vídeo ${index + 1}">
        <video muted playsinline preload="metadata" src="${item.src}"></video>
        <span class="media-badge">Vídeo</span>
      </button>
    `;
  }

  const badge = item.type === 'gif' ? '<span class="media-badge">GIF</span>' : '';
  return `
    <button class="media-thumb" data-index="${index}" aria-label="Abrir mídia ${index + 1}">
      <img src="${item.src}" alt="Miniatura ${index + 1}" loading="lazy">
      ${badge}
    </button>
  `;
}

export function renderMediaGallery(media) {
  const items = mediaItems(media);
  const counts = media.counts || {
    images: (media.images || []).length,
    videos: (media.videos || []).length,
    gifs: (media.gifs || []).length
  };

  if (!items.length) {
    return '<p class="empty-state">Nenhuma mídia cadastrada.</p>';
  }

  return `
    <section class="media-grid">
      <h2>Mídia</h2>
      <div class="media-counts">
        <p>Imagens: ${counts.images}</p>
        <p>Vídeos: ${counts.videos}</p>
        <p>GIFs: ${counts.gifs}</p>
      </div>

      <div class="profile-media-grid" id="gallery-thumbs">
        ${items.map(renderThumbnail).join('')}
      </div>

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

export function setupMediaGallery(container, media) {
  const items = mediaItems(media);
  if (!items.length) return;

  let currentIndex = 0;
  let touchStartX = 0;

  const modal = container.querySelector('#gallery-modal');
  const viewer = container.querySelector('#gallery-viewer');
  const counter = container.querySelector('#gallery-counter');

  function renderCurrent() {
    viewer.innerHTML = renderViewerItem(items[currentIndex]);
    counter.textContent = `${currentIndex + 1} / ${items.length}`;
  }

  function openModal(index = 0) {
    currentIndex = index;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    renderCurrent();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  function next() {
    currentIndex = (currentIndex + 1) % items.length;
    renderCurrent();
  }

  function prev() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    renderCurrent();
  }

  container.querySelectorAll('.media-thumb').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      openModal(Number(thumb.dataset.index));
    });
  });

  container.querySelector('#gallery-close').addEventListener('click', closeModal);
  container.querySelector('#gallery-next').addEventListener('click', next);
  container.querySelector('#gallery-prev').addEventListener('click', prev);

  document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeModal();
    if (event.key === 'ArrowRight') next();
    if (event.key === 'ArrowLeft') prev();
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  modal.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].clientX;
  });

  modal.addEventListener('touchend', (event) => {
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) next();
    else prev();
  });
}
