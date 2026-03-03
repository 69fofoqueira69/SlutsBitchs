import { renderizarCards } from '../Componentes/Card.js';
import { renderizarPesquisa } from '../Componentes/Pesquisa.js';
import { buscarPerfils } from '../Dados/Repositorio.js';

const raizPesquisa = document.querySelector('#Pesquisa-root');
const raizCards = document.querySelector('#Perfis-root');
const contagemResultados = document.querySelector('#contagem-resultados');

const estado = {
  termoPesquisa: '',
  perfils: []
};

function filtrarPerfils() {
  const termo = estado.termoPesquisa;
  const filtrados = estado.perfils.filter((perfil) => perfil.textoPesquisavel.includes(termo));

  renderizarCards(raizCards, filtrados);

  if (contagemResultados) {
    contagemResultados.textContent = `${filtrados.length} perfil(is) encontrado(s)`;
  }
}

async function carregarPerfis() {
  estado.perfils = await buscarPerfils();
  filtrarPerfils();
}

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
