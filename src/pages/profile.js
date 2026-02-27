import { buscarPerfilPorId } from '../Dados/Repositorio.js';
import { renderizarDetalhes } from '../Componentes/Detalhes.js';

const raizPerfil = document.getElementById('Perfil-root');

async function iniciar() {
  try {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
      raizPerfil.innerHTML = '<p class="empty-state">Perfil não especificado.</p>';
      return;
    }

    const perfil = await buscarPerfilPorId(id);
    renderizarDetalhes(raizPerfil, perfil);
  } catch (erro) {
    raizPerfil.innerHTML = '<p class="empty-state">Erro ao carregar perfil.</p>';
    console.error(erro);
  }
}

iniciar();
