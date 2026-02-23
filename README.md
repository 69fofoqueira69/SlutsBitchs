# Catálogo de Perfis

Projeto em **HTML + CSS + JavaScript (ES Modules)** para listar personagens em cards clicáveis e abrir um perfil completo no estilo desktop semelhante a apps de match.

## Arquitetura (curta)

- `src/data/profiles.json`: base de dados mock no schema solicitado (`identity`, `basicPhysicalDetails`, `measurements`, `preferences`, `media`).
- `src/data/tagRules.js`: regras de classificação por faixa para idade e medidas.
- `src/data/repository.js`: carregamento, normalização e campos derivados (texto de busca, contadores de mídia, medidas visíveis por gênero).
- `src/pages/home.js` + `src/components/profileCard.js`: busca e grid de cards (imagem + nome + descrição curta), com o card inteiro como botão/link.
- `src/pages/profile.js` + `src/components/profileDetails.js`: página completa de personagem, com layout “tinder-like” para desktop e galeria de imagens.
- `src/styles/main.css`: tema visual e responsividade.

## Rodar localmente

```bash
python3 -m http.server 4173
```

- Home: `http://localhost:4173/index.html`
- Perfil: `http://localhost:4173/profile.html?id=mia-khalifa`
