export function renderSearchBar(container, onSearch) {
  container.innerHTML = `
    <label class="search-wrap">
      <span>Buscar perfil</span>
      <input id="search-input" type="search" placeholder="Nome, descrição, tag..." />
    </label>
  `;

  const input = container.querySelector('#search-input');
  input.addEventListener('input', (event) => onSearch(event.target.value));
}
