export function renderProfileCards(container, profiles) {
  if (!profiles.length) {
    container.innerHTML = '<p class="empty-state">Nenhum perfil encontrado.</p>';
    return;
  }

  container.innerHTML = `
    <div class="cards-grid">
      ${profiles
        .map((profile) => {
          const cover = profile.media.images[0] || '';
          return `
            <a href="./profile.html?id=${profile.id}" class="card-link" aria-label="Abrir perfil de ${profile.identity.name}">
              <article class="card">
                <img src="${cover}" alt="${profile.identity.name}" loading="lazy">
                <div class="card-body">
                  <h3>${profile.identity.name}</h3>
                  <p class="subtitle">${profile.shortDescription}</p>
                </div>
              </article>
            </a>
          `;
        })
        .join('')}
    </div>
  `;
}
