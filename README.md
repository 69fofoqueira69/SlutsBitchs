# Catálogo Visual de Perfis (Base Inicial Evolutiva)

Base modular em **HTML + CSS + JavaScript (ES Modules)** para um site interativo de perfis com foco em escalabilidade.

## Estrutura

```txt
.
├── index.html
├── profile.html
└── src
    ├── components
    │   ├── filters.js
    │   ├── mediaGallery.js
    │   ├── profileCard.js
    │   ├── profileDetails.js
    │   └── searchBar.js
    ├── data
    │   ├── profiles.json
    │   ├── repository.js
    │   └── validation.js
    ├── pages
    │   ├── home.js
    │   └── profile.js
    └── styles
        └── main.css
```

## Decisões de arquitetura

- **Módulos por responsabilidade:** componentes de UI desacoplados de páginas e dados.
- **Adapter de dados (`repository.js`):** isola acesso para facilitar troca de JSON por API no futuro.
- **Validação inicial (`validation.js`):** garante formato mínimo dos perfis e evita renderizações quebradas.
- **Filtro combinado e expansível:** busca textual + filtros por tipo, personalidade, atributos e categorias em conjunto.
- **Perfil com conteúdo extensível:** `extraContent` é renderizado dinamicamente, aceitando novos blocos sem alteração estrutural da página.

## Como rodar

```bash
python3 -m http.server 4173
```

Acesse:
- `http://localhost:4173/index.html`
- `http://localhost:4173/profile.html?id=aurora-nox`

## Estrutura de dados dos perfis

Cada perfil usa um formato que facilita evolução:

- Campos básicos (`id`, `name`, `title`, `description`).
- Filtros (`type`, `personality`, `attributes`, `categories`, `tags`).
- Mídia (`media.cover`, `media.images`, `media.videos`, `media.gifs`).
- Bloco aberto (`extraContent`) para novos tipos de conteúdo.

## Próximos passos recomendados

- Persistência em API e paginação.
- Ordenação e filtros salvos em URL.
- Testes automatizados de UI e contrato de dados.
- Suporte a novos tipos multimídia (áudio, documentos e embeds).
