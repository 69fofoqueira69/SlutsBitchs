import { buscarPerfilPorId } from '../Dados/Repositorio.js';
import { configurarPaginaGaleria, renderizarPaginaGaleria } from '../Componentes/Galeria.js';

// Elemento raiz da página de galeria.
const raizGaleria = document.getElementById('Galeria-root');

// Ponto de entrada da tela de galeria.
async function iniciar() {
  try {
    // Lê o id do perfil a partir da query string (ex: ?id=MK).
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
      raizGaleria.innerHTML = '<p class="empty-state">Perfil não especificado.</p>';
      return;
    }

    const perfil = await buscarPerfilPorId(id);
    renderizarPaginaGaleria(raizGaleria, perfil);
    configurarPaginaGaleria(raizGaleria);
  } catch (erro) {
    raizGaleria.innerHTML = '<p class="empty-state">Erro ao carregar galeria.</p>';
    console.error(erro);
  }
}

iniciar();
