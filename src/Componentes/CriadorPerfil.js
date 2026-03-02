import { calcularDadosIdade, calcularDadosMedida } from '../Dados/Parametros.js';
import { publicarNovoPerfilNoGithub } from '../Dados/GithubRepositorio.js';

const CAMPOS_MEDIDAS = {
  ass: { rotulo: 'bunda', obrigatorioPara: ['Mulher', 'Futanari', 'Femboy'] },
  cintura: { rotulo: 'cintura', obrigatorioPara: ['Mulher', 'Futanari', 'Femboy'] },
  coxas: { rotulo: 'coxas', obrigatorioPara: ['Mulher', 'Futanari', 'Femboy'] },
  peitos: { rotulo: 'peitos', obrigatorioPara: ['Mulher', 'Futanari'], appliesTo: ['Mulher', 'Futanari'] },
  buceta: { rotulo: 'buceta', obrigatorioPara: ['Mulher'], appliesTo: ['Mulher'] },
  anus: { rotulo: 'anus', obrigatorioPara: ['Mulher', 'Futanari', 'Femboy'] },
  tamanhoRola: { rotulo: 'tamanho da rola', obrigatorioPara: ['Futanari', 'Femboy'], appliesTo: ['Futanari', 'Femboy'] },
  grossuraRola: { rotulo: 'grossura da rola', obrigatorioPara: ['Futanari', 'Femboy'], appliesTo: ['Futanari', 'Femboy'] },
  bolas: { rotulo: 'bolas', obrigatorioPara: ['Futanari', 'Femboy'], appliesTo: ['Futanari', 'Femboy'] }
};

