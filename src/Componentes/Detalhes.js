import { buscarFotoPerfil } from './RotacaoMidia.js';

export function renderizarDetalhes(container, perfil) {
  if (!perfil) {
    container.innerHTML = '<p class="empty-state">Perfil não encontrado.</p>';
    return;
  }

  const { identidade, preferencias, experienciaSexual, midia } = perfil;
  const capa = buscarFotoPerfil(midia);

  container.innerHTML = `
    <article class="perfil-wireframe">
      <div class="perfil-wireframe-acoes">
        <a href="./index.html" class="botao-wireframe">VOLTAR</a>
        <a href="./Galeria.html?id=${perfil.id}" class="botao-wireframe">GALERIA</a>
      </div>

      <div class="perfil-wireframe-conteudo">
        <section class="card-wireframe card-wireframe-info">
          <p><strong>NOME:</strong> ${identidade.nome}</p>
          <p><strong>IDADE:</strong> ${identidade.idade.value}</p>
          <p><strong>GENERO:</strong> ${identidade.genero}</p>
          <p><strong>OCUPAÇÃO:</strong> ${preferencias.ocupacao}</p>
          <p><strong>Quantidade de Sexo:</strong> ${experienciaSexual.contagemSexo}</p>
          <p><strong>BIOGRAFIA:</strong></p>
          <p class="biografia-wireframe">${perfil.descricaoCompleta}</p>
        </section>

        <nav class="menu-lateral-wireframe" aria-label="Ações do perfil">
          <a href="./Galeria.html?id=${perfil.id}" class="menu-item-wireframe">GALERIA</a>
          <button type="button" class="menu-item-wireframe">DIÁRIO</button>
          <button type="button" class="menu-item-wireframe">FAVORITA</button>
          <a href="./index.html" class="menu-item-wireframe">SAIR</a>
        </nav>

        <section class="card-wireframe card-wireframe-imagem">
          <img class="perfil-wireframe-img" src="${capa}" alt="${identidade.nome}">
        </section>
      </div>
    </article>
  `;
}
