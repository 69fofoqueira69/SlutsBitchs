import { renderProfileDetails } from '../components/profileDetails.js';
import { getProfileById } from '../data/repository.js';

const profileRoot = document.querySelector('#profile-root');

async function init() {
  try {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const profile = id ? await getProfileById(id) : null;

    renderProfileDetails(profileRoot, profile);
  } catch (error) {
    profileRoot.innerHTML = '<p>Erro ao carregar perfil.</p>';
    console.error(error);
  }
}

init();
