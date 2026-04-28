import { buscarFotoPerfil } from './RotacaoMidia.js';

function obterTituloPerfil(perfil) {
  return perfil?.preferencias?.ocupacao || perfil?.identidade?.idade?.tag || 'Sem título';
}

export function renderizarDetalhes(container, perfil) {
  if (!perfil) {
    container.innerHTML = '<p class="empty-state">Perfil não encontrado.</p>';
    return;
  }

  const { identidade, preferencias, detalhesFisicosBasicos, midia } = perfil;
  const capa = buscarFotoPerfil(midia);
  const imagemFundo = midia?.fotoMenu || capa;
  const titulo = obterTituloPerfil(perfil);

  container.innerHTML = `
    <article class="perfil-layout" style="--perfil-bg: url('${imagemFundo}')">
      <div class="background"></div>

      <div class="container perfil-container">
        <div class="left-panel">
          <div class="back-button">
            <a href="./index.html" class="btn-layout">⬅ Voltar</a>
          </div>

          <div class="info-card">
            <div class="character-name">${identidade.nome}</div>

            <div class="info-list">
              <div class="info-item"><strong>Título:</strong> ${titulo}</div>
              <div class="info-item"><strong>Idade:</strong> ${identidade.idade.value} anos</div>
              <div class="info-item"><strong>Sexo:</strong> ${identidade.genero}</div>
              <div class="info-item"><strong>Profissão:</strong> ${preferencias.ocupacao}</div>
              <div class="info-item"><strong>Altura:</strong> ${detalhesFisicosBasicos.altura}</div>
            </div>

            <div class="biography">
              <h3>Biografia</h3>
              <p>${perfil.descricaoCompleta}</p>
            </div>
          </div>

          <div class="bottom-buttons">
            <a href="./Galeria.html?id=${perfil.id}" class="btn-layout">🖼 Galeria</a>
            <button id="btnRoupas" class="btn-layout" type="button">👗 Roupas</button>
          </div>
        </div>

        <div class="character">
          <img src="${capa}" alt="${identidade.nome}" id="characterImage">
        </div>
      </div>
    </article>
  `;

  container.querySelector('#btnRoupas')?.addEventListener('click', () => {
    window.alert('A seção de roupas estará disponível em breve.');
  });
}
