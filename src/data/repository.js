import { calculateAgeData } from './tagRules.js';
import { validateProfiles } from './validation.js';

const DATA_PATH = './src/data/profiles.json';
const FALLBACK_COVER = './src/assets/mia-1.svg';

function parseHeightToMeters(height) {
  if (typeof height === 'number') return height;
  if (typeof height !== 'string') return 0;

  const value = Number.parseFloat(height.replace(',', '.'));
  if (!Number.isFinite(value)) return 0;
  if (height.toLowerCase().includes('cm')) return value / 100;
  return value;
}

function parseWeightToKg(weight) {
  if (typeof weight === 'number') return weight;
  if (typeof weight !== 'string') return 0;

  const value = Number.parseFloat(weight.replace(',', '.'));
  return Number.isFinite(value) ? value : 0;
}

function toProfileId(name) {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function normalizeTagList(tags = []) {
  return tags
    .filter((tag) => typeof tag === 'string' && tag.trim())
    .map((tag) => tag.trim()[0].toUpperCase() + tag.trim().slice(1));
}

function normalizeMedia(rawMedia = {}, profileImages = []) {
  const images = Array.isArray(rawMedia.images) ? rawMedia.images : profileImages;
  const videos = Array.isArray(rawMedia.videos) ? rawMedia.videos : [];
  const gifs = Array.isArray(rawMedia.gifs) ? rawMedia.gifs : [];
  const cover = rawMedia.cover || images[0] || profileImages[0] || FALLBACK_COVER;

  return {
    cover,
    images,
    videos,
    gifs,
    counts: {
      images: images.length,
      videos: videos.length,
      gifs: gifs.length
    }
  };
}

function normalizeBaseProfile(rawProfile) {
  const profileImages = rawProfile.profileImage?.images || rawProfile.media?.images || [];
  const media = normalizeMedia(rawProfile.media || {}, profileImages);

  return {
    ...rawProfile,
    tags: normalizeTagList(rawProfile.tags || []),
    profileImage: {
      rotation: rawProfile.profileImage?.rotation ?? true,
      images: profileImages.length ? profileImages : [media.cover]
    },
    media,
    measurements: {
      hips: rawProfile.measurements?.hips || rawProfile.measurements?.ass,
      waist: rawProfile.measurements?.waist,
      thighs: rawProfile.measurements?.thighs,
      chest: rawProfile.measurements?.chest || rawProfile.measurements?.breasts
    }
  };
}

function normalizeProfile(rawProfile) {
  if (!rawProfile.identity) {
    return normalizeBaseProfile(rawProfile);
  }

  const name = rawProfile.identity.name || rawProfile.name || 'Perfil';
  const ageSource = rawProfile.identity.age || rawProfile.age || { value: 18 };
  const ageValue = typeof ageSource === 'object' && ageSource?.value != null ? Number(ageSource.value) : 18;
  const computedAge = calculateAgeData(ageValue);

  const profileImages = rawProfile.profileImage?.images || rawProfile.media?.images || [];
  const media = normalizeMedia(rawProfile.media || {}, profileImages);

  return {
    id: rawProfile.id || toProfileId(name),
    name,
    title: rawProfile.title || `Perfil de ${name}`,
    shortDescription: rawProfile.shortDescription || '',
    description: rawProfile.description || rawProfile.shortDescription || '',
    fullDescription: rawProfile.fullDescription || rawProfile.description || rawProfile.shortDescription || '',
    type: rawProfile.type || rawProfile.identity.universe || 'Realista',
    personality: rawProfile.personality || 'Confiante',
    gender: rawProfile.identity.gender || rawProfile.gender || 'Não informado',
    universe: rawProfile.identity.universe || rawProfile.universe || 'Não informado',
    age: {
      value: ageValue,
      tag: ageSource.tag || computedAge.tag,
      range: ageSource.range || computedAge.range,
      emoji: ageSource.emoji || computedAge.emoji
    },
    heightMeters: parseHeightToMeters(rawProfile.basicPhysicalDetails?.height || rawProfile.heightMeters),
    weightKg: parseWeightToKg(rawProfile.basicPhysicalDetails?.weight || rawProfile.weightKg),
    species: rawProfile.basicPhysicalDetails?.species || rawProfile.species || 'Não informado',
    hairColor: rawProfile.basicPhysicalDetails?.hairColor || rawProfile.hairColor || 'Não informado',
    hairStyle: rawProfile.basicPhysicalDetails?.hairStyle || rawProfile.hairStyle || 'Não informado',
    eyeColor: rawProfile.basicPhysicalDetails?.eyeColor || rawProfile.eyeColor || 'Não informado',
    skinColor: rawProfile.basicPhysicalDetails?.skinColor || rawProfile.skinColor || 'Não informado',
    tags: normalizeTagList(rawProfile.tags || [rawProfile.personality, rawProfile.identity.universe]),
    measurements: {
      hips: rawProfile.measurements?.hips || rawProfile.measurements?.ass,
      waist: rawProfile.measurements?.waist,
      thighs: rawProfile.measurements?.thighs,
      chest: rawProfile.measurements?.chest || rawProfile.measurements?.breasts
    },
    experience: {
      partnersCount: rawProfile.experience?.partnersCount || rawProfile.sexualExperience?.experiencedPenises || 0,
      encountersCount: rawProfile.experience?.encountersCount || rawProfile.sexualExperience?.sexCount || 0
    },
    fetishes: rawProfile.fetishes || rawProfile.preferences?.fetish || [],
    favoritePosition: rawProfile.favoritePosition || rawProfile.preferences?.favoritePosition || 'Não informado',
    favoriteOutfit: rawProfile.favoriteOutfit || rawProfile.preferences?.favoriteClothing || 'Não informado',
    occupation: rawProfile.occupation || rawProfile.preferences?.occupation || 'Não informado',
    profileImage: {
      rotation: rawProfile.profileImage?.rotation ?? true,
      images: profileImages.length ? profileImages : [media.cover]
    },
    media
  };
}

export async function getProfiles() {
  const response = await fetch(DATA_PATH);

  if (!response.ok) {
    throw new Error('Falha ao carregar perfis.');
  }

  const data = await response.json();
  const normalized = data.map(normalizeProfile);
  return validateProfiles(normalized);
}

export async function getProfileById(id) {
  const profiles = await getProfiles();
  return profiles.find((profile) => profile.id === id) ?? null;
}
