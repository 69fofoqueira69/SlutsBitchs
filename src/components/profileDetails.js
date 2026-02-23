import { renderMediaGallery, setupMediaGallery } from './mediaGallery.js';

function renderList(items) {
  return `<ul class="chips">${(items || [])
    .map((item) => `<li>${item}</li>`)
    .join('')}</ul>`;
}

function labelize(value) {
  return value
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/^./, (char) => char.toUpperCase());
}

function formatMeasurement(label, item) {
  if (!item) return '';

  return `
    <div>
      <dt>${label}</dt>
      <dd>
        ${item.value} ${item.unit || ''} · 
        <span class="tag-inline">${item.tag || ''}</span> 
        ${item.emoji || ''} 
        ${item.range ? `· ${item.range}` : ''}
      </dd>
    </div>
  `;
}

function renderConditionalMeasurements(profile) {
  const blocks = [];

  if (
    ['Mulher', 'Futanari'].includes(profile.gender) &&
    profile.computedMeasurements?.chest
  ) {
    blocks.push(
      formatMeasurement('Peito', profile.computedMeasurements.chest)
    );
  }

  if (!blocks.length) {
    return '<p class="empty-state">Sem medidas condicionais para este gênero/tipo.</p>';
  }

  return `<dl class="info-grid">${blocks.join('')}</dl>`;
}

function setupProfileRotation(container, profile) {
  const imageList = profile.profileImage?.images || [];
  if (!profile.profileImage?.rotation || imageList.length <= 1) return;

  const avatar = container.querySelector('.profile-avatar');
  if (!avatar) return;

  let index = 0;

  setInterval(() => {
    index = (index + 1) % imageList.length;
    avatar.src = imageList[index];
  }, 3000);
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
      <img 
        class="profile-avatar" 
        src="${profile.media?.cover || ''}" 
        alt="Foto principal de ${profile.name}" 
      />
      <div>
        <h1>${profile.name}</h1>
        <p class="subtitle">${profile.title || ''}</p>
        <p>${profile.shortDescription || profile.description || ''}</p>

        <ul class="chips">
          ${profile.gender ? `<li>Gênero: ${profile.gender}</li>` : ''}
          ${
            profile.age
              ? `<li>Idade: ${profile.age.value} · ${profile.age.tag || ''} ${
                  profile.age.emoji || ''
                } ${profile.age.range ? `· ${profile.age.range}` : ''}</li>`
              : ''
          }
          ${profile.universe ? `<li>Universo: ${profile.universe}</li>` : ''}
        </ul>
      </div>
    </header>

    ${
      profile.heightMeters ||
      profile.weightKg ||
      profile.species ||
      profile.hairColor ||
      profile.eyeColor ||
      profile.skinColor
        ? `
      <section>
        <h2>Detalhes físicos básicos</h2>
        <dl class="info-grid">
          ${
            profile.heightMeters
              ? `<div><dt>Altura</dt><dd>${profile.heightMeters.toFixed(
                  2
                )} m</dd></div>`
              : ''
          }
          ${
            profile.weightKg
              ? `<div><dt>Peso</dt><dd>${profile.weightKg} Kg</dd></div>`
              : ''
          }
          ${
            profile.species
              ? `<div><dt>Espécie</dt><dd>${profile.species}</dd></div>`
              : ''
          }
          ${
            profile.hairColor
              ? `<div><dt>Cabelo</dt><dd>${profile.hairColor} ${
                  profile.hairStyle ? `· ${profile.hairStyle}` : ''
                }</dd></div>`
              : ''
          }
          ${
            profile.eyeColor
              ? `<div><dt>Olhos</dt><dd>${profile.eyeColor}</dd></div>`
              : ''
          }
          ${
            profile.skinColor
              ? `<div><dt>Pele</dt><dd>${profile.skinColor}</dd></div>`
              : ''
          }
        </dl>
      </section>
    `
        : ''
    }

    ${
      profile.computedMeasurements
        ? `
      <section>
        <h2>Medidas</h2>
        <dl class="info-grid">
          ${formatMeasurement('Bunda', profile.computedMeasurements.hips)}
          ${formatMeasurement('Cintura', profile.computedMeasurements.waist)}
          ${formatMeasurement('Coxas', profile.computedMeasurements.thighs)}
        </dl>

        <h3>Medidas condicionais</h3>
        ${renderConditionalMeasurements(profile)}
      </section>
    `
        : ''
    }

    ${
      profile.attributes || profile.categories || profile.tags
        ? `
      <section>
        <h2>Características</h2>
        <h3>Atributos</h3>
        ${renderList(profile.attributes)}
        <h3>Categorias</h3>
        ${renderList(profile.categories)}
        <h3>Tags</h3>
        ${renderList(profile.tags)}
      </section>
    `
        : ''
    }

    ${renderMediaGallery(profile.media || {})}

    ${
      profile.extraContent
        ? `
      <section>
        <h2>Conteúdo adicional</h2>
        <div class="extra-content">
          ${renderExtraContent(profile.extraContent)}
        </div>
      </section>
    `
        : ''
    }
  `;

  setupMediaGallery(container, profile.media || {});
  setupProfileRotation(container, profile);
}