function mediaItems(media) {
  const images = (media.images || []).map((src) => ({ type: 'image', src }));
  const gifs = (media.gifs || []).map((src) => ({ type: 'image', src }));
  const videos = (media.videos || []).map((src) => ({ type: 'video', src }));
  return [...images, ...gifs, ...videos];
}

function renderViewerItem(item) {
  if (item.type === 'video') {
    return `
      <video controls preload="metadata" class="gallery-viewer-media">
        <source src="${item.src}" type="video/mp4" />
      </video>
    `;
  }

  return `<img class="gallery-viewer-media" src="${item.src}" alt="Mídia do perfil" />`;
}

export function renderMediaGallery(media) {
  const items = mediaItems(media);
  const counts = media.counts || {
    images: (media.images || []).length,
    videos: (media.videos || []).length,
    gifs: (media.gifs || []).length
  };

  if (!items.length) {
    return '<section><h2>Mídia</h2><p class="empty-state">Nenhuma mídia cadastrada.</p></section>';
  }

  return `
    <section>
      <h2>Mídia</h2>
      <div class="media-counts">
        <span>Imagens: ${counts.images}</span>
        <span>Vídeos: ${counts.videos}</span>
        <span>GIFs: ${counts.gifs}</span>
      </div>
      <button id="open-gallery" class="btn" type="button">Abrir Galeria</button>
      <div id="gallery-modal" class="gallery-modal" aria-hidden="true">
        <div class="gallery-dialog">
          <button id="gallery-close" class="btn ghost" type="button">Fechar</button>
          <button id="gallery-prev" class="btn ghost" type="button">◀</button>
          <div id="gallery-viewer"></div>
          <button id="gallery-next" class="btn ghost" type="button">▶</button>
        </div>
      </div>
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

  function renderCurrent() {
    viewer.innerHTML = renderViewerItem(items[currentIndex]);
  }

  function openModal() {
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

  container.querySelector('#open-gallery').addEventListener('click', openModal);
  container.querySelector('#gallery-close').addEventListener('click', closeModal);
  container.querySelector('#gallery-next').addEventListener('click', next);
  container.querySelector('#gallery-prev').addEventListener('click', prev);

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
