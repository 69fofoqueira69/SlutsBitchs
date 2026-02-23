export function renderProfileCards(container, profiles) {
  if (!profiles.length) {
    container.innerHTML = '<p class="empty-state">Nenhum perfil encontrado.</p>';
    return;
  }
  container.innerHTML = profiles
    .map((profile) => `
      <a href="./profile.html?id=${profile.id}" class="card-link">
        <div class="card">
          <img src="${profile.profileImage.images[0]}" alt="${profile.name}" loading="lazy">
          <div class="card-body">
            <h3>${profile.name}</h3>
            <p class="subtitle">${profile.title}</p>
            <ul class="chips">
              ${profile.tags.map((tag) => `<li>${tag}</li>`).join('')}
            </ul>
          </div>
        </div>
      </a>
    `)
    .join('');
}
