import { buscarPerfilPorId } from '../Dados/Repositorio.js';
import { renderizarDetalhes } from '../Componentes/Detalhes.js';

// Elemento raiz da página de perfil.
const raizPerfil = document.getElementById('Perfil-root');

// Ponto de entrada da tela de perfil.
async function iniciar() {
  try {
    // Lê o id do perfil a partir da query string (ex: ?id=MK).
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
