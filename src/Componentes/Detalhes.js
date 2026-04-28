import { buscarMedidasVisiveis } from '../Dados/Repositorio.js';
import { buscarFotoPerfil } from './RotacaoMidia.js';

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
  const capa = buscarFotoPerfil(midia);

  container.innerHTML = `
    <article class="perfil perfil-modelo-jogo">
      <div class="acoes-perfil-topo">
        <a href="./index.html" class="link">← Voltar</a>
        <a href="./Galeria.html?id=${perfil.id}" class="link">Ver galeria →</a>
      </div>

      <div class="cabecalho-perfil-jogo">
        <section class="heroi-perfil heroi-perfil-jogo">
          <img class="perfil-media-principal" src="${capa}" alt="${identidade.nome}">
        </section>

        <section class="painel-info-perfil-jogo">
          <h1>${identidade.nome}</h1>
          <p>${identidade.genero} • ${identidade.universo}</p>
          <ul class="lista-detalhes">
            <li><span>Idade</span><strong>${identidade.idade.value} anos</strong></li>
            <li><span>Altura</span><strong>${detalhesFisicosBasicos.altura}</strong></li>
            <li><span>Peso</span><strong>${detalhesFisicosBasicos.peso}</strong></li>
            <li><span>Experiências</span><strong>${experienciaSexual.contagemSexo}</strong></li>
            <li><span>Parceiros</span><strong>${experienciaSexual.rolasExperimentadas}</strong></li>
            <li><span>Ocupação</span><strong>${preferencias.ocupacao}</strong></li>
          </ul>
        </section>
      </div>

      <div class="linha-perfil">
        <section class="secao-sobre">
          <h2>Sobre</h2>
          <p>${perfil.descricaoCompleta}</p>
        </section>

        <section>
          <h2>Medidas</h2>
          <ul class="lista-detalhes">
            ${medidas.map(renderizarItemMedida).join('')}
          </ul>
        </section>
      </div>
    </article>
  `;
}
