import { renderProfileCards } from '../components/profileCard.js';
import { renderSearchBar } from '../components/searchBar.js';
import { renderFilters } from '../components/filters.js';
import { getProfiles } from '../data/repository.js';

const toolbarRoot = document.querySelector('#toolbar-root');
const filtersRoot = document.querySelector('#filters-root');
const cardsRoot = document.querySelector('#cards-root');
const resultsCount = document.querySelector('#results-count');

const state = {
  searchTerm: '',
  filters: {
    type: '',
    personality: '',
    gender: '',
    tag: ''
  },
  profiles: []
};

function matchesSearch(profile, text) {
  if (!text) return true;
  return profile.name.toLowerCase().includes(text);
}

function filterProfiles() {
  const text = state.searchTerm;

  const filtered = state.profiles.filter((profile) => {
    const matchesType = !state.filters.type || profile.type === state.filters.type;
    const matchesPersonality = !state.filters.personality || profile.personality === state.filters.personality;
    const matchesGender = !state.filters.gender || profile.gender === state.filters.gender;
    const matchesTag = !state.filters.tag || profile.tags.includes(state.filters.tag);

    return matchesSearch(profile, text) && matchesType && matchesPersonality && matchesGender && matchesTag;
  });

  if (resultsCount) {
    resultsCount.textContent = `${filtered.length} perfil(is) encontrado(s)`;
  }
  renderProfileCards(cardsRoot, filtered);
}

async function init() {
  try {
    state.profiles = await getProfiles();

    if (toolbarRoot) {
      renderSearchBar(toolbarRoot, (value) => {
        state.searchTerm = value;
        filterProfiles();
      });
    }

    if (filtersRoot) {
      renderFilters(filtersRoot, state.profiles, (filters) => {
        state.filters = filters;
        filterProfiles();
      });
    }

    filterProfiles();
  } catch (error) {
    if (cardsRoot) {
      cardsRoot.textContent = 'Erro ao carregar dados dos perfis.';
    }
    console.error(error);
  }
}

init();
