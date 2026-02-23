import { renderProfileCards } from '../components/profileCard.js';
import { renderSearchBar } from '../components/searchBar.js';
import { getProfiles } from '../data/repository.js';

const searchRoot = document.querySelector('#search-root');
const cardsRoot = document.querySelector('#cards-root');
const resultsCount = document.querySelector('#results-count');

const state = {
  searchTerm: '',
  profiles: []
};

function filterProfiles() {
  const searchTerm = state.searchTerm.trim().toLowerCase();
  const filtered = state.profiles.filter((profile) => profile.searchableText.includes(searchTerm));

  renderProfileCards(cardsRoot, filtered);

  if (resultsCount) {
    resultsCount.textContent = `${filtered.length} perfil(is) encontrado(s)`;
  }
}

async function init() {
  try {
    state.profiles = await getProfiles();
    renderSearchBar(searchRoot, (term) => {
      state.searchTerm = term;
      filterProfiles();
    });
    filterProfiles();
  } catch (error) {
    cardsRoot.innerHTML = '<p class="empty-state">Erro ao carregar os perfis.</p>';
    console.error(error);
  }
}

init();
