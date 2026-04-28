import { buscarFotoPerfil } from './RotacaoMidia.js';

function formatarBiografia(texto = '') {
  return texto
    .split(/\n+/)
    .filter(Boolean)
    .map((linha) => `<span>${linha}</span>`)
    .join('');
}

export function renderizarDetalhes(container, perfil) {
  if (!perfil) {
    container.innerHTML = '<p class="empty-state">Perfil não encontrado.</p>';
    return;
  }

  const { identidade, preferencias, experienciaSexual, midia } = perfil;
  const capa = buscarFotoPerfil(midia);

  container.innerHTML = `
    <article class="perfil-wireframe-page">
      <a href="./index.html" class="perfil-wireframe-btn perfil-wireframe-btn-back">VOLTAR</a>
      <a href="./Galeria.html?id=${perfil.id}" class="perfil-wireframe-btn perfil-wireframe-btn-gallery">GALERIA</a>

      <section class="perfil-wireframe-info">
        <p><strong>NOME:</strong> ${identidade.nome}</p>
        <p><strong>IDADE:</strong> ${identidade.idade.value}</p>
        <p><strong>GENERO:</strong> ${identidade.genero}</p>
        <p><strong>OCUPAÇÃO:</strong> ${preferencias.ocupacao}</p>
        <p><strong>Quantidade de Sexo:</strong> ${experienciaSexual.contagemSexo}</p>

        <h1>BIOGRAFIA:</h1>
        <div class="perfil-wireframe-bio">${formatarBiografia(perfil.descricaoCompleta)}</div>
      </section>

      <section class="perfil-wireframe-media" aria-label="Imagem do perfil">
        <img src="${capa}" alt="Imagem de ${identidade.nome}">
      </section>
    </article>
  `;
}
