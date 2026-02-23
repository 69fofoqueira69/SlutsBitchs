import { validateProfiles } from './validation.js';

const DATA_PATH = './src/data/profiles.json';

export async function getProfiles() {
  const response = await fetch(DATA_PATH);

  if (!response.ok) {
    throw new Error('Falha ao carregar perfis.');
  }

  const data = await response.json();
  return validateProfiles(data);
}

export async function getProfileById(id) {
  const profiles = await getProfiles();
  return profiles.find((profile) => profile.id === id) ?? null;
}
