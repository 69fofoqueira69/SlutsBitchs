export function renderSearchBar(container, onSearch) {
  container.innerHTML = `
    <label class="search-wrap">
      <span>Buscar perfil por nome</span>
      <input
        id="search-input"
        type="search"
        placeholder="Digite o nome do perfil"
      />
    </label>
  `;

  const input = container.querySelector('#search-input');
  input.addEventListener('input', (event) => {
    onSearch(event.target.value);
  });
}
