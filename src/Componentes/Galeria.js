// Valida caminhos de mídia antes de renderizar no HTML.
function srcValido(src) {
  return typeof src === 'string' && src.trim() && !src.trim().endsWith('/');
}

// Converte um caminho simples para o formato padrão da galeria.
function formatarItem(tipo, src) {
  return { tipo, src };
}

// Cria a lista final de mídias sem embaralhar (ordem fixa e previsível).
function listarMidias(midia) {
  const imagens = (midia?.imagens || []).filter(srcValido).map((src) => formatarItem('imagem', src));
  const gifs = (midia?.gifs || []).filter(srcValido).map((src) => formatarItem('gif', src));
  return [...imagens, ...gifs];
}

// Template de um botão de miniatura da galeria.
function miniatura(item, indice) {
  const emblema = item.tipo === 'gif' ? '<span class="media-badge">GIF</span>' : '';

  return `
    <button class="media-thumb media-thumb-galeria" data-index="${indice}" aria-label="Abrir mídia ${indice + 1}">
      <img src="${item.src}" alt="Miniatura ${indice + 1}" loading="lazy">
      ${emblema}
    </button>
  `;
}

// Renderiza a página completa de galeria do perfil.
export function renderizarPaginaGaleria(container, perfil) {
  if (!perfil) {
    container.innerHTML = '<p class="empty-state">Perfil não encontrado.</p>';
    return;
  }

  const itens = listarMidias(perfil.midia);

  // Mensagem amigável quando não há mídias cadastradas.
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

// Conecta eventos para trocar a mídia em destaque ao clicar nas miniaturas.
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

  // Deixa o primeiro item marcado como ativo na abertura da tela.
  thumbs[0].classList.add('is-active');
}
