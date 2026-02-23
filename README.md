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
- **Normalização de schema:** `repository.js` adapta automaticamente perfis no formato legado ou no formato com blocos (`identity`, `basicPhysicalDetails`, `preferences`, `sexualExperience`) para evitar erros de carregamento.
- **Validação de contrato:** `validation.js` valida campos obrigatórios do perfil e objetos de idade/medidas no formato `{ value, tag, range, emoji }`.
- **Tags automáticas:** `tagRules.js` calcula idade (`calculateAgeTag` + `calculateAgeData`) e metadados das medidas (`calculateMeasurementData`) por faixa.
- **Renderização condicional:** `profileDetails.js` mostra blocos condicionais por gênero/tipo e exibe apenas os dados principais (sem mostrar limites/faixas na UI).
- **Galeria modal dinâmica:** `mediaGallery.js` cria contadores de mídia (inclusive quando vazios) e galeria com navegação por swipe.
- **Tema visual:** DeepPink + Lime aplicado no CSS global.

## Execução

```bash
python3 -m http.server 4173
```

- Home: `http://localhost:4173/index.html`
- Perfil: `http://localhost:4173/profile.html?id=mia-khalifa`

## Fluxo recomendado para evitar conflito no pull

- O arquivo `src/data/profiles.json` está configurado em `.gitattributes` com `merge=ours`.
- Em conflitos de merge/pull nesse arquivo, o Git preserva a sua versão local para evitar bloqueio por conflito textual.
- Depois do `pull`, revise manualmente se precisa copiar alguma alteração remota para o seu JSON local.
