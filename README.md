# Catálogo de Perfis

Projeto em **HTML + CSS + JavaScript (ES Modules)** com menu de personagens, perfil detalhado e galeria de mídia.

## Arquitetura (curta)

- `src/Dados/Perfils.json`: base mock dos perfis (identidade, características, preferências e mídias).
- `src/Dados/Repositorio.js`: camada de leitura/normalização dos dados JSON para consumo pelas páginas.
- `src/Componentes/`: componentes reutilizáveis de interface (`Card`, `Detalhes`, `Galeria`, `Pesquisa`).
- `src/Paginas/`: scripts de entrada por página (`Menu.js`, `Perfil.js`, `Galeria.js`).
- `src/Estilos/Estilo.css`: estilos globais, responsividade e layout temático do perfil.

### Fluxo do perfil

1. `Perfil.html` carrega `src/Paginas/Perfil.js`.
2. `Perfil.js` lê `?id=` da URL e busca o perfil no repositório.
3. `src/Componentes/Detalhes.js` monta o layout completo com dados vindos do JavaScript.

## Rodar localmente

```bash
python3 -m http.server 4173
```

- Menu: `http://localhost:4173/index.html`
- Perfil: `http://localhost:4173/Perfil.html?id=MK`
- Galeria: `http://localhost:4173/Galeria.html?id=MK`
