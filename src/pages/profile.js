import { renderProfileDetails } from '../components/profileDetails.js';
import { getProfileById } from '../data/repository.js';
import { buildComputedProfile } from '../data/tagRules.js';

const profileRoot = document.querySelector('#profile-root');

async function init() {
  if (!profileRoot) {
    console.error('Elemento #profile-root não encontrado.');
    return;
  }

  try {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const profile = id ? await getProfileById(id) : null;
    renderProfileDetails(profileRoot, profile ? buildComputedProfile(profile) : null);
  } catch (error) {
    profileRoot.textContent = 'Erro ao carregar perfil.';
    console.error(error);
  }
}

init();
