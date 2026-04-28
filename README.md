# Catálogo de Perfis

Projeto em **HTML + CSS + JavaScript (ES Modules)** com menu de perfis, página de detalhes e galeria de mídia.

## Arquitetura (curta)

- `src/data/perfis.json`: base mock principal com dados brutos dos perfis.
- `src/Dados/Repositorio.js`: camada de acesso/normalização dos dados vindos do JSON.
- `src/Dados/Parametros.js`: regras simples de classificação por faixa de idade.
- `src/Componentes/`: componentes reutilizáveis da interface (`Card`, `Detalhes`, `Galeria`, `Pesquisa`).
- `src/Paginas/`: scripts de entrada por página (`Menu.js`, `Perfil.js`, `Galeria.js`).
- `src/Estilos/Estilo.css`: estilos globais, responsividade e layout visual.

### Fluxo do perfil

1. `Perfil.html` carrega `src/Paginas/Perfil.js`.
2. `Perfil.js` lê `?id=` da URL e chama o repositório.
3. `Repositorio.js` carrega `src/data/perfis.json` e normaliza o objeto.
4. `src/Componentes/Detalhes.js` monta o layout completo da página.

## Rodar localmente

```bash
python3 -m http.server 4173
```

- Menu: `http://localhost:4173/index.html`
- Perfil: `http://localhost:4173/Perfil.html?id=MK`
- Galeria: `http://localhost:4173/Galeria.html?id=MK`
