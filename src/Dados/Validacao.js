import { calcularDadosIdade } from './Parametros.js';

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
  return required.every((key) => measurements[key] && isNumber(measurements[key].value));
}

function hasValidAgeObject(age) {
  if (!age || typeof age !== 'object') return false;
  return (
    isInteger(age.value) &&
    isNonEmptyString(age.tag) &&
    isNonEmptyString(age.range) &&
    isNonEmptyString(age.emoji)
  );
}

export function validateProfile(profile) {
  const requiredStringFields = [
    'id',
    'name',
    'title',
    'shortDescription',
    'description',
    'type',
    'personality',
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

  const requiredArrayFields = ['tags', 'fetishes'];

  const hasRequiredStrings = requiredStringFields.every((field) => isNonEmptyString(profile[field]));
  const hasRequiredArrays = requiredArrayFields.every((field) => isStringArray(profile[field]));

  const ageValue = profile.age?.value;
  const hasValidAge = hasValidAgeObject(profile.age) && calcularDadosIdade(ageValue) === profile.age.tag;

  const hasBaseNumbers =
    isNumber(profile.heightMeters) &&
    isNumber(profile.weightKg) &&
    isNumber(profile.experience?.partnersCount) &&
    isNumber(profile.experience?.encountersCount);

  const hasProfileImage =
    profile.profileImage &&
    typeof profile.profileImage.rotation === 'boolean' &&
    isStringArray(profile.profileImage.images || []);

  const hasMedia =
    profile.media &&
    isNonEmptyString(profile.media.cover) &&
    isStringArray(profile.media.images || []) &&
    isStringArray(profile.media.videos || []) &&
    isStringArray(profile.media.gifs || []);

  const hasMeasurements =
    profile.measurements && typeof profile.measurements === 'object' && hasBasicMeasurements(profile.measurements);

  const measurementEntries = Object.values(profile.measurements || {});
  const hasMeasurementObjects = measurementEntries.every(isMeasurementObject);

  return (
    hasRequiredStrings &&
    hasRequiredArrays &&
    hasValidAge &&
    hasBaseNumbers &&
    hasProfileImage &&
    hasMedia &&
    hasMeasurements &&
    hasMeasurementObjects
  );
}

export function validateProfiles(profiles) {
  if (!Array.isArray(profiles)) {
    throw new Error('Formato inválido: esperado um array de perfis.');
  }

  const invalidItems = profiles.filter((profile) => !validateProfile(profile));
  if (invalidItems.length > 0) {
    throw new Error(`Foram encontrados ${invalidItems.length} perfis inválidos nos dados. Verifique campos como age, measurements ou media.`);
  }

  return profiles;
}