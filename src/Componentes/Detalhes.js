import { buscarFotoPerfil } from './RotacaoMidia.js';

export function renderizarDetalhes(container, perfil) {
  if (!perfil) {
    container.innerHTML = '<p class="empty-state">Perfil não encontrado.</p>';
    return;
  }

  const capa = buscarFotoPerfil(perfil.midia);

  container.innerHTML = `
    <article class="perfil-layout" style="--perfil-bg: url('${capa}')">
      <div class="background"></div>

      <div class="container perfil-container">
        <div class="left-panel">
          <div class="back-button">
            <a href="./index.html" class="btn-layout">⬅ Voltar</a>
          </div>

          <div class="info-card">
            <div class="character-name">${perfil.nome}</div>

            <div class="info-list">
              <div class="info-item"><strong>Título:</strong> ${perfil.titulo}</div>
              <div class="info-item"><strong>Idade:</strong> ${perfil.idade}</div>
            </div>

            <div class="biography">
              <h3>Biografia</h3>
              <p>${perfil.biografia}</p>
            </div>
          </div>

          <div class="bottom-buttons">
            <a href="./Galeria.html?id=${perfil.id}" class="btn-layout">🖼 Galeria</a>
          </div>
        </div>

        <div class="character">
          <img src="${capa}" alt="${perfil.nome}" id="characterImage">
        </div>
      </div>
    </article>
  `;
}
