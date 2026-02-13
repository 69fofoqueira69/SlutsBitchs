function uniqueArrayValues(profiles, field) {
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
      <select data-filter="${field}">
        ${options}
      </select>
    </label>
  `;
}

export function renderFilters(container, profiles, onChange) {
  const filters = [
    {
      label: 'Tipo de personagem',
      field: 'type',
      values: uniqueScalarValues(profiles, 'type')
    },
    {
      label: 'Personalidade',
      field: 'personality',
      values: uniqueScalarValues(profiles, 'personality')
    },
    {
      label: 'Atributo',
      field: 'attribute',
      values: uniqueArrayValues(profiles, 'attributes')
    },
    {
      label: 'Categoria',
      field: 'category',
      values: uniqueArrayValues(profiles, 'categories')
    },
    {
      label: 'Tag',
      field: 'tag',
      values: uniqueArrayValues(profiles, 'tags')
    }
  ];

  container.innerHTML = `
    <div class="filters-wrap">
      ${filters
        .map(({ label, field, values }) => buildSelect(label, field, values))
        .join('')}
      <button id="clear-filters" class="btn ghost" type="button">
        Limpar filtros
      </button>
    </div>
  `;

  const state = {
    type: '',
    personality: '',
    attribute: '',
    category: '',
    tag: ''
  };

  container.querySelectorAll('select[data-filter]').forEach((select) => {
    select.addEventListener('change', (event) => {
      const field = event.target.dataset.filter;
      state[field] = event.target.value;
      onChange({ ...state });
    });
  });

  container.querySelector('#clear-filters').addEventListener('click', () => {
    Object.keys(state).forEach((key) => {
      state[key] = '';
    });

    container.querySelectorAll('select[data-filter]').forEach((select) => {
      select.value = '';
    });

    onChange({ ...state });
  });
}
