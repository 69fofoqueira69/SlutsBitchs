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
- **Busca orientada ao nome:** a barra de busca filtra apenas por `name`.
- **Filtros por dropdown dinâmico:** tipo, personalidade, atributo, categoria e tag são gerados automaticamente com base no JSON.
- **Cards 100% clicáveis:** toda a área do card navega para o perfil completo.

## Como rodar

```bash
python3 -m http.server 4173
```

Acesse:
- `http://localhost:4173/index.html`
- `http://localhost:4173/profile.html?id=aurora-nox`
