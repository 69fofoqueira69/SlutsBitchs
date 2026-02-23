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

function matchesSearch(profile, text) {
  if (!text) return true;
  return profile.name.toLowerCase().includes(text);
}

function filterProfiles() {
  const text = state.searchTerm.trim().toLowerCase();

  const filtered = state.profiles.filter((profile) => {
    return matchesSearch(profile, text);
  });

  resultsCount.textContent = `${filtered.length} perfil(is) encontrado(s)`;
  renderProfileCards(cardsRoot, filtered);
}

async function init() {
  try {
    state.profiles = await getProfiles();

    renderSearchBar(searchRoot, (value) => {
      state.searchTerm = value;
      filterProfiles();
    });

    filterProfiles();
  } catch (error) {
    cardsRoot.innerHTML = '<p class="empty-state">Erro ao carregar dados dos perfis.</p>';
    console.error(error);
  }
}

init();
