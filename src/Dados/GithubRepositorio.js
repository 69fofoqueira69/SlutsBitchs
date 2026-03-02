const GITHUB_CONFIG = {
  owner: 'SEU_USUARIO_GITHUB',
  repo: 'SlutsBitchs',
  branch: 'main',
  token: 'SEU_TOKEN_GITHUB'
};

function validarConfiguracaoGithub() {
  const valores = Object.values(GITHUB_CONFIG).map((item) => String(item || '').trim());
  const faltando = valores.some((item) => !item || item.startsWith('SEU_'));

  if (faltando) {
    throw new Error('Configure owner/repo/branch/token em src/Dados/GithubRepositorio.js para publicar automaticamente.');
  }
}

function codificarBase64(texto) {
  return btoa(unescape(encodeURIComponent(texto)));
}

function decodificarBase64(base64) {
  return decodeURIComponent(escape(atob(base64.replace(/\n/g, ''))));
}

function montarCabecalhos() {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${GITHUB_CONFIG.token}`,
    'X-GitHub-Api-Version': '2022-11-28'
  };
}

function normalizarNomeArquivo(nome) {
  return nome
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

function identificarPastaMidia(arquivo) {
  if (arquivo.type === 'image/gif' || arquivo.name.toLowerCase().endsWith('.gif')) return 'src/Midia/Gifs';
  if (arquivo.type.startsWith('video/')) return 'src/Midia/Video';
  if (arquivo.type.startsWith('image/')) return 'src/Midia/Imagem';
  throw new Error(`Tipo de mídia não suportado: ${arquivo.name}`);
}

async function requisicaoGithub(url, options = {}) {
  const resposta = await fetch(url, options);
  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => ({}));
    throw new Error(erro?.message || 'Falha ao comunicar com a API do GitHub.');
  }
  return resposta.json();
}

async function buscarArquivo(path) {
  const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}?ref=${GITHUB_CONFIG.branch}`;
  return requisicaoGithub(url, { headers: montarCabecalhos() });
}

async function salvarArquivo({ path, conteudoBase64, shaAtual, mensagem }) {
  const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`;
  return requisicaoGithub(url, {
    method: 'PUT',
    headers: {
      ...montarCabecalhos(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: mensagem,
      content: conteudoBase64,
      branch: GITHUB_CONFIG.branch,
      sha: shaAtual
    })
  });
}

function arquivoParaBase64(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => resolve(String(leitor.result || '').split(',')[1] || '');
    leitor.onerror = () => reject(new Error(`Não foi possível ler o arquivo ${arquivo.name}.`));
    leitor.readAsDataURL(arquivo);
  });
}

async function carregarPerfisRemotos() {
  validarConfiguracaoGithub();
  const arquivoPerfis = await buscarArquivo('src/Dados/Perfils.json');
  const perfisAtuais = JSON.parse(decodificarBase64(arquivoPerfis.content));

  if (!Array.isArray(perfisAtuais)) throw new Error('Perfils.json remoto não está em formato de lista.');

  return { arquivoPerfis, perfisAtuais };
}

async function anexarMidias(perfil, arquivosMidia) {
  for (const arquivo of arquivosMidia) {
    const pasta = identificarPastaMidia(arquivo);
    const nomeArquivo = `${Date.now()}-${normalizarNomeArquivo(arquivo.name)}`;
    const caminho = `${pasta}/${nomeArquivo}`;

    await salvarArquivo({
      path: caminho,
      conteudoBase64: await arquivoParaBase64(arquivo),
      mensagem: `chore: adiciona mídia ${nomeArquivo}`
    });

    if (pasta.endsWith('/Gifs')) perfil.midia.gifs.push(`./${caminho}`);
    if (pasta.endsWith('/Video')) perfil.midia.videos.push(`./${caminho}`);
    if (pasta.endsWith('/Imagem')) perfil.midia.imagens.push(`./${caminho}`);
  }

  perfil.midia.contagens = {
    imagens: perfil.midia.imagens.length,
    videos: perfil.midia.videos.length,
    gifs: perfil.midia.gifs.length
  };
}

export async function publicarNovoPerfilNoGithub(perfil, arquivosMidia = []) {
  const { arquivoPerfis, perfisAtuais } = await carregarPerfisRemotos();

  if (perfisAtuais.some((item) => item.id === perfil.id)) {
    throw new Error(`Já existe perfil com id "${perfil.id}".`);
  }

  await anexarMidias(perfil, arquivosMidia);
  perfisAtuais.push(perfil);

  await salvarArquivo({
    path: 'src/Dados/Perfils.json',
    conteudoBase64: codificarBase64(JSON.stringify(perfisAtuais, null, 2)),
    shaAtual: arquivoPerfis.sha,
    mensagem: `feat: adiciona perfil ${perfil.id}`
  });
}

export async function atualizarPerfilNoGithub(perfilId, perfilAtualizado, arquivosMidia = []) {
  const { arquivoPerfis, perfisAtuais } = await carregarPerfisRemotos();
  const indice = perfisAtuais.findIndex((item) => item.id === perfilId);

  if (indice < 0) throw new Error('Perfil para edição não encontrado no repositório.');

  await anexarMidias(perfilAtualizado, arquivosMidia);
  perfisAtuais[indice] = perfilAtualizado;

  await salvarArquivo({
    path: 'src/Dados/Perfils.json',
    conteudoBase64: codificarBase64(JSON.stringify(perfisAtuais, null, 2)),
    shaAtual: arquivoPerfis.sha,
    mensagem: `feat: atualiza perfil ${perfilId}`
  });
}
