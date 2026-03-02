import { buscarMedidasVisiveis } from '../Dados/Repositorio.js';
import { renderizarGaleria, configurarGaleria } from './Galeria.js';

const ROTULOS_MEDIDAS = {
  bunda: 'Bunda',
  cintura: 'Cintura',
  coxas: 'Coxas',
  peitos: 'Peito',
  buceta: 'Buceta',
  cu: 'Cu',
  tamanhoRola: 'Rola',
  grossuraRola: 'Grossura da rola',
  bolas: 'Bolas'
};

function renderizarItemMedida(medida) {
  return `
    <li>
      <span>${medida.emoji || '📌'} ${ROTULOS_MEDIDAS[medida.chave] || medida.chave}</span>
      <strong>${medida.value} cm · ${medida.tag || '—'}</strong>
    </li>
  `;
}

function equalizarAlturaCaixas(container) {
  const caixas = Array.from(container.querySelectorAll('.caixa-perfil'));
  if (!caixas.length) return;

  const caixaDetalhesBasicos = caixas.find((caixa) => caixa.querySelector('h2')?.textContent?.trim() === 'Detalhes básicos');
  const caixaMedidas = caixas.find((caixa) => caixa.querySelector('h2')?.textContent?.trim() === 'Medidas');

  caixas.forEach((caixa) => {
    caixa.style.height = 'auto';
  });

  const alturaBase = Math.max(
    caixaDetalhesBasicos?.scrollHeight || 0,
    caixaMedidas?.scrollHeight || 0
  );

  if (!alturaBase) return;

  caixas.forEach((caixa) => {
    caixa.style.height = `${alturaBase}px`;
  });
}

export function renderizarDetalhes(container, perfil) {
  if (!perfil) {
    container.innerHTML = '<p class="empty-state">Perfil não encontrado.</p>';
    return;
  }

  const { identidade, detalhesFisicosBasicos, preferencias, experienciaSexual, midia } = perfil;
  const midiasPerfil = [...(midia.imagens || []), ...(midia.gifs || [])];
  const capaAleatoria = midiasPerfil.length
    ? midiasPerfil[Math.floor(Math.random() * midiasPerfil.length)]
    : '';
  const medidas = buscarMedidasVisiveis(perfil);

  container.innerHTML = `
    <a href="./index.html" class="link">← Voltar</a>
    <article class="perfil">
      <div class="coluna-perfil">
        <div class="heroi-perfil caixa-perfil">
          <img src="${capaAleatoria}" alt="${identidade.nome}">
          <div class="sobreposicao-perfil">
            <h1>${identidade.nome}, ${identidade.idade.value}</h1>
            <p>${identidade.genero} • ${identidade.universo}</p>
          </div>
        </div>

        <section class="caixa-perfil">
          <h2>Detalhes básicos</h2>
          <ul class="lista-detalhes">
            <li><span>Altura</span><strong>${detalhesFisicosBasicos.altura}</strong></li>
            <li><span>Peso</span><strong>${detalhesFisicosBasicos.peso}</strong></li>
            <li><span>Espécie</span><strong>${detalhesFisicosBasicos.especie}</strong></li>
            <li><span>Cabelo</span><strong>${detalhesFisicosBasicos.corCabelo} · ${detalhesFisicosBasicos.estiloCabelo}</strong></li>
            <li><span>Olhos</span><strong>${detalhesFisicosBasicos.olhos}</strong></li>
            <li><span>Pele</span><strong>${detalhesFisicosBasicos.pele}</strong></li>
          </ul>
        </section>

        <section class="caixa-perfil">
          <h2>Experiência e preferências</h2>
          <ul class="lista-detalhes">
            <li><span>Experiências registradas</span><strong>${experienciaSexual.contagemSexo}</strong></li>
            <li><span>Parceiros registrados</span><strong>${experienciaSexual.rolasExperimentadas}</strong></li>
            <li><span>Posição favorita</span><strong>${preferencias.posicaoFavorita}</strong></li>
            <li><span>Roupa favorita</span><strong>${preferencias.roupaFavorita}</strong></li>
            <li><span>Ocupação</span><strong>${preferencias.ocupacao}</strong></li>
            <li><span>Interesses</span><strong>${(preferencias.fetiche || []).join(', ') || '—'}</strong></li>
          </ul>
        </section>
      </div>

      <div class="coluna-perfil">
        <section class="secao-sobre caixa-perfil">
          <h2>Sobre</h2>
          <p>${perfil.descricaoCompleta}</p>
        </section>

        <section class="caixa-perfil">
          <h2>Medidas</h2>
          <ul class="lista-detalhes">
            ${medidas.map(renderizarItemMedida).join('')}
          </ul>
        </section>

        ${renderizarGaleria(midia)}
      </div>

    </article>
  `;

  configurarGaleria(container, midia);
  equalizarAlturaCaixas(container);

  if (container._onResizeEqualizar) {
    window.removeEventListener('resize', container._onResizeEqualizar);
  }

  container._onResizeEqualizar = () => equalizarAlturaCaixas(container);
  window.addEventListener('resize', container._onResizeEqualizar);
}