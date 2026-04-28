import { renderizarCards } from '../Componentes/Card.js';
import { renderizarPesquisa } from '../Componentes/Pesquisa.js';
import { buscarPerfils } from '../Dados/Repositorio.js';

// Referências dos pontos da página onde o conteúdo será injetado.
const raizPesquisa = document.querySelector('#Pesquisa-root');
const raizCards = document.querySelector('#Perfis-root');
const contagemResultados = document.querySelector('#contagem-resultados');

// Estado mínimo da tela para pesquisa e lista.
const estado = {
  termoPesquisa: '',
  perfils: []
};

// Filtra perfis com base no texto pesquisado e atualiza UI.
function filtrarPerfils() {
  const termo = estado.termoPesquisa;
  const filtrados = estado.perfils.filter((perfil) => perfil.textoPesquisavel.includes(termo));

  renderizarCards(raizCards, filtrados);

  if (contagemResultados) {
    contagemResultados.textContent = `${filtrados.length} perfil(is) encontrado(s)`;
  }
}

// Busca dados do repositório e renderiza lista inicial.
async function carregarPerfis() {
  estado.perfils = await buscarPerfils();
  filtrarPerfils();
}

// Ponto de entrada da página index.
async function iniciar() {
  try {
    renderizarPesquisa(raizPesquisa, (termo) => {
      estado.termoPesquisa = termo;
      filtrarPerfils();
    });

    await carregarPerfis();
  } catch (erro) {
    raizCards.innerHTML = '<p class="empty-state">Erro ao carregar os perfis.</p>';
    console.error(erro);
  }
}

iniciar();
