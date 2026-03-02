import { calcularDadosIdade, calcularDadosMedida } from '../Dados/Parametros.js';
import { atualizarPerfilNoGithub, publicarNovoPerfilNoGithub } from '../Dados/GithubRepositorio.js';

function slugify(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function textoLista(valor) {
  return String(valor || '').split(',').map((item) => item.trim()).filter(Boolean);
}

function numero(valor, fallback = 0) {
  const n = Number(valor);
  return Number.isFinite(n) ? n : fallback;
}

function montarPerfil(form) {
  const nome = form.get('nome');
  const genero = form.get('genero');

  const medidasBase = {
    ass: numero(form.get('ass')),
    cintura: numero(form.get('cintura')),
    coxas: numero(form.get('coxas')),
    peitos: numero(form.get('peitos')),
    buceta: numero(form.get('buceta')),
    anus: numero(form.get('anus')),
    tamanhoRola: numero(form.get('tamanhoRola')),
    grossuraRola: numero(form.get('grossuraRola')),
    bolas: numero(form.get('bolas'))
  };

  const perfil = {
    id: slugify(form.get('id') || nome),
    identidade: {
      nome: String(nome || ''),
      genero: String(genero || ''),
      universo: String(form.get('universo') || ''),
      idade: calcularDadosIdade(numero(form.get('idade')))
    },
    descricaoCurta: String(form.get('descricaoCurta') || ''),
    detalhesFisicosBasicos: {
      altura: String(form.get('altura') || ''),
      peso: String(form.get('peso') || ''),
      especie: String(form.get('especie') || ''),
      corCabelo: String(form.get('corCabelo') || ''),
      estiloCabelo: String(form.get('estiloCabelo') || ''),
      eyeColor: String(form.get('eyeColor') || ''),
      pele: String(form.get('pele') || '')
    },
    medidas: {
      ass: calcularDadosMedida('ass', medidasBase.ass),
      cintura: calcularDadosMedida('cintura', medidasBase.cintura),
      coxas: calcularDadosMedida('coxas', medidasBase.coxas),
      peitos: { ...calcularDadosMedida('peitos', medidasBase.peitos), appliesTo: ['Mulher', 'Futanari'] },
      buceta: { ...calcularDadosMedida('buceta', medidasBase.buceta), appliesTo: ['Mulher'] },
      anus: calcularDadosMedida('anus', medidasBase.anus),
      tamanhoRola: { ...calcularDadosMedida('tamanhoRola', medidasBase.tamanhoRola), appliesTo: ['Futanari', 'Femboy'] },
      grossuraRola: { ...calcularDadosMedida('grossuraRola', medidasBase.grossuraRola), appliesTo: ['Futanari', 'Femboy'] },
      bolas: { ...calcularDadosMedida('bolas', medidasBase.bolas), appliesTo: ['Futanari', 'Femboy'] }
    },
    experienciaSexual: {
      rolasExperimentadas: numero(form.get('rolasExperimentadas')),
      contagemSexo: numero(form.get('contagemSexo'))
    },
    preferencias: {
      fetiche: textoLista(form.get('fetiche')),
      posicaoFavorita: String(form.get('posicaoFavorita') || ''),
      roupaFavorita: String(form.get('roupaFavorita') || ''),
      ocupacao: String(form.get('ocupacao') || '')
    },
    descricaoCompleta: String(form.get('descricaoCompleta') || ''),
    midia: {
      imagens: textoLista(form.get('imagensExistentes')),
      videos: textoLista(form.get('videosExistentes')),
      gifs: textoLista(form.get('gifsExistentes')),
      contagens: { imagens: 0, videos: 0, gifs: 0 }
    }
  };

  perfil.midia.contagens = {
    imagens: perfil.midia.imagens.length,
    videos: perfil.midia.videos.length,
    gifs: perfil.midia.gifs.length
  };

  return perfil;
}

function preencherFormulario(formEl, perfil) {
  formEl.querySelector('[name="id"]').value = perfil.id || '';
  formEl.querySelector('[name="nome"]').value = perfil.identidade?.nome || '';
  formEl.querySelector('[name="genero"]').value = perfil.identidade?.genero || '';
  formEl.querySelector('[name="universo"]').value = perfil.identidade?.universo || '';
  formEl.querySelector('[name="idade"]').value = perfil.identidade?.idade?.value || 0;
  formEl.querySelector('[name="descricaoCurta"]').value = perfil.descricaoCurta || '';
  formEl.querySelector('[name="descricaoCompleta"]').value = perfil.descricaoCompleta || '';

  const detalhes = perfil.detalhesFisicosBasicos || {};
  formEl.querySelector('[name="altura"]').value = detalhes.altura || '';
  formEl.querySelector('[name="peso"]').value = detalhes.peso || '';
  formEl.querySelector('[name="especie"]').value = detalhes.especie || '';
  formEl.querySelector('[name="corCabelo"]').value = detalhes.corCabelo || '';
  formEl.querySelector('[name="estiloCabelo"]').value = detalhes.estiloCabelo || '';
  formEl.querySelector('[name="eyeColor"]').value = detalhes.eyeColor || '';
  formEl.querySelector('[name="pele"]').value = detalhes.pele || '';

  const medidas = perfil.medidas || {};
  formEl.querySelector('[name="ass"]').value = medidas.ass?.value ?? '';
  formEl.querySelector('[name="cintura"]').value = medidas.cintura?.value ?? '';
  formEl.querySelector('[name="coxas"]').value = medidas.coxas?.value ?? '';
  formEl.querySelector('[name="peitos"]').value = medidas.peitos?.value ?? '';
  formEl.querySelector('[name="buceta"]').value = medidas.buceta?.value ?? '';
  formEl.querySelector('[name="anus"]').value = medidas.anus?.value ?? '';
  formEl.querySelector('[name="tamanhoRola"]').value = medidas.tamanhoRola?.value ?? '';
  formEl.querySelector('[name="grossuraRola"]').value = medidas.grossuraRola?.value ?? '';
  formEl.querySelector('[name="bolas"]').value = medidas.bolas?.value ?? '';

  const experiencia = perfil.experienciaSexual || {};
  formEl.querySelector('[name="rolasExperimentadas"]').value = experiencia.rolasExperimentadas ?? '';
  formEl.querySelector('[name="contagemSexo"]').value = experiencia.contagemSexo ?? '';

  const preferencias = perfil.preferencias || {};
  formEl.querySelector('[name="fetiche"]').value = (preferencias.fetiche || []).join(', ');
  formEl.querySelector('[name="posicaoFavorita"]').value = preferencias.posicaoFavorita || '';
  formEl.querySelector('[name="roupaFavorita"]').value = preferencias.roupaFavorita || '';
  formEl.querySelector('[name="ocupacao"]').value = preferencias.ocupacao || '';

  const midia = perfil.midia || {};
  formEl.querySelector('[name="imagensExistentes"]').value = (midia.imagens || []).join(', ');
  formEl.querySelector('[name="videosExistentes"]').value = (midia.videos || []).join(', ');
  formEl.querySelector('[name="gifsExistentes"]').value = (midia.gifs || []).join(', ');
}

function estruturaCampos() {
  return `
    <label>ID (opcional)<input name="id" type="text" placeholder="gera automático pelo nome"></label>
    <label>Nome<input name="nome" type="text" required></label>
    <label>Gênero<input name="genero" type="text" required value="Mulher"></label>
    <label>Universo<input name="universo" type="text" required value="Original"></label>
    <label>Idade<input name="idade" type="number" min="18" required value="22"></label>
    <label>Descrição curta<textarea name="descricaoCurta" required></textarea></label>
    <label class="campo-cheio">Descrição completa<textarea name="descricaoCompleta" required></textarea></label>

    <label>Altura<input name="altura" type="text" placeholder="165 cm" required></label>
    <label>Peso<input name="peso" type="text" placeholder="55 kg" required></label>
    <label>Espécie<input name="especie" type="text" required value="Humana"></label>
    <label>Cor de cabelo<input name="corCabelo" type="text" required></label>
    <label>Estilo de cabelo<input name="estiloCabelo" type="text" required></label>
    <label>Olhos<input name="eyeColor" type="text" required></label>
    <label>Pele<input name="pele" type="text" required></label>

    <label>Bunda (cm)<input name="ass" type="number" step="0.1" required></label>
    <label>Cintura (cm)<input name="cintura" type="number" step="0.1" required></label>
    <label>Coxas (cm)<input name="coxas" type="number" step="0.1" required></label>
    <label>Peitos (cm)<input name="peitos" type="number" step="0.1" required></label>
    <label>Buceta (cm)<input name="buceta" type="number" step="0.1" required></label>
    <label>Cu (cm)<input name="anus" type="number" step="0.1" required></label>
    <label>Tamanho rola (cm)<input name="tamanhoRola" type="number" step="0.1" value="0"></label>
    <label>Grossura rola (cm)<input name="grossuraRola" type="number" step="0.1" value="0"></label>
    <label>Bolas (cm)<input name="bolas" type="number" step="0.1" value="0"></label>

    <label>Rolas experimentadas<input name="rolasExperimentadas" type="number" required value="0"></label>
    <label>Contagem sexo<input name="contagemSexo" type="number" required value="0"></label>
    <label>Fetiches (separar por vírgula)<input name="fetiche" type="text"></label>
    <label>Posição favorita<input name="posicaoFavorita" type="text" required></label>
    <label>Roupa favorita<input name="roupaFavorita" type="text" required></label>
    <label>Ocupação<input name="ocupacao" type="text" required></label>

    <label class="campo-cheio">Imagens existentes (caminhos separados por vírgula)
      <textarea name="imagensExistentes"></textarea>
    </label>
    <label class="campo-cheio">Vídeos existentes (caminhos separados por vírgula)
      <textarea name="videosExistentes"></textarea>
    </label>
    <label class="campo-cheio">GIFs existentes (caminhos separados por vírgula)
      <textarea name="gifsExistentes"></textarea>
    </label>

    <label class="campo-cheio">Enviar mídias novas (todas juntas; separação automática)
      <input name="midias" type="file" multiple accept="image/*,video/*">
    </label>
  `;
}

export function renderizarCriadorPerfil(container, { aoPublicarComSucesso, buscarPerfisAtuais }) {
  container.innerHTML = `
    <div class="acoes-topo-admin">
      <button type="button" class="botao-admin destaque" id="abrir-criador-perfil">Criar perfil</button>
      <button type="button" class="botao-admin" id="abrir-editor-perfil">Editar perfil</button>
    </div>

    <dialog id="modal-criador-perfil" class="modal-admin">
      <form id="form-criador-perfil" class="form-admin">
        <h2>Criar novo perfil</h2>
        <div class="grade-admin">${estruturaCampos()}</div>
        <p class="status-admin" id="status-criador"></p>
        <div class="acoes-admin">
          <button type="button" data-fechar="criador">Cancelar</button>
          <button type="submit" class="destaque">Salvar novo perfil</button>
        </div>
      </form>
    </dialog>

    <dialog id="modal-editor-perfil" class="modal-admin">
      <form id="form-editor-perfil" class="form-admin">
        <h2>Editar perfil existente</h2>
        <label>Perfil
          <select id="seletor-perfil-edicao" required>
            <option value="">Selecione...</option>
          </select>
        </label>
        <div class="grade-admin">${estruturaCampos()}</div>
        <p class="status-admin" id="status-editor"></p>
        <div class="acoes-admin">
          <button type="button" data-fechar="editor">Cancelar</button>
          <button type="submit" class="destaque">Salvar edição</button>
        </div>
      </form>
    </dialog>
  `;

  const btnCriar = container.querySelector('#abrir-criador-perfil');
  const btnEditar = container.querySelector('#abrir-editor-perfil');
  const modalCriador = container.querySelector('#modal-criador-perfil');
  const modalEditor = container.querySelector('#modal-editor-perfil');
  const formCriador = container.querySelector('#form-criador-perfil');
  const formEditor = container.querySelector('#form-editor-perfil');
  const seletor = container.querySelector('#seletor-perfil-edicao');
  const statusCriador = container.querySelector('#status-criador');
  const statusEditor = container.querySelector('#status-editor');

  function preencherSeletor() {
    const perfis = buscarPerfisAtuais();
    seletor.innerHTML = '<option value="">Selecione...</option>' + perfis.map((perfil) => (
      `<option value="${perfil.id}">${perfil.identidade.nome} (${perfil.id})</option>`
    )).join('');
  }

  btnCriar?.addEventListener('click', () => modalCriador?.showModal());
  btnEditar?.addEventListener('click', () => {
    preencherSeletor();
    modalEditor?.showModal();
  });

  container.querySelectorAll('[data-fechar="criador"]').forEach((btn) => btn.addEventListener('click', () => modalCriador?.close()));
  container.querySelectorAll('[data-fechar="editor"]').forEach((btn) => btn.addEventListener('click', () => modalEditor?.close()));

  seletor?.addEventListener('change', () => {
    const perfil = buscarPerfisAtuais().find((item) => item.id === seletor.value);
    if (perfil) preencherFormulario(formEditor, perfil);
  });

  formCriador?.addEventListener('submit', async (event) => {
    event.preventDefault();
    statusCriador.textContent = 'Publicando perfil...';
    try {
      const dados = new FormData(formCriador);
      const perfil = montarPerfil(dados);
      const arquivosMidia = Array.from(dados.getAll('midias')).filter((item) => item instanceof File);
      await publicarNovoPerfilNoGithub(perfil, arquivosMidia);
      statusCriador.textContent = 'Perfil criado com sucesso.';
      modalCriador?.close();
      await aoPublicarComSucesso();
    } catch (erro) {
      statusCriador.textContent = erro instanceof Error ? erro.message : 'Erro ao criar perfil.';
    }
  });

  formEditor?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const perfilId = seletor.value;
    if (!perfilId) {
      statusEditor.textContent = 'Selecione um perfil para editar.';
      return;
    }

    statusEditor.textContent = 'Salvando edição...';
    try {
      const dados = new FormData(formEditor);
      const perfil = montarPerfil(dados);
      perfil.id = perfilId;
      const arquivosMidia = Array.from(dados.getAll('midias')).filter((item) => item instanceof File);
      await atualizarPerfilNoGithub(perfilId, perfil, arquivosMidia);
      statusEditor.textContent = 'Perfil atualizado com sucesso.';
      modalEditor?.close();
      await aoPublicarComSucesso();
    } catch (erro) {
      statusEditor.textContent = erro instanceof Error ? erro.message : 'Erro ao editar perfil.';
    }
  });
}
