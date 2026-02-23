export function renderProfileCards(container, profiles) {
  if (!profiles.length) {
    container.innerHTML = '<p class="empty-state">Nenhum perfil encontrado.</p>';
    return;
  }

  container.innerHTML = profiles
    .map(
      (profile) => `
        <article class="card">
          <a class="card-link" href="./profile.html?id=${profile.id}" aria-label="Abrir perfil de ${profile.name}">
            <img src="${profile.media.cover}" alt="Foto principal de ${profile.name}" />
            <div class="card-content">
              <h2>${profile.name}</h2>
              <p>${profile.shortDescription}</p>
            </div>
          </a>
        </article>
      `
    )
    .join('');
}
