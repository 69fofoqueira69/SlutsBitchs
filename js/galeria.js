const id =
  localStorage.getItem(
    "perfilGaleria"
  );

const categoria =
  localStorage.getItem(
    "categoriaMidia"
  );

const perfil =
  perfis.find(
    item => item.id === id
  );

const nome =
  document.getElementById("nome");

const grid =
  document.getElementById("grid");

const preview =
  document.getElementById("preview");

if(perfil){

  nome.innerHTML =
    `${perfil.nome} - ${categoria}`;

  const midiasFiltradas =
    perfil.midias.filter(
      item =>
        item.categoria === categoria
    );

  if(midiasFiltradas.length > 0){

    trocarMidia(
      midiasFiltradas[0]
    );

  }

  midiasFiltradas.forEach(midia => {

    const item =
      document.createElement("div");

    item.className =
      "item";

    const imagem =
      document.createElement("img");

    imagem.src =
      midia.icon;

    imagem.addEventListener(
      "click",
      () => {

        trocarMidia(midia);

      }
    );

    item.appendChild(imagem);

    grid.appendChild(item);

  });

}

function trocarMidia(midia){

  preview.innerHTML = "";

  const imagem =
    document.createElement("img");

  imagem.src =
    midia.completo;

  preview.appendChild(imagem);

}

function voltarPerfil(){

  window.location.href =
    "perfil.html";

}

window.voltarPerfil =
  voltarPerfil;