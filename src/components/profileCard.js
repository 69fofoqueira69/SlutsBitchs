export function renderProfileCards(container, profiles) {
  if (!profiles.length) {
    container.innerHTML = '<p class="empty-state">Nenhum perfil encontrado para os critérios selecionados.</p>';
    return;
  }

  container.innerHTML = profiles
    .map(
      (profile) => `
      <article class="card">
        <img src="${profile.media.cover}" alt="Foto principal de ${profile.name}" />
        <div class="card-body">
          <h3>${profile.name}</h3>
          <p class="subtitle">${profile.title}</p>
          <p>${profile.shortDescription}</p>
          <ul class="chips">
            ${profile.attributes.slice(0, 3).map((attribute) => `<li>${attribute}</li>`).join('')}
          </ul>
          <a class="btn" href="./profile.html?id=${profile.id}">Ver perfil completo</a>
        </div>
      </article>
    `
    )
    .join('');
}
