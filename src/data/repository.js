import { calculateAgeData, calculateMeasurementData } from './tagRules.js';

const DATA_PATH = './src/data/profiles.json';

function shouldShowMeasurement(measurement, gender) {
  const appliesTo = measurement?.appliesTo;
  if (!appliesTo || !appliesTo.length) return true;
  return appliesTo.includes(gender);
}

function withComputedMeasurements(profile) {
  const output = {};
  const entries = Object.entries(profile.measurements || {});

  for (const [key, measurement] of entries) {
    const value = Number(measurement?.value ?? 0);
    const computed = calculateMeasurementData(key, value);

    output[key] = {
      value,
      tag: measurement?.tag || computed.tag,
      range: measurement?.range || computed.range,
      emoji: measurement?.emoji || computed.emoji,
      appliesTo: measurement?.appliesTo || []
    };
  }

  return output;
}

function normalizeProfile(profile) {
  const ageValue = Number(profile?.identity?.age?.value ?? 0);
  const computedAge = calculateAgeData(ageValue);
  const media = profile.media || {};

  return {
    ...profile,
    identity: {
      ...profile.identity,
      age: {
        value: ageValue,
        tag: profile?.identity?.age?.tag || computedAge.tag,
        range: profile?.identity?.age?.range || computedAge.range,
        emoji: profile?.identity?.age?.emoji || computedAge.emoji
      }
    },
    measurements: withComputedMeasurements(profile),
    media: {
      images: media.images || [],
      videos: media.videos || [],
      gifs: media.gifs || [],
      counts: {
        images: (media.images || []).length,
        videos: (media.videos || []).length,
        gifs: (media.gifs || []).length
      }
    },
    searchableText: [
      profile.identity?.name,
      profile.identity?.universe,
      profile.shortDescription,
      profile.fullDescription,
      ...(profile.preferences?.fetish || [])
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
  };
}

export function getVisibleMeasurements(profile) {
  const gender = profile.identity?.gender;

  return Object.entries(profile.measurements || {})
    .filter(([, measurement]) => shouldShowMeasurement(measurement, gender))
    .map(([key, measurement]) => ({ key, ...measurement }));
}

export async function getProfiles() {
  const response = await fetch(DATA_PATH);
  if (!response.ok) throw new Error('Falha ao carregar perfis');

  const data = await response.json();
  if (!Array.isArray(data)) return [];

  return data.map(normalizeProfile);
}

export async function getProfileById(id) {
  if (!id) return null;

  const profiles = await getProfiles();
  return profiles.find((profile) => profile.id === id) || null;
}
