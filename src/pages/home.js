import { renderFilters } from '../components/filters.js';
import { renderProfileCards } from '../components/profileCard.js';
import { renderSearchBar } from '../components/searchBar.js';
import { getProfiles } from '../data/repository.js';

const searchRoot = document.querySelector('#search-root');
const filtersRoot = document.querySelector('#filters-root');
const cardsRoot = document.querySelector('#cards-root');
const resultsCount = document.querySelector('#results-count');

const state = {
  searchTerm: '',
  filters: {
    type: '',
    personality: '',
    attributes: [],
    categories: []
  },
  profiles: []
};

function containsAll(sourceList, selectedList) {
  return selectedList.every((item) => sourceList.includes(item));
}

function matchesSearch(profile, text) {
  if (!text) return true;

  return [
    profile.name,
    profile.title,
    profile.shortDescription,
    profile.description,
    profile.type,
    profile.personality,
    ...profile.attributes,
    ...profile.categories,
    ...profile.tags
  ]
    .join(' ')
    .toLowerCase()
    .includes(text);
}

function filterProfiles() {
  const text = state.searchTerm.trim().toLowerCase();

  const filtered = state.profiles.filter((profile) => {
    const matchesType = !state.filters.type || profile.type === state.filters.type;
    const matchesPersonality =
      !state.filters.personality || profile.personality === state.filters.personality;
    const matchesAttributes = containsAll(profile.attributes, state.filters.attributes);
    const matchesCategories = containsAll(profile.categories, state.filters.categories);

    return (
      matchesSearch(profile, text) &&
      matchesType &&
      matchesPersonality &&
      matchesAttributes &&
      matchesCategories
    );
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

    renderFilters(filtersRoot, state.profiles, (filters) => {
      state.filters = filters;
      filterProfiles();
    });

    filterProfiles();
  } catch (error) {
    cardsRoot.innerHTML = '<p class="empty-state">Erro ao carregar dados dos perfis.</p>';
    console.error(error);
  }
}

init();
