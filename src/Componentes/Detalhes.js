import { buscarMedidasVisiveis } from '../Dados/Repositorio.js';
import { buscarFotoCapa } from './RotacaoMidia.js';
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

export function renderizarDetalhes(container, perfil) {
  if (!perfil) {
    container.innerHTML = '<p class="empty-state">Perfil não encontrado.</p>';
    return;
  }

  const { identidade, detalhesFisicosBasicos, preferencias, experienciaSexual, midia } = perfil;
  const medidas = buscarMedidasVisiveis(perfil);
  const capa = buscarFotoCapa(midia);

  container.innerHTML = `
    <a href="./index.html" class="link">← Voltar</a>
    <article class="perfil">
      <div class="linha-perfil">
        <div class="heroi-perfil">
          <img class="perfil-media-principal" src="${capa}" alt="${identidade.nome}">
          <div class="sobreposicao-perfil">
            <h1>${identidade.nome}, ${identidade.idade.value}</h1>
            <p>${identidade.genero} • ${identidade.universo}</p>
          </div>
        </div>

        <section class="secao-sobre">
          <h2>Sobre</h2>
          <p>${perfil.descricaoCompleta}</p>
        </section>
      </div>

      <div class="linha-perfil">
        <section>
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

        <section>
          <h2>Medidas</h2>
          <ul class="lista-detalhes">
            ${medidas.map(renderizarItemMedida).join('')}
          </ul>
        </section>
      </div>

      <div class="linha-perfil">
        <section>
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

        ${renderizarGaleria(midia)}
      </div>
    </article>
  `;

  configurarGaleria(container);
}
