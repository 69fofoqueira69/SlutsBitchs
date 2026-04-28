// Função utilitária para validar se a idade está dentro de uma faixa.
function emIntervalo(valor, min, max) {
  return Number.isFinite(valor) && valor >= min && valor <= max;
}

// Regras mínimas de classificação de idade usadas pela interface.
const regrasIdade = [
  { min: 18, max: 24, tag: 'Putinha', range: '18 a 24', emoji: '🧷' },
  { min: 25, max: 34, tag: 'Vagabunda', range: '25 a 34', emoji: '🔥' },
  { min: 35, max: 59, tag: 'Milf', range: '35 a 59', emoji: '🍷' },
  { min: 60, max: 79, tag: 'Madura', range: '60 a 79', emoji: '🖤' },
  { min: 80, max: Number.POSITIVE_INFINITY, tag: 'Gilf', range: '80 ou mais', emoji: '👑' }
];

// Retorna os dados da faixa etária para a idade recebida.
// Se não encontrar faixa, mantém a idade e devolve campos vazios.
export function calcularDadosIdade(valorIdade) {
  const faixa = regrasIdade.find((regra) => emIntervalo(valorIdade, regra.min, regra.max));

  return faixa
    ? { value: valorIdade, tag: faixa.tag, range: faixa.range, emoji: faixa.emoji }
    : { value: valorIdade, tag: '', range: '', emoji: '' };
}
