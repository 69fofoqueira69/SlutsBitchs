import { getVisibleMeasurements } from '../data/repository.js';
import { renderMediaGallery, setupMediaGallery } from './mediaGallery.js';

const MEASUREMENT_LABELS = {
  ass: 'Bunda',
  waist: 'Cintura',
  thighs: 'Coxas',
  breasts: 'Peito',
  vagina: 'Buceta',
  anus: 'Cu',
  penisLength: 'Rola',
  penisGirth: 'Grossura da rola',
  ballsSize: 'Bolas'
};

function renderMeasurementItem(measurement) {
  return `
    <li>
      <span>${measurement.emoji || '📌'} ${MEASUREMENT_LABELS[measurement.key] || measurement.key}</span>
      <strong>${measurement.value} cm · ${measurement.tag || '—'}</strong>
    </li>
  `;
}

export function renderProfileDetails(container, profile) {
  if (!profile) {
    container.innerHTML = '<p class="empty-state">Perfil não encontrado.</p>';
    return;
  }

  const { identity, basicPhysicalDetails, preferences, sexualExperience, media } = profile;
  const measurements = getVisibleMeasurements(profile);

  container.innerHTML = `
    <a href="./index.html" class="link">← Voltar</a>
    <article class="tinder-profile six-block-layout">
      <section class="hero-section">
        <div class="tinder-hero">
          <img src="${media.images[0] || ''}" alt="${identity.name}">
          <div class="tinder-overlay">
            <h1>${identity.name}, ${identity.age.value}</h1>
            <p>${identity.gender} • ${identity.universe}</p>
          </div>
        </div>
      </section>

      <section class="about-section">
        <h2>Sobre mim</h2>
        <p>${profile.fullDescription}</p>
      </section>

      <section class="full-width">
        <h2>Detalhes básicos</h2>
        <ul class="detail-list">
          <li><span>Altura</span><strong>${basicPhysicalDetails.height}</strong></li>
          <li><span>Peso</span><strong>${basicPhysicalDetails.weight}</strong></li>
          <li><span>Espécie</span><strong>${basicPhysicalDetails.species}</strong></li>
          <li><span>Cabelo</span><strong>${basicPhysicalDetails.hairColor} · ${basicPhysicalDetails.hairStyle}</strong></li>
          <li><span>Olhos</span><strong>${basicPhysicalDetails.eyeColor}</strong></li>
          <li><span>Pele</span><strong>${basicPhysicalDetails.skinColor}</strong></li>
        </ul>
      </section>

      <section class="full-width">
        <h2>Medidas</h2>
        <ul class="detail-list">
          ${measurements.map(renderMeasurementItem).join('')}
        </ul>
      </section>

      <section class="full-width">
        <h2>Experiência e preferências</h2>
        <ul class="detail-list">
          <li><span>Experiências registradas</span><strong>${sexualExperience.sexCount}</strong></li>
          <li><span>Parceiros registrados</span><strong>${sexualExperience.experiencedPenises}</strong></li>
          <li><span>Posição favorita</span><strong>${preferences.favoritePosition}</strong></li>
          <li><span>Roupa favorita</span><strong>${preferences.favoriteClothing}</strong></li>
          <li><span>Ocupação</span><strong>${preferences.occupation}</strong></li>
          <li><span>Interesses</span><strong>${(preferences.fetish || []).join(', ') || '—'}</strong></li>
        </ul>
      </section>

      ${renderMediaGallery(media)}
    </article>
  `;

  setupMediaGallery(container, media);
}
