import { getProfileById } from '../data/repository.js';

const profileRoot = document.getElementById('profile-root');

async function loadProfile() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id')?.trim();

  if (!id) {
    profileRoot.textContent = 'Perfil não especificado na URL.';
    return;
  }

  const profile = await getProfileById(id);

  if (!profile) {
    profileRoot.textContent = 'Perfil não encontrado.';
    return;
  }

  renderProfile(profile);
}

function renderProfile(profile) {
  profileRoot.innerHTML = `
    <div class="profile-card">
      <h1>${profile.name}</h1>
      <img src="${profile.image}" alt="${profile.name}" width="300" />
      <p>${profile.description}</p>
    </div>
  `;
}

loadProfile();
