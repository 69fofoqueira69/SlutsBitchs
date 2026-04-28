function formatarItem(tipo, src) {
  return { tipo, src };
}

function srcValido(src) {
  return typeof src === 'string' && src.trim() && !src.trim().endsWith('/');
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

export function listarMidias(midia, comEmbaralhamento = true) {
  const imagens = (midia?.imagens || []).filter(srcValido).map((src) => formatarItem('imagem', src));
  const gifs = (midia?.gifs || []).filter(srcValido).map((src) => formatarItem('gif', src));
  const itens = [...imagens, ...gifs];

  return comEmbaralhamento ? embaralhar(itens) : itens;
}

function miniatura(item, indice) {
  const emblema = item.tipo === 'gif' ? '<span class="media-badge">GIF</span>' : '';
  return `
    <button class="media-thumb media-thumb-galeria" data-index="${indice}" aria-label="Abrir mídia ${indice + 1}">
      <img src="${item.src}" alt="Miniatura ${indice + 1}" loading="lazy">
      ${emblema}
    </button>
  `;
}

export function renderizarPaginaGaleria(container, perfil) {
  if (!perfil) {
    container.innerHTML = '<p class="empty-state">Perfil não encontrado.</p>';
    return;
  }

  const itens = listarMidias(perfil.midia, false);

  if (!itens.length) {
    container.innerHTML = `
      <a href="./Perfil.html?id=${perfil.id}" class="link">← Voltar para perfil</a>
      <p class="empty-state">Nenhuma mídia cadastrada.</p>
    `;
    return;
  }

  container.innerHTML = `
    <article class="pagina-galeria">
      <div class="acoes-perfil-topo">
        <a href="./Perfil.html?id=${perfil.id}" class="link">← Voltar</a>
      </div>

      <div class="layout-galeria-jogo">
        <section class="painel-thumbs-galeria">
          <h1>Galeria de ${perfil.identidade.nome}</h1>
          <div class="profile-media-grid profile-media-grid-galeria" id="gallery-thumbs-page">
            ${itens.map((item, indice) => miniatura(item, indice)).join('')}
          </div>
        </section>

        <section class="destaque-galeria" id="gallery-highlight">
          <img class="gallery-viewer-media" src="${itens[0].src}" alt="Mídia em destaque">
          <p class="gallery-counter" id="gallery-counter-page">1 / ${itens.length}</p>
        </section>
      </div>
    </article>
  `;
}

export function configurarPaginaGaleria(container) {
  const thumbs = [...container.querySelectorAll('.media-thumb-galeria')];
  const destaque = container.querySelector('#gallery-highlight .gallery-viewer-media');
  const contador = container.querySelector('#gallery-counter-page');

  if (!thumbs.length || !destaque || !contador) return;

  const total = thumbs.length;

  thumbs.forEach((thumb, indice) => {
    thumb.addEventListener('click', () => {
      const imagem = thumb.querySelector('img');
      if (!imagem?.src) return;

      destaque.src = imagem.src;
      contador.textContent = `${indice + 1} / ${total}`;
      thumbs.forEach((item) => item.classList.remove('is-active'));
      thumb.classList.add('is-active');
    });
  });

  thumbs[0].classList.add('is-active');
}
