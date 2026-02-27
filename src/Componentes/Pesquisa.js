export function renderizarPesquisa(container, aoPesquisar) {
  container.innerHTML = `
    <div class="search-wrap">
      <label for="search-input">Buscar perfil por nome</label>
      <input type="text" id="search-input" placeholder="Digite o nome...">
    </div>
  `;

  const input = container.querySelector('#search-input');
  if (input) {
    input.addEventListener('input', (evento) => aoPesquisar(evento.target.value.trim().toLowerCase()));
  }
}