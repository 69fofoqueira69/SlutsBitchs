import { calculateAgeTag } from './tagRules.js';

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function isInteger(value) {
  return Number.isInteger(value);
}

function isMeasurementObject(value) {
  if (!value || typeof value !== 'object') return false;

  const hasValue = isNumber(value.value);
  const hasTag = isNonEmptyString(value.tag);
  const hasRange = isNonEmptyString(value.range);
  const hasEmoji = isNonEmptyString(value.emoji);

  return hasValue && hasTag && hasRange && hasEmoji;
}

function hasBasicMeasurements(measurements) {
  const required = ['hips', 'waist', 'thighs'];
  return required.every(
    (key) => measurements[key] && isNumber(measurements[key].value)
  );
}

function hasValidAgeObject(age) {
  return (
    age &&
    typeof age === 'object' &&
    isInteger(age.value) &&
    isNonEmptyString(age.tag) &&
    isNonEmptyString(age.range) &&
    isNonEmptyString(age.emoji)
  );
}

export function validateProfile(profile) {
  const commonRequiredStringFields = [
    'id',
    'name',
    'title',
    'shortDescription',
    'description',
    'type',
    'personality'
  ];

  const commonRequiredArrayFields = ['attributes', 'categories', 'tags'];

  const hasCommonRequiredStrings = commonRequiredStringFields.every((field) =>
    isNonEmptyString(profile[field])
  );

  const hasCommonRequiredArrays = commonRequiredArrayFields.every((field) =>
    isStringArray(profile[field])
  );

  const hasMedia =
    profile.media &&
    typeof profile.media === 'object' &&
    !Array.isArray(profile.media) &&
    isNonEmptyString(profile.media.cover) &&
    isStringArray(profile.media.images || []) &&
    isStringArray(profile.media.videos || []) &&
    isStringArray(profile.media.gifs || []);

  if (profile.type === 'Realista') {
    const realistaRequiredStringFields = [
      'gender',
      'universe',
      'species',
      'hairColor',
      'hairStyle',
      'eyeColor',
      'skinColor',
      'favoritePosition',
      'favoriteOutfit',
      'occupation',
      'fullDescription'
    ];

    const realistaRequiredArrayFields = ['fetishes'];

    const hasRealistaRequiredStrings = realistaRequiredStringFields.every(
      (field) => isNonEmptyString(profile[field])
    );

    const hasRealistaRequiredArrays = realistaRequiredArrayFields.every(
      (field) => isStringArray(profile[field])
    );

    const ageValue =
      typeof profile.age === 'object' ? profile.age.value : profile.age;

    const hasValidAge =
      hasValidAgeObject(profile.age) &&
      calculateAgeTag(ageValue) === profile.age.tag;

    const hasBaseNumbers =
      isNumber(profile.heightMeters) &&
      isNumber(profile.weightKg) &&
      isNumber(profile.experience?.partnersCount) &&
      isNumber(profile.experience?.encountersCount);

    const hasProfileImage =
      profile.profileImage &&
      typeof profile.profileImage.rotation === 'boolean' &&
      isStringArray(profile.profileImage.images || []);

    const hasMeasurements =
      profile.measurements &&
      typeof profile.measurements === 'object' &&
      hasBasicMeasurements(profile.measurements);

    const measurementEntries = Object.values(profile.measurements || {});
    const hasMeasurementObjects =
      measurementEntries.length > 0 &&
      measurementEntries.every(isMeasurementObject);

    return (
      hasCommonRequiredStrings &&
      hasCommonRequiredArrays &&
      hasRealistaRequiredStrings &&
      hasRealistaRequiredArrays &&
      hasValidAge &&
      hasBaseNumbers &&
      hasProfileImage &&
      hasMedia &&
      hasMeasurements &&
      hasMeasurementObjects
    );
  } else {
    const hasPersonalInfo =
      profile.personalInfo &&
      typeof profile.personalInfo === 'object' &&
      !Array.isArray(profile.personalInfo);

    const hasExtraContent =
      profile.extraContent &&
      typeof profile.extraContent === 'object' &&
      !Array.isArray(profile.extraContent);

    return (
      hasCommonRequiredStrings &&
      hasCommonRequiredArrays &&
      hasMedia &&
      hasPersonalInfo &&
      hasExtraContent
    );
  }
}

export function validateProfiles(profiles) {
  if (!Array.isArray(profiles)) {
    throw new Error('Formato inválido: esperado um array de perfis.');
  }

  const invalidItems = profiles.filter(
    (profile) => !validateProfile(profile)
  );

  if (invalidItems.length > 0) {
    throw new Error(
      `Foram encontrados ${invalidItems.length} perfis inválidos nos dados.`
    );
  }

  return profiles;
}