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
  const termo = estado.termoPesquisa.trim().toLowerCase();
  const filtrados = estado.perfils.filter((perfil) => perfil.textoPesquisavel.includes(termo));

  renderizarCards(raizCards, filtrados);

  if (contagemResultados) {
    contagemResultados.textContent = `${filtrados.length} perfil(is) encontrado(s)`;
  }
}

async function iniciar() {
  try {
    estado.perfils = await buscarPerfils();
    renderizarPesquisa(raizPesquisa, (termo) => {
      estado.termoPesquisa = termo;
      filtrarPerfils();
    });
    filtrarPerfils();
  } catch (erro) {
    raizCards.innerHTML = '<p class="empty-state">Erro ao carregar os perfis.</p>';
    console.error(erro);
  }
}

iniciar();