function slugify(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function textoOuPadrao(valor, padrao = '') {
  const texto = String(valor || '').trim();
  return texto || padrao;
}

function numeroOuZero(valor) {
  const numero = Number(valor);
  return Number.isFinite(numero) && numero > 0 ? numero : 0;
}

function medir(tipo, valor, genero) {
  const configuracao = CAMPOS_MEDIDAS[tipo] || {};
  const calculada = calcularDadosMedida(tipo, valor);

  return {
    value: valor,
    tag: calculada.tag,
    range: calculada.range,
    emoji: calculada.emoji,
    ...(configuracao.appliesTo ? { appliesTo: configuracao.appliesTo } : {}),
    ...(configuracao.obrigatorioPara && !configuracao.obrigatorioPara.includes(genero) ? { value: 0, tag: '', range: '' } : {})
  };
}

function validarCamposObrigatoriosPorGenero({ genero, nome, descricaoCurta, descricaoCompleta, idade, medidas }) {
  const faltando = [];

  if (!nome) faltando.push('nome');
  if (!descricaoCurta) faltando.push('descrição curta');
  if (!descricaoCompleta) faltando.push('descrição completa');
  if (!idade || idade < 18) faltando.push('idade válida (>=18)');

  for (const [campo, config] of Object.entries(CAMPOS_MEDIDAS)) {
    if (!config.obrigatorioPara?.includes(genero)) continue;
    if (!medidas[campo] || medidas[campo] <= 0) {
      faltando.push(config.rotulo);
    }
  }

  if (faltando.length) {
    throw new Error(`Está faltando dado obrigatório para o gênero "${genero}": ${faltando.join(', ')}.`);
  }
}

function criarPerfilBase(dadosBrutos) {
  const nome = textoOuPadrao(dadosBrutos.nome);
  const genero = textoOuPadrao(dadosBrutos.genero, 'Mulher');
  const universo = textoOuPadrao(dadosBrutos.universo, 'Original');
  const idadeValor = Math.trunc(Number(dadosBrutos.idade || 0));
  const descricaoCurta = textoOuPadrao(dadosBrutos.descricaoCurta);
  const descricaoCompleta = textoOuPadrao(dadosBrutos.descricaoCompleta);
  const medidasValores = Object.fromEntries(
    Object.keys(CAMPOS_MEDIDAS).map((campo) => [campo, numeroOuZero(dadosBrutos[campo])])
  );

  validarCamposObrigatoriosPorGenero({
    genero,
    nome,
    descricaoCurta,
    descricaoCompleta,
    idade: idadeValor,
    medidas: medidasValores
  });

  return {
    id: slugify(nome),
    identidade: {
      nome,
      genero,
      universo,
      idade: calcularDadosIdade(idadeValor)
    },
    descricaoCurta,
    detalhesFisicosBasicos: {
      altura: textoOuPadrao(dadosBrutos.altura),
      peso: textoOuPadrao(dadosBrutos.peso),
      especie: textoOuPadrao(dadosBrutos.especie),
      corCabelo: textoOuPadrao(dadosBrutos.corCabelo),
      estiloCabelo: textoOuPadrao(dadosBrutos.estiloCabelo),
      eyeColor: textoOuPadrao(dadosBrutos.eyeColor),
      pele: textoOuPadrao(dadosBrutos.pele)
    },
    medidas: Object.fromEntries(
      Object.keys(CAMPOS_MEDIDAS).map((campo) => [campo, medir(campo, medidasValores[campo], genero)])
    ),
    experienciaSexual: {
      rolasExperimentadas: Math.max(0, Number(dadosBrutos.rolasExperimentadas || 0)),
      contagemSexo: Math.max(0, Number(dadosBrutos.contagemSexo || 0))
    },
    preferencias: {
      fetiche: String(dadosBrutos.fetiches || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      posicaoFavorita: textoOuPadrao(dadosBrutos.posicaoFavorita),
      roupaFavorita: textoOuPadrao(dadosBrutos.roupaFavorita),
      ocupacao: textoOuPadrao(dadosBrutos.ocupacao)
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

          <label>Nome<input name="nome" type="text" placeholder=""></label>
          <label>Gênero<input name="genero" type="text" value="Mulher"></label>
          <label>Universo<input name="universo" type="text" placeholder=""></label>
          <label>Idade<input name="idade" type="number" min="18" placeholder=""></label>

          <label>Descrição curta<textarea name="descricaoCurta" placeholder=""></textarea></label>
          <label>Descrição completa<textarea name="descricaoCompleta" placeholder=""></textarea></label>
          <label>Fetiches (separados por vírgula)<input name="fetiches" type="text" placeholder=""></label>

          <label>Altura<input name="altura" type="text" placeholder=""></label>
          <label>Peso<input name="peso" type="text" placeholder=""></label>
          <label>Espécie<input name="especie" type="text" placeholder=""></label>
          <label>Cor do cabelo<input name="corCabelo" type="text" placeholder=""></label>
          <label>Estilo do cabelo<input name="estiloCabelo" type="text" placeholder=""></label>
          <label>Cor dos olhos<input name="eyeColor" type="text" placeholder=""></label>
          <label>Pele<input name="pele" type="text" placeholder=""></label>

          <label>Bunda (cm)<input name="ass" type="number" step="0.1" min="0" placeholder=""></label>
          <label>Cintura (cm)<input name="cintura" type="number" step="0.1" min="0" placeholder=""></label>
          <label>Coxas (cm)<input name="coxas" type="number" step="0.1" min="0" placeholder=""></label>
          <label>Peitos (cm)<input name="peitos" type="number" step="0.1" min="0" placeholder=""></label>
          <label>Buceta (cm)<input name="buceta" type="number" step="0.1" min="0" placeholder=""></label>
          <label>Anus (cm)<input name="anus" type="number" step="0.1" min="0" placeholder=""></label>
          <label>Tamanho rola (cm)<input name="tamanhoRola" type="number" step="0.1" min="0" placeholder=""></label>
          <label>Grossura rola (cm)<input name="grossuraRola" type="number" step="0.1" min="0" placeholder=""></label>
          <label>Bolas (cm)<input name="bolas" type="number" step="0.1" min="0" placeholder=""></label>

          <label>Parceiros registrados<input name="rolasExperimentadas" type="number" min="0" placeholder=""></label>
          <label>Experiências registradas<input name="contagemSexo" type="number" min="0" placeholder=""></label>
          <label>Posição favorita<input name="posicaoFavorita" type="text" placeholder=""></label>
          <label>Roupa favorita<input name="roupaFavorita" type="text" placeholder=""></label>
          <label>Ocupação<input name="ocupacao" type="text" placeholder=""></label>

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
      const perfil = criarPerfilBase(Object.fromEntries(dados.entries()));
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
