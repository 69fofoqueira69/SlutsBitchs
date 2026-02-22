# Catálogo Visual de Perfis (Base Dinâmica)

Base modular em **HTML + CSS + JavaScript (ES Modules)** com renderização dinâmica de perfis completos a partir de JSON.

## Estrutura

```txt
src/
  components/
    filters.js
    mediaGallery.js
    profileCard.js
    profileDetails.js
    searchBar.js
  data/
    profiles.json
    repository.js
    tagRules.js
    validation.js
  pages/
    home.js
    profile.js
  styles/
    main.css
```

## Arquitetura (resumo)

- **Fonte única de dados:** `src/data/profiles.json`.
- **Validação de contrato:** `validation.js` valida campos obrigatórios, inclusive objetos de idade e medidas no formato `{ value, tag, range, emoji }`.
- **Tags automáticas:** `tagRules.js` calcula idade (`calculateAgeTag` + `calculateAgeData`) e metadados das medidas (`calculateMeasurementData`) por faixa.
- **Renderização condicional:** `profileDetails.js` mostra blocos condicionais por gênero/tipo.
- **Galeria modal dinâmica:** `mediaGallery.js` cria botão “Abrir Galeria”, contadores e navegação com swipe.
- **Tema visual:** DeepPink + Lime aplicado no CSS global.

## Execução

```bash
python3 -m http.server 4173
```

- Home: `http://localhost:4173/index.html`
- Perfil: `http://localhost:4173/profile.html?id=aurora-nox`
