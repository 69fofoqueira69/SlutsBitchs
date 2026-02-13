function uniqueValues(profiles, field) {
  return [...new Set(profiles.flatMap((profile) => profile[field] || []))].sort();
}

function uniqueScalarValues(profiles, field) {
  return [...new Set(profiles.map((profile) => profile[field]).filter(Boolean))].sort();
}

function buildSelect(label, field, values) {
  const options = ['<option value="">Todos</option>']
    .concat(values.map((value) => `<option value="${value}">${value}</option>`))
    .join('');

  return `
    <label class="filter-block">
      <span>${label}</span>
      <select data-filter="${field}">${options}</select>
    </label>
  `;
}

function buildCheckboxGroup(label, field, values) {
  return `
    <fieldset class="filter-block">
      <legend>${label}</legend>
      <div class="checkbox-group">
        ${values
          .map(
            (value) => `
            <label class="checkbox-chip">
              <input type="checkbox" data-filter-group="${field}" value="${value}" />
              <span>${value}</span>
            </label>
          `
          )
          .join('')}
      </div>
    </fieldset>
  `;
}

export function renderFilters(container, profiles, onChange) {
  const types = uniqueScalarValues(profiles, 'type');
  const personalities = uniqueScalarValues(profiles, 'personality');
  const attributes = uniqueValues(profiles, 'attributes');
  const categories = uniqueValues(profiles, 'categories');

  container.innerHTML = `
    <div class="filters-wrap">
      ${buildSelect('Tipo de personagem', 'type', types)}
      ${buildSelect('Personalidade', 'personality', personalities)}
      ${buildCheckboxGroup('Atributos', 'attributes', attributes)}
      ${buildCheckboxGroup('Categorias', 'categories', categories)}
      <button id="clear-filters" class="btn ghost" type="button">Limpar filtros</button>
    </div>
  `;

  const state = {
    type: '',
    personality: '',
    attributes: [],
    categories: []
  };

  container.querySelectorAll('select[data-filter]').forEach((select) => {
    select.addEventListener('change', (event) => {
      state[event.target.dataset.filter] = event.target.value;
      onChange({ ...state });
    });
  });

  container.querySelectorAll('input[data-filter-group]').forEach((input) => {
    input.addEventListener('change', (event) => {
      const group = event.target.dataset.filterGroup;
      const selected = [...container.querySelectorAll(`input[data-filter-group="${group}"]:checked`)].map(
        (item) => item.value
      );
      state[group] = selected;
      onChange({ ...state });
    });
  });

  container.querySelector('#clear-filters').addEventListener('click', () => {
    state.type = '';
    state.personality = '';
    state.attributes = [];
    state.categories = [];

    container.querySelectorAll('select[data-filter]').forEach((select) => {
      select.value = '';
    });
    container.querySelectorAll('input[data-filter-group]').forEach((input) => {
      input.checked = false;
    });

    onChange({ ...state });
  });
}
