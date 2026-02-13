import { renderMediaGallery } from './mediaGallery.js';

function renderList(items) {
  return `<ul class="chips">${(items || []).map((item) => `<li>${item}</li>`).join('')}</ul>`;
}

function labelize(value) {
  return value
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/^./, (char) => char.toUpperCase());
}

function renderExtraContent(extraContent = {}) {
  const sections = Object.entries(extraContent)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `
          <article>
            <h3>${labelize(key)}</h3>
            <ul>${value.map((item) => `<li>${item}</li>`).join('')}</ul>
          </article>
        `;
      }

      if (typeof value === 'string') {
        return `
          <article>
            <h3>${labelize(key)}</h3>
            <p>${value}</p>
          </article>
        `;
      }

      return '';
    })
    .join('');

  return sections || '<p class="empty-state">Sem conteúdo adicional cadastrado.</p>';
}

export function renderProfileDetails(container, profile) {
  if (!profile) {
    container.innerHTML = `
      <a href="./index.html" class="link">← Voltar</a>
      <p>Perfil não encontrado.</p>
    `;
    return;
  }

  container.innerHTML = `
    <a href="./index.html" class="link">← Voltar ao catálogo</a>

    <header class="profile-header">
      <img src="${profile.media.cover}" alt="Foto principal de ${profile.name}" />
      <div>
        <h1>${profile.name}</h1>
        <p class="subtitle">${profile.title}</p>
        <p>${profile.description}</p>
      </div>
    </header>

    <section>
      <h2>Características</h2>
      <h3>Atributos</h3>
      ${renderList(profile.attributes)}
      <h3>Categorias</h3>
      ${renderList(profile.categories)}
      <h3>Tags</h3>
      ${renderList(profile.tags)}
    </section>

    <section>
      <h2>Informações pessoais</h2>
      <dl class="info-grid">
        ${Object.entries(profile.personalInfo)
          .map(([key, value]) => `<div><dt>${labelize(key)}</dt><dd>${value}</dd></div>`)
          .join('')}
      </dl>
    </section>

    ${renderMediaGallery(profile.media)}

    <section>
      <h2>Conteúdo extensível</h2>
      <p>Esta seção renderiza automaticamente novos blocos adicionados em <code>extraContent</code>.</p>
      <div class="extra-content">${renderExtraContent(profile.extraContent)}</div>
    </section>
  `;
}
