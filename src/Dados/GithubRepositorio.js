function codificarBase64(texto) {
  return btoa(unescape(encodeURIComponent(texto)));
}

function decodificarBase64(base64) {
  return decodeURIComponent(escape(atob(base64.replace(/\n/g, ''))));
}

function montarCabecalhos(token) {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
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
  if (arquivo.type === 'image/gif' || arquivo.name.toLowerCase().endsWith('.gif')) {
    return 'src/Midia/Gifs';
  }

  if (arquivo.type.startsWith('video/')) {
    return 'src/Midia/Video';
  }

  if (arquivo.type.startsWith('image/')) {
    return 'src/Midia/Imagem';
  }

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

async function buscarArquivo({ owner, repo, branch, path, token }) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
  return requisicaoGithub(url, { headers: montarCabecalhos(token) });
}

async function salvarArquivo({ owner, repo, branch, path, conteudoBase64, shaAtual, token, mensagem }) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  return requisicaoGithub(url, {
    method: 'PUT',
    headers: {
      ...montarCabecalhos(token),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: mensagem,
      content: conteudoBase64,
      branch,
      sha: shaAtual
    })
  });
}

function arquivoParaBase64(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();

    leitor.onload = () => {
      const resultado = leitor.result || '';
      const base64 = String(resultado).split(',')[1] || '';
      resolve(base64);
    };

    leitor.onerror = () => reject(new Error(`Não foi possível ler o arquivo ${arquivo.name}.`));
    leitor.readAsDataURL(arquivo);
  });
}

export async function publicarNovoPerfilNoGithub({ owner, repo, branch, token, perfil, arquivosMidia }) {
  const arquivoPerfis = await buscarArquivo({
    owner,
    repo,
    branch,
    path: 'src/Dados/Perfils.json',
    token
  });

  const perfisAtuais = JSON.parse(decodificarBase64(arquivoPerfis.content));
  perfisAtuais.push(perfil);

  for (const arquivo of arquivosMidia) {
    const pasta = identificarPastaMidia(arquivo);
    const nomeArquivo = `${Date.now()}-${normalizarNomeArquivo(arquivo.name)}`;
    const caminho = `${pasta}/${nomeArquivo}`;

    const base64 = await arquivoParaBase64(arquivo);

    await salvarArquivo({
      owner,
      repo,
      branch,
      path: caminho,
      conteudoBase64: base64,
      token,
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

  const perfisAtualizadosBase64 = codificarBase64(JSON.stringify(perfisAtuais, null, 2));

  await salvarArquivo({
    owner,
    repo,
    branch,
    path: 'src/Dados/Perfils.json',
    conteudoBase64: perfisAtualizadosBase64,
    shaAtual: arquivoPerfis.sha,
    token,
    mensagem: `feat: adiciona perfil ${perfil.id}`
  });
}
