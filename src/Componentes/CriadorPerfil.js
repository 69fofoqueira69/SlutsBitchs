import { calcularDadosIdade, calcularDadosMedida } from '../Dados/Parametros.js';
import { publicarNovoPerfilNoGithub } from '../Dados/GithubRepositorio.js';

function slugify(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function criarPerfilBase({ nome, genero, universo, idade, descricaoCurta, descricaoCompleta, fetiches }) {
  return {
    id: slugify(nome),
    identidade: {
      nome,
      genero,
      universo,
      idade: calcularDadosIdade(Number(idade))
    },
    descricaoCurta,
    detalhesFisicosBasicos: {
      altura: '165 cm',
      peso: '55 kg',
      especie: 'Humana',
      corCabelo: 'Não informado',
      estiloCabelo: 'Não informado',
      eyeColor: 'Não informado',
      pele: 'Não informado'
    },
    medidas: {
      ass: calcularDadosMedida('ass', 88),
      cintura: calcularDadosMedida('cintura', 64),
      coxas: calcularDadosMedida('coxas', 52),
      peitos: { ...calcularDadosMedida('peitos', 90), appliesTo: ['Mulher', 'Futanari'] },
      buceta: { ...calcularDadosMedida('buceta', 2.5), appliesTo: ['Mulher'] },
      anus: calcularDadosMedida('anus', 6),
      tamanhoRola: { value: 0, tag: '', range: '', emoji: '🍆', appliesTo: ['Futanari', 'Femboy'] },
      grossuraRola: { value: 0, tag: '', range: '', emoji: '📏', appliesTo: ['Futanari', 'Femboy'] },
      bolas: { value: 0, tag: '', range: '', emoji: '🥚', appliesTo: ['Futanari', 'Femboy'] }
    },
    experienciaSexual: {
      rolasExperimentadas: 0,
      contagemSexo: 0
    },
    preferencias: {
      fetiche: fetiches,
      posicaoFavorita: 'Não informada',
      roupaFavorita: 'Não informada',
      ocupacao: 'Não informada'
    },
    descricaoCompleta,
    midia: {
      imagens: [],
      videos: [],
      gifs: [],
      contagens: {
        imagens: 0,
        videos: 0,
        gifs: 0
      }
    }
  };
}

export function renderizarCriadorPerfil(container, aoPublicarComSucesso) {
  container.innerHTML = `
    <button type="button" class="botao-admin" id="abrir-criador-perfil">Novo perfil</button>
    <dialog id="modal-criador-perfil" class="modal-admin">
      <form id="form-criador-perfil" class="form-admin">
        <h2>Criar perfil e publicar no GitHub</h2>
        <div class="grade-admin">
          <label>Token GitHub<input name="token" type="password" required autocomplete="off"></label>
          <label>Owner<input name="owner" type="text" required placeholder="seu-usuario"></label>
          <label>Repositório<input name="repo" type="text" required placeholder="SlutsBitchs"></label>
          <label>Branch<input name="branch" type="text" value="main" required></label>
          <label>Nome<input name="nome" type="text" required></label>
          <label>Gênero<input name="genero" type="text" value="Mulher" required></label>
          <label>Universo<input name="universo" type="text" value="Original" required></label>
          <label>Idade<input name="idade" type="number" min="18" value="22" required></label>
          <label>Descrição curta<textarea name="descricaoCurta" required></textarea></label>
          <label>Descrição completa<textarea name="descricaoCompleta" required></textarea></label>
          <label>Fetiches (separados por vírgula)<input name="fetiches" type="text" placeholder="Aventura, Dominância"></label>
          <label>Mídias (imagens, gifs e vídeos)
            <input name="midias" type="file" multiple accept="image/*,video/*">
          </label>
        </div>
        <p class="status-admin" id="status-criador"></p>
        <div class="acoes-admin">
          <button type="button" id="fechar-criador">Cancelar</button>
          <button type="submit">Enviar e atualizar site</button>
        </div>
      </form>
    </dialog>
  `;

  const abrir = container.querySelector('#abrir-criador-perfil');
  const modal = container.querySelector('#modal-criador-perfil');
  const fechar = container.querySelector('#fechar-criador');
  const form = container.querySelector('#form-criador-perfil');
  const status = container.querySelector('#status-criador');

  abrir?.addEventListener('click', () => modal?.showModal());
  fechar?.addEventListener('click', () => modal?.close());

  form?.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    status.textContent = 'Enviando...';

    const dados = new FormData(form);
    const token = String(dados.get('token') || '').trim();
    const owner = String(dados.get('owner') || '').trim();
    const repo = String(dados.get('repo') || '').trim();
    const branch = String(dados.get('branch') || '').trim();

    try {
      const perfil = criarPerfilBase({
        nome: String(dados.get('nome') || '').trim(),
        genero: String(dados.get('genero') || '').trim(),
        universo: String(dados.get('universo') || '').trim(),
        idade: Number(dados.get('idade') || 18),
        descricaoCurta: String(dados.get('descricaoCurta') || '').trim(),
        descricaoCompleta: String(dados.get('descricaoCompleta') || '').trim(),
        fetiches: String(dados.get('fetiches') || '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      });

      const arquivosMidia = Array.from(dados.getAll('midias')).filter((item) => item instanceof File);

      await publicarNovoPerfilNoGithub({ owner, repo, branch, token, perfil, arquivosMidia });

      status.textContent = 'Perfil publicado com sucesso! Atualizando listagem...';
      modal?.close();
      form.reset();
      aoPublicarComSucesso();
    } catch (erro) {
      status.textContent = erro instanceof Error ? erro.message : 'Erro ao publicar perfil.';
    }
  });
}
