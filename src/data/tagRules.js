function inRange(value, min, max) {
  return value >= min && value <= max;
}

// Função explícita e exclusiva para cálculo da tag de idade
export function calculateAgeTag(age) {
  let tag;

  if (age >= 18 && age <= 21) tag = 'Putinha';
  else if (age >= 22 && age <= 34) tag = 'Vagabunda';
  else if (age >= 35 && age <= 59) tag = 'Milf';
  else if (age >= 60 && age <= 79) tag = 'Madura';
  else if (age >= 80) tag = 'Gilf';
  else throw new Error('Idade fora da faixa permitida para classificação.');

  return tag;
}

export function calculateAgeData(ageValue) {
  const tag = calculateAgeTag(ageValue);

  if (tag === 'Putinha') return { value: ageValue, tag, range: '18–21', emoji: '😈' };
  if (tag === 'Vagabunda') return { value: ageValue, tag, range: '22–34', emoji: '🔥' };
  if (tag === 'Milf') return { value: ageValue, tag, range: '35–59', emoji: '🍷' };
  if (tag === 'Madura') return { value: ageValue, tag, range: '60–79', emoji: '🖤' };
  return { value: ageValue, tag, range: '80+', emoji: '👑' };
}

const measurementRules = {
  "hips": [
    { "min": 7.5, "max": 11.2, "tag": "Tábua", "range": "7.5–11.2", "emoji": "📏" },
    { "min": 11.3, "max": 37.5, "tag": "Pêssego", "range": "11.3–37.5", "emoji": "🍑" },
    { "min": 37.6, "max": 97.5, "tag": "Melão", "range": "37.6–97.5", "emoji": "🍈" },
    { "min": 97.6, "max": 270, "tag": "Melancia", "range": "97.6–270", "emoji": "🍉" },
    { "min": 270.1, "max": 735, "tag": "Avantajada", "range": "270.1–735", "emoji": "🏔️" }
  ],
  "waist": [
    { "min": 5.5, "max": 9.7, "tag": "Inexistente", "range": "5.5–9.7", "emoji": "💨" },
    { "min": 9.8, "max": 30, "tag": "Modelo", "range": "9.8–30", "emoji": "👗" },
    { "min": 30.1, "max": 80, "tag": "Atletica", "range": "30.1–80", "emoji": "💪" },
    { "min": 80.1, "max": 222, "tag": "Larga", "range": "80.1–222", "emoji": "↔️" },
    { "min": 222.1, "max": 605, "tag": "Redonda", "range": "222.1–605", "emoji": "⚫" }
  ],
  "thighs": [
    { "min": 3.8, "max": 6.4, "tag": "Inexistente", "range": "3.8–6.4", "emoji": "💨" },
    { "min": 6.5, "max": 20.4, "tag": "Modelo", "range": "6.5–20.4", "emoji": "👠" },
    { "min": 20.5, "max": 53.6, "tag": "Atletica", "range": "20.5–53.6", "emoji": "🏃‍♀️" },
    { "min": 53.7, "max": 148, "tag": "Larga", "range": "53.7–148", "emoji": "🦵" },
    { "min": 148.1, "max": 403.2, "tag": "Redonda", "range": "148.1–403.2", "emoji": "🍗" }
  ],
  "chest": [
    { "min": 6.5, "max": 10.2, "tag": "Tábua", "range": "6.5–10.2", "emoji": "📏" },
    { "min": 10.3, "max": 33.5, "tag": "Cereja", "range": "10.3–33.5", "emoji": "🍒" },
    { "min": 33.6, "max": 87.5, "tag": "Melão", "range": "33.6–87.5", "emoji": "🍈" },
    { "min": 87.6, "max": 242, "tag": "Melancia", "range": "87.6–242", "emoji": "🍉" },
    { "min": 242.1, "max": 659, "tag": "Avantajada", "range": "242.1–659", "emoji": "🏔️" }
  ]
};

export function calculateMeasurementData(type, value, unit = 'cm') {
  const rules = measurementRules[type] || [];
  const match = rules.find((item) => inRange(value, item.min, item.max));

  if (!match) {
    return { value, unit, tag: 'NãoClassificada', range: 'N/A', emoji: '📏' };
  }

  return {
    value,
    unit,
    tag: match.tag,
    range: match.range,
    emoji: match.emoji
  };
}

export function buildComputedProfile(profile) {
  const ageValue = typeof profile.age === 'object' ? profile.age.value : profile.age;
  const age = calculateAgeData(ageValue);

  const computedMeasurements = Object.entries(profile.measurements || {}).reduce((acc, [key, data]) => {
    const value = typeof data === 'number' ? data : data.value;
    const unit = typeof data === 'object' && data.unit ? data.unit : 'cm';
    acc[key] = calculateMeasurementData(key, value, unit);
    return acc;
  }, {});

  const profileImages = profile.profileImage?.images || [];
  const media = {
    ...(profile.media || {}),
    cover: profile.media?.cover || profileImages[0] || '',
    images: profile.media?.images || profileImages,
    videos: profile.media?.videos || [],
    gifs: profile.media?.gifs || []
  };

  media.counts = {
    images: media.images.length,
    videos: media.videos.length,
    gifs: media.gifs.length
  };

  return {
    ...profile,
    age,
    ageTag: age.tag,
    media,
    computedMeasurements,
    tags: [...new Set([...(profile.tags || []), age.tag])]
  };
}
