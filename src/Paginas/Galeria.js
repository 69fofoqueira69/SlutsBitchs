import { buscarPerfilPorId } from '../Dados/Repositorio.js';
import { configurarPaginaGaleria, renderizarPaginaGaleria } from '../Componentes/Galeria.js';

const raizGaleria = document.getElementById('Galeria-root');

async function iniciar() {
  try {
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
