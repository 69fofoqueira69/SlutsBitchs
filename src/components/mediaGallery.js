function mediaItems(media) {
  const images = (media.images || []).map((src) => ({ type: 'image', src }));
  const gifs = (media.gifs || []).map((src) => ({ type: 'gif', src }));
  const videos = (media.videos || []).map((src) => ({ type: 'video', src }));
  return [...images, ...gifs, ...videos];
}

function renderViewerItem(item) {
  if (item.type === 'video') {
    return `<video class="gallery-viewer-media" controls src="${item.src}" aria-label="Vídeo"></video>`;
  }
  const tag = item.type === 'gif' ? 'img' : 'img';  // GIFs são imagens animadas
  return `<${tag} class="gallery-viewer-media" src="${item.src}" alt="Mídia" loading="lazy">`;
}

export function renderMediaGallery(media) {
  const items = mediaItems(media);
  const counts = media.counts || {
    images: (media.images || []).length,
    videos: (media.videos || []).length,
    gifs: (media.gifs || []).length
  };

  const hasItems = items.length > 0;

  return `
    <section class="media-grid">
      <h2>Mídia</h2>
      <div class="media-counts">
        <p>Imagens: ${counts.images}</p>
        <p>Vídeos: ${counts.videos}</p>
        <p>GIFs: ${counts.gifs}</p>
      </div>
      ${hasItems ? '<button id="open-gallery" class="btn">Abrir Galeria</button>' : '<p class="empty-state">Nenhuma mídia cadastrada.</p>'}
      ${hasItems ? `
        <dialog id="gallery-modal" class="gallery-modal">
          <div class="gallery-dialog">
            <button id="gallery-prev" aria-label="Anterior">←</button>
            <button id="gallery-next" aria-label="Próximo">→</button>
            <div id="gallery-viewer"></div>
            <button id="gallery-close" aria-label="Fechar">×</button>
          </div>
        </dialog>
      ` : ''}
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
