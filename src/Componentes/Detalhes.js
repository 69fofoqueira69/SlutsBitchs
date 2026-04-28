import { buscarFotoPerfil } from './RotacaoMidia.js';

export function renderizarDetalhes(container, perfil) {
  if (!perfil) {
    container.innerHTML = '<p class="empty-state">Perfil não encontrado.</p>';
    return;
  }

  const { identidade, preferencias, experienciaSexual, midia } = perfil;
  const capa = buscarFotoPerfil(midia);

  container.innerHTML = `
    <article class="perfil perfil-modelo-wireframe">
      <div class="topo-wireframe">
        <a href="./index.html" class="link-wireframe botao-wireframe-esquerda">VOLTAR</a>
        <a href="./Galeria.html?id=${perfil.id}" class="link-wireframe botao-wireframe-direita">GALERIA</a>
      </div>

      <div class="layout-perfil-wireframe">
        <section class="painel-info-wireframe">
          <p><strong>NOME:</strong> ${identidade.nome}</p>
          <p><strong>IDADE:</strong> ${identidade.idade.value}</p>
          <p><strong>GENERO:</strong> ${identidade.genero}</p>
          <p><strong>OCUPAÇÃO:</strong> ${preferencias.ocupacao}</p>
          <p><strong>Quantidade de Sexo:</strong> ${experienciaSexual.contagemSexo}</p>

          <h2>BIOGRAFIA:</h2>
          <p class="bio-wireframe">${perfil.descricaoCompleta}</p>
        </section>

        <section class="painel-imagem-wireframe">
          <img class="perfil-media-principal" src="${capa}" alt="${identidade.nome}">
        </section>
      </div>
    </article>
  `;
}
