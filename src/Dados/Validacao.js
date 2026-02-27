import { calcularDadosIdade } from './Parametros.js';

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isString(value) {
  return typeof value === 'string';
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
  const hasTag = isString(value.tag);
  const hasRange = isString(value.range);
  const hasEmoji = isString(value.emoji);
  const hasValidAppliesTo = value.appliesTo === undefined || isStringArray(value.appliesTo);

  return hasValue && hasTag && hasRange && hasEmoji && hasValidAppliesTo;
}

function hasBasicMeasurements(measurements) {
  const required = ['ass', 'cintura', 'coxas'];
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
  if (!profile || typeof profile !== 'object') return false;

  const identidade = profile.identidade || {};
  const idade = identidade.idade;
  const detalhes = profile.detalhesFisicosBasicos || {};
  const experiencia = profile.experienciaSexual || {};
  const preferencias = profile.preferencias || {};
  const midia = profile.midia || {};
  const medidas = profile.medidas || {};

  const hasRequiredStrings =
    isNonEmptyString(profile.id) &&
    isNonEmptyString(identidade.nome) &&
    isNonEmptyString(identidade.genero) &&
    isNonEmptyString(identidade.universo) &&
    isNonEmptyString(profile.descricaoCurta) &&
    isNonEmptyString(profile.descricaoCompleta) &&
    isNonEmptyString(detalhes.altura) &&
    isNonEmptyString(detalhes.peso) &&
    isNonEmptyString(detalhes.especie) &&
    isNonEmptyString(detalhes.corCabelo) &&
    isNonEmptyString(detalhes.estiloCabelo) &&
    isNonEmptyString(detalhes.eyeColor) &&
    isNonEmptyString(detalhes.pele) &&
    isNonEmptyString(preferencias.posicaoFavorita) &&
    isNonEmptyString(preferencias.roupaFavorita) &&
    isNonEmptyString(preferencias.ocupacao);

  const hasRequiredArrays =
    isStringArray(preferencias.fetiche || []) &&
    isStringArray(midia.imagens || []) &&
    isStringArray(midia.videos || []) &&
    isStringArray(midia.gifs || []);

  const ageValue = idade?.value;
  const dadosIdadeCalculados = calcularDadosIdade(ageValue);
  const hasValidAge =
    hasValidAgeObject(idade) &&
    idade.tag === dadosIdadeCalculados.tag &&
    idade.range === dadosIdadeCalculados.range &&
    idade.emoji === dadosIdadeCalculados.emoji;

  const hasBaseNumbers =
    isNumber(experiencia.rolasExperimentadas) &&
    isNumber(experiencia.contagemSexo);

  const hasMedia =
    midia &&
    typeof midia === 'object' &&
    hasRequiredArrays &&
    typeof midia.contagens === 'object' &&
    isInteger(midia.contagens.imagens) &&
    isInteger(midia.contagens.videos) &&
    isInteger(midia.contagens.gifs);

  const hasMeasurements = medidas && typeof medidas === 'object' && hasBasicMeasurements(medidas);

  const measurementEntries = Object.values(medidas);
  const hasMeasurementObjects = measurementEntries.every(isMeasurementObject);

  return (
    hasRequiredStrings &&
    hasRequiredArrays &&
    hasValidAge &&
    hasBaseNumbers &&
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
    throw new Error(`Foram encontrados ${invalidItems.length} perfis inválidos nos dados. Verifique campos como identidade.idade, medidas ou midia.`);
  }

  return profiles;
}
