function emIntervalo(valor, min, max) {
  return Number.isFinite(valor) && valor >= min && valor <= max;
}

const regrasIdade = [
  { min: 14, max: 21, tag: 'Putinha', range: '14 a 21', emoji: '🧷' },
  { min: 22, max: 34, tag: 'Vagabunda', range: '22 a 34', emoji: '🔥' },
  { min: 35, max: 59, tag: 'Milf', range: '35 a 59', emoji: '🍷' },
  { min: 60, max: 79, tag: 'Madura', range: '60 a 79', emoji: '🖤' },
  { min: 80, max: Number.POSITIVE_INFINITY, tag: 'Gilf', range: '80 ou mais', emoji: '👑' }
];

const regrasMedidas = {
  ass: [
    { min: 7.5, max: 11.2, tag: 'Tábua', range: '7.5–11.2', emoji: '🍑' },
    { min: 11.3, max: 37.5, tag: 'Pêssego', range: '11.3–37.5', emoji: '🍑' },
    { min: 37.6, max: 97.5, tag: 'Melão', range: '37.6–97.5', emoji: '🍑' },
    { min: 97.6, max: 270, tag: 'Melancia', range: '97.6–270', emoji: '🍑' },
    { min: 270.1, max: 735, tag: 'Avantajada', range: '270.1–735', emoji: '🍑' }
  ],
  cintura: [
    { min: 5.5, max: 9.7, tag: 'Inexistente', range: '5.5–9.7', emoji: '⏳' },
    { min: 9.8, max: 30, tag: 'Modelo', range: '9.8–30', emoji: '⏳' },
    { min: 30.1, max: 80, tag: 'Atletica', range: '30.1–80', emoji: '⏳' },
    { min: 80.1, max: 222, tag: 'Larga', range: '80.1–222', emoji: '⏳' },
    { min: 222.1, max: 605, tag: 'Redonda', range: '222.1–605', emoji: '⏳' }
  ],
  coxas: [
    { min: 3.8, max: 6.4, tag: 'Inexistente', range: '3.8–6.4', emoji: '🦵' },
    { min: 6.5, max: 20.4, tag: 'Modelo', range: '6.5–20.4', emoji: '🦵' },
    { min: 20.5, max: 53.6, tag: 'Atletica', range: '20.5–53.6', emoji: '🦵' },
    { min: 53.7, max: 148, tag: 'Larga', range: '53.7–148', emoji: '🦵' },
    { min: 148.1, max: 403.2, tag: 'Redonda', range: '148.1–403.2', emoji: '🦵' }
  ],
  peitos: [
    { min: 6.5, max: 10.2, tag: 'Tábua', range: '6.5–10.2', emoji: '🍒' },
    { min: 10.3, max: 33.5, tag: 'Cereja', range: '10.3–33.5', emoji: '🍒' },
    { min: 33.6, max: 87.5, tag: 'Melão', range: '33.6–87.5', emoji: '🍒' },
    { min: 87.6, max: 242, tag: 'Melancia', range: '87.6–242', emoji: '🍒' },
    { min: 242.1, max: 659, tag: 'Avantajada', range: '242.1–659', emoji: '🍒' }
  ],
  buceta: [
    { min: 0.1, max: 0.7, tag: 'Virgem', range: '0.1–0.7', emoji: '💗' },
    { min: 0.8, max: 1.7, tag: 'Apertada', range: '0.8–1.7', emoji: '💗' },
    { min: 1.8, max: 4.9, tag: 'Regular', range: '1.8–4.9', emoji: '💗' },
    { min: 5, max: 13.2, tag: 'Larga', range: '5–13.2', emoji: '💗' },
    { min: 13.3, max: 36.2, tag: 'Arrombada', range: '13.3–36.2', emoji: '💗' }
  ],
  anus: [
    { min: 0.2, max: 1.8, tag: 'Virgem', range: '0.2–1.8', emoji: '🍩' },
    { min: 1.9, max: 4.1, tag: 'Apartado', range: '1.9–4.1', emoji: '🍩' },
    { min: 4.2, max: 11.9, tag: 'Regular', range: '4.2–11.9', emoji: '🍩' },
    { min: 12, max: 32, tag: 'Largo', range: '12–32', emoji: '🍩' },
    { min: 33, max: 87, tag: 'Arrombado', range: '33–87', emoji: '🍩' }
  ],
  tamanhoRola: [
    { min: 0.6, max: 1.5, tag: 'Inexistente', range: '0.6–1.5', emoji: '🍆' },
    { min: 1.6, max: 4.2, tag: 'Banana', range: '1.6–4.2', emoji: '🍆' },
    { min: 4.3, max: 11.4, tag: 'Pepino', range: '4.3–11.4', emoji: '🍆' },
    { min: 11.5, max: 31.2, tag: 'Berinjela', range: '11.5–31.2', emoji: '🍆' },
    { min: 31.3, max: 85.2, tag: 'Avantajada', range: '31.3–85.2', emoji: '🍆' }
  ],
  grossuraRola: [
    { min: 0.8, max: 1.3, tag: 'Inexistente', range: '0.8–1.3', emoji: '📏' },
    { min: 1.4, max: 4.2, tag: 'Banana', range: '1.4–4.2', emoji: '📏' },
    { min: 4.3, max: 11, tag: 'Pepino', range: '4.3–11', emoji: '📏' },
    { min: 11.1, max: 30.4, tag: 'Berinjela', range: '11.1–30.4', emoji: '📏' },
    { min: 30.5, max: 82.8, tag: 'Grotesca', range: '30.5–82.8', emoji: '📏' }
  ],
  bolas: [
    { min: 0.2, max: 0.4, tag: 'Inexistentes', range: '0.2–0.4', emoji: '🥚' },
    { min: 0.5, max: 1.3, tag: 'Bagos', range: '0.5–1.3', emoji: '🥚' },
    { min: 1.4, max: 3.5, tag: 'Nozes', range: '1.4–3.5', emoji: '🥚' },
    { min: 3.6, max: 9.6, tag: 'Ovos', range: '3.6–9.6', emoji: '🥚' },
    { min: 9.7, max: 26.2, tag: 'Ovos de Páscoa', range: '9.7–26.2', emoji: '🥚' }
  ]
};

export function calcularDadosIdade(valorIdade) {
  const faixa = regrasIdade.find((regra) => emIntervalo(valorIdade, regra.min, regra.max));
  return faixa
    ? { value: valorIdade, tag: faixa.tag, range: faixa.range, emoji: faixa.emoji }
    : { value: valorIdade, tag: '', range: '', emoji: '' };
}

export function calcularDadosMedida(tipo, valor) {
  const faixa = (regrasMedidas[tipo] || []).find((regra) => emIntervalo(valor, regra.min, regra.max));
  return faixa
    ? { value: valor, tag: faixa.tag, range: faixa.range, emoji: faixa.emoji }
    : { value: valor, tag: '', range: '', emoji: '' };
}