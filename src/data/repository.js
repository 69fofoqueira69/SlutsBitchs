const DATA_PATH = '/src/data/profiles.json';

/**
 * Busca todos os perfis
 */
export async function getProfiles() {
  try {
    const response = await fetch(DATA_PATH);

    if (!response.ok) {
      throw new Error('Falha ao carregar o JSON');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao carregar perfis:', error);
    return [];
  }
}

/**
 * Busca um perfil pelo ID
 */
export async function getProfileById(id) {
  try {
    const profiles = await getProfiles();

    if (!id) return null;

    return profiles.find(
      (profile) => profile.id.toLowerCase() === id.toLowerCase()
    ) ?? null;

  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return null;
  }
}
