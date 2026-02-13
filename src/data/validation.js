function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

export function validateProfile(profile) {
  const requiredStringFields = ['id', 'name', 'title', 'shortDescription', 'description', 'type', 'personality'];
  const requiredArrayFields = ['attributes', 'categories', 'tags'];

  const hasRequiredStrings = requiredStringFields.every((field) => isNonEmptyString(profile[field]));
  const hasRequiredArrays = requiredArrayFields.every((field) => isStringArray(profile[field]));

  const hasMedia =
    profile.media &&
    isNonEmptyString(profile.media.cover) &&
    isStringArray(profile.media.images || []) &&
    isStringArray(profile.media.videos || []) &&
    isStringArray(profile.media.gifs || []);

  const hasPersonalInfo =
    profile.personalInfo &&
    typeof profile.personalInfo === 'object' &&
    !Array.isArray(profile.personalInfo);

  return hasRequiredStrings && hasRequiredArrays && hasMedia && hasPersonalInfo;
}

export function validateProfiles(profiles) {
  if (!Array.isArray(profiles)) {
    throw new Error('Formato inválido: esperado um array de perfis.');
  }

  const invalidItems = profiles.filter((profile) => !validateProfile(profile));
  if (invalidItems.length > 0) {
    throw new Error(`Foram encontrados ${invalidItems.length} perfis inválidos nos dados.`);
  }

  return profiles;
}
