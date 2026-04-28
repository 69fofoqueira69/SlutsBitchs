import { buscarFotoPerfil } from './RotacaoMidia.js';

export function renderizarDetalhes(container, perfil) {
  if (!perfil) {
    container.innerHTML = '<p class="empty-state">Perfil não encontrado.</p>';
    return;
  }

  const { identidade, preferencias, experienciaSexual, midia } = perfil;
  const capa = buscarFotoPerfil(midia);

  container.innerHTML = `
    <article class="perfil perfil-layout-duas-colunas">
      <div class="topo-perfil-wf">
        <a href="./index.html" class="botao-topo-perfil">VOLTAR</a>
        <a href="./Galeria.html?id=${perfil.id}" class="botao-topo-perfil">GALERIA</a>
      </div>

      <div class="conteudo-perfil-wf">
        <section class="info-perfil-wf">
          <h1>${identidade.nome}</h1>
          <ul class="lista-info-perfil-wf">
            <li><span>NOME:</span> <strong>${identidade.nome}</strong></li>
            <li><span>IDADE:</span> <strong>${identidade.idade.value}</strong></li>
            <li><span>GÊNERO:</span> <strong>${identidade.genero}</strong></li>
            <li><span>OCUPAÇÃO:</span> <strong>${preferencias.ocupacao}</strong></li>
            <li><span>QUANTIDADE DE SEXO:</span> <strong>${experienciaSexual.contagemSexo}</strong></li>
          </ul>

          <div class="biografia-perfil-wf">
            <h2>BIOGRAFIA:</h2>
            <p>${perfil.descricaoCompleta}</p>
          </div>
        </section>

        <section class="imagem-perfil-wf" aria-label="Imagem principal do perfil">
          <img class="perfil-media-principal" src="${capa}" alt="${identidade.nome}">
        </section>
      </div>
    </article>
  `;
}
