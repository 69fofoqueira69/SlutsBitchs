export function renderizarCards(container, perfils) {
  if (!perfils.length) {
    container.innerHTML = '<p class="empty-state">Nenhum perfil encontrado.</p>';
    return;
  }

  container.innerHTML = `
    <div class="cards-grid">
      ${perfils
        .map((perfil) => {
          const capa = perfil.midia.imagens[0] || '';
          return `
            <a href="./Perfil.html?id=${perfil.id}" class="card-link" aria-label="Abrir perfil de ${perfil.identidade.nome}">
              <article class="card">
                <img src="${capa}" alt="${perfil.identidade.nome}" loading="lazy">
                <div class="card-body">
                  <h3>${perfil.identidade.nome}</h3>
                  <p class="subtitle">${perfil.descricaoCurta}</p>
                </div>
              </article>
            </a>
          `;
        })
        .join('')}
    </div>
  `;
}
