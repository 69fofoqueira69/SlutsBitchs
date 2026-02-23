import { renderMediaGallery, setupMediaGallery } from './mediaGallery.js';

function renderList(items) {
  if (!items?.length) return '<p>Nenhum item listado.</p>';
  return `
    <ul>
      ${items.map((item) => `<li>${item}</li>`).join('')}
    </ul>
  `;
}

function formatMeasurement(label, item) {
  if (!item) return '';
  return `
    <dt>${label}</dt>
    <dd>${item.value} ${item.unit} · <span class="tag-inline">${item.tag}</span> ${item.emoji}</dd>
  `;
}

function renderConditionalMeasurements(profile) {
  const blocks = [];

  if (['Mulher', 'Futanari'].includes(profile.gender) && profile.computedMeasurements.chest) {
    blocks.push(formatMeasurement('Peito', profile.computedMeasurements.chest));
  }

  if (blocks.length === 0) {
    return '<p class="empty-state">Sem medidas condicionais para este gênero/tipo.</p>';
  }

  return `
    <dl class="info-grid">
      ${blocks.join('')}
    </dl>
  `;
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

export function renderProfileDetails(container, profile) {
  if (!profile) {
    container.innerHTML = `
      <a href="./index.html" class="link">[← Voltar]</a>
      <h2>Perfil não encontrado.</h2>
    `;
    return;
  }

  const measurements = profile.computedMeasurements || {};

  container.innerHTML = `
    <a href="./index.html" class="link">[← Voltar ao catálogo]</a>
    <header class="profile-header">
      <img class="profile-avatar" src="${profile.profileImage.images[0]}" alt="${profile.name}" loading="lazy">
      <div>
        <h1>${profile.name}</h1>
        <p>${profile.title}</p>
        <p>${profile.shortDescription}</p>
        <dl class="info-grid">
          <dt>Gênero</dt><dd>${profile.gender}</dd>
          <dt>Idade</dt><dd>${profile.age.value} · <span class="tag-inline">${profile.age.tag}</span> ${profile.age.emoji}</dd>
          <dt>Universo</dt><dd>${profile.universe}</dd>
        </dl>
      </div>
    </header>
    <section>
      <h2>Breve descrição</h2>
      <p>${profile.shortDescription}</p>
    </section>
    <section>
      <h2>Detalhes físicos básicos</h2>
      <dl class="info-grid">
        <dt>Altura</dt><dd>${profile.heightMeters.toFixed(2)} m</dd>
        <dt>Peso</dt><dd>${profile.weightKg} Kg</dd>
        <dt>Espécie</dt><dd>${profile.species}</dd>
        <dt>Cabelo</dt><dd>${profile.hairColor} · ${profile.hairStyle}</dd>
        <dt>Olhos</dt><dd>${profile.eyeColor}</dd>
        <dt>Pele</dt><dd>${profile.skinColor}</dd>
      </dl>
    </section>
    <section>
      <h2>Medidas e condição</h2>
      <dl class="info-grid">
        ${formatMeasurement('Bunda', measurements.hips)}
        ${formatMeasurement('Cintura', measurements.waist)}
        ${formatMeasurement('Coxas', measurements.thighs)}
      </dl>
      <h3>Medidas condicionais</h3>
      ${renderConditionalMeasurements(profile)}
    </section>
    <section>
      <h2>Experiência</h2>
      <dl class="info-grid">
        <dt>Parceiros(as)</dt><dd>${profile.experience.partnersCount}</dd>
        <dt>Encontros</dt><dd>${profile.experience.encountersCount}</dd>
      </dl>
    </section>
    <section>
      <h2>Preferências e estilo</h2>
      <p><strong>Posição favorita:</strong> ${profile.favoritePosition}</p>
      <p><strong>Roupa favorita:</strong> ${profile.favoriteOutfit}</p>
      <p><strong>Ocupação:</strong> ${profile.occupation}</p>
      <h3>Interesses</h3>
      ${renderList(profile.fetishes)}
    </section>
    <section>
      <h2>Descrição completa</h2>
      <p>${profile.fullDescription}</p>
    </section>
    ${renderMediaGallery(profile.media)}
    <section>
      <h2>Tags do perfil</h2>
      ${renderList(profile.tags)}
    </section>
  `;

  setupMediaGallery(container, profile.media);
  setupProfileRotation(container, profile);
}
