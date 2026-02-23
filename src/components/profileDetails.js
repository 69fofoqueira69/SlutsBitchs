import { renderMediaGallery, setupMediaGallery } from './mediaGallery.js';

function renderList(items) {
  return `<ul class="chips">${(items || []).map((item) => `<li>${item}</li>`).join('')}</ul>`;
}

function formatMeasurement(label, item) {
  return `
    <div>
      <dt>${label}</dt>
      <dd>${item.value} ${item.unit} · <span class="tag-inline">${item.tag}</span> ${item.emoji}</dd>
    </div>
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
      <img class="profile-avatar" src="${profile.media.cover}" alt="Foto principal de ${profile.name}" />
      <div>
        <h1>${profile.name}</h1>
        <p class="subtitle">${profile.title}</p>
        <p>${profile.shortDescription}</p>
        <ul class="chips">
          <li>Gênero: ${profile.gender}</li>
          <li>Idade: ${profile.age.value} · ${profile.age.tag} ${profile.age.emoji}</li>
          <li>Universo: ${profile.universe}</li>
        </ul>
      </div>
    </header>

    <section>
      <h2>Breve descrição</h2>
      <p>${profile.shortDescription}</p>
    </section>

    <section>
      <h2>Detalhes físicos básicos</h2>
      <dl class="info-grid">
        <div><dt>Altura</dt><dd>${profile.heightMeters.toFixed(2)} m</dd></div>
        <div><dt>Peso</dt><dd>${profile.weightKg} Kg</dd></div>
        <div><dt>Espécie</dt><dd>${profile.species}</dd></div>
        <div><dt>Cabelo</dt><dd>${profile.hairColor} · ${profile.hairStyle}</dd></div>
        <div><dt>Olhos</dt><dd>${profile.eyeColor}</dd></div>
        <div><dt>Pele</dt><dd>${profile.skinColor}</dd></div>
      </dl>
    </section>

    <section>
      <h2>Medidas e condição</h2>
      <dl class="info-grid">
        ${formatMeasurement('Bunda', profile.computedMeasurements.hips)}
        ${formatMeasurement('Cintura', profile.computedMeasurements.waist)}
        ${formatMeasurement('Coxas', profile.computedMeasurements.thighs)}
      </dl>
      <h3>Medidas condicionais</h3>
      ${renderConditionalMeasurements(profile)}
    </section>

    <section>
      <h2>Experiência</h2>
      <dl class="info-grid">
        <div><dt>Parceiros(as)</dt><dd>${profile.experience.partnersCount}</dd></div>
        <div><dt>Encontros</dt><dd>${profile.experience.encountersCount}</dd></div>
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

   
  `;

  setupMediaGallery(container, profile.media);
  setupProfileRotation(container, profile);
}
