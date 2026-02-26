# Catálogo de Perfis

Projeto em **HTML + CSS + JavaScript (ES Modules)** para listar personagens em cards clicáveis e abrir um perfil completo no estilo desktop semelhante a apps de match.

## Arquitetura (curta)

- `src/Dados/Perfils.json`: base mock de perfis com chaves em português (`identidade`, `detalhesFisicosBasicos`, `medidas`, `preferencias`, `midia`).
- `src/Dados/Parametros.js`: regras de classificação por faixa para idade e medidas.
- `src/Dados/Repositorio.js`: carregamento, normalização e campos derivados (texto de busca, contagens de mídia, medidas visíveis por gênero).
- `src/Paginas/Menu.js` + `src/Componentes/Card.js`: busca e grid de cards (imagem + nome + descrição curta).
- `src/Paginas/Perfil.js` + `src/Componentes/Detalhes.js`: página completa do perfil com layout dividido em duas colunas e galeria.
- `src/Estilos/Estilo.css`: tema visual e responsividade.

## Rodar localmente

```bash
python3 -m http.server 4173
```

- Menu: `http://localhost:4173/index.html`
- Perfil: `http://localhost:4173/Perfil.html?id=mia-khalifa`
