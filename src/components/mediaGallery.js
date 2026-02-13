function renderMediaSection(title, items, renderer) {
  if (!items?.length) {
    return '';
  }

  return `
    <section>
      <h2>${title}</h2>
      <div class="media-grid">
        ${items.map(renderer).join('')}
      </div>
    </section>
  `;
}

export function renderMediaGallery(media) {
  const images = renderMediaSection('Galeria de imagens', media.images, (image) => {
    return `<img src="${image}" alt="Imagem do perfil" loading="lazy" />`;
  });

  const videos = renderMediaSection('Vídeos', media.videos, (video) => {
    return `
      <video controls preload="metadata">
        <source src="${video}" type="video/mp4" />
        Seu navegador não suporta vídeo.
      </video>
    `;
  });

  const gifs = renderMediaSection('GIFs', media.gifs, (gif) => {
    return `<img src="${gif}" alt="GIF do perfil" loading="lazy" />`;
  });

  return images || videos || gifs
    ? `${images}${videos}${gifs}`
    : '<section><h2>Mídia</h2><p class="empty-state">Nenhuma mídia cadastrada.</p></section>';
}
