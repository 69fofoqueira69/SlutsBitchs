import { getProfileById } from '../data/repository.js';
import { renderProfileDetails } from '../components/profileDetails.js';

const profileRoot = document.getElementById('profile-root');

async function init() {
  try {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
      profileRoot.innerHTML = '<p class="empty-state">Perfil não especificado.</p>';
      return;
    }

    const profile = await getProfileById(id);
    renderProfileDetails(profileRoot, profile);
  } catch (error) {
    profileRoot.innerHTML = '<p class="empty-state">Erro ao carregar perfil.</p>';
    console.error(error);
  }
}

init();
