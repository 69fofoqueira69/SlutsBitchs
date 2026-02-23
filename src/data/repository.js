import { calculateAgeData } from './tagRules.js';
import { validateProfiles } from './validation.js';

const DATA_PATH = './src/data/profiles.json';

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
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function normalizeTagList(tags = []) {
  return tags
    .filter((tag) => typeof tag === 'string' && tag.trim())
    .map((tag) => tag.trim()[0].toUpperCase() + tag.trim().slice(1));
}

function normalizeProfile(rawProfile) {
  if (!rawProfile.identity) {
    return {
      ...rawProfile,
      tags: normalizeTagList(rawProfile.tags || []),
      media: {
        ...(rawProfile.media || {}),
        cover: rawProfile.media?.cover || rawProfile.profileImage?.images?.[0] || ''
      }
    };
  }

  const name = rawProfile.identity.name || rawProfile.name || 'Perfil';
  const ageSource = rawProfile.identity.age || rawProfile.age || { value: 18 };
  const ageValue = Number(ageSource.value);
  const computedAge = calculateAgeData(ageValue);

  const mediaImages = rawProfile.media?.images || rawProfile.profileImage?.images || [];
  const mediaVideos = rawProfile.media?.videos || [];
  const mediaGifs = rawProfile.media?.gifs || [];

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
      images: rawProfile.profileImage?.images || mediaImages
    },
    media: {
      cover: rawProfile.media?.cover || mediaImages[0] || '',
      images: mediaImages,
      videos: mediaVideos,
      gifs: mediaGifs,
      counts: {
        images: mediaImages.length,
        videos: mediaVideos.length,
        gifs: mediaGifs.length
      }
    }
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
