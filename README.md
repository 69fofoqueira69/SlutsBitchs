# Catálogo de Perfis

Projeto em **HTML + CSS + JavaScript (ES Modules)** para listar personagens em cards clicáveis e abrir um perfil completo no estilo desktop semelhante a apps de match.

## Arquitetura (curta)

- `src/Dados/Perfils.json`: base mock de perfis com chaves em português (`identidade`, `detalhesFisicosBasicos`, `medidas`, `preferencias`, `midia`) e controle de capa por contexto (`midia.fotoMenu` e `midia.fotoPerfil`).
- `src/Dados/Parametros.js`: regras de classificação por faixa para idade e medidas.
- `src/Dados/Repositorio.js`: carregamento, normalização e campos derivados (texto de busca, total de mídias de imagens+GIFs e medidas visíveis por gênero).
- `src/Paginas/Menu.js` + `src/Componentes/Card.js`: busca e grid de cards (imagem + nome + descrição curta).
- `src/Paginas/Perfil.js` + `src/Componentes/Detalhes.js`: página de perfil em layout wireframe de tela cheia (botões no topo, painel de dados à esquerda e imagem em destaque à direita).
- `src/Paginas/Galeria.js` + `src/Componentes/Galeria.js`: página dedicada de galeria com grade de miniaturas e preview lateral da mídia selecionada.
- `src/Estilos/Estilo.css`: tema visual e responsividade.

## Rodar localmente

```bash
python3 -m http.server 4173
```

- Menu: `http://localhost:4173/index.html`
- Perfil: `http://localhost:4173/Perfil.html?id=MK`
