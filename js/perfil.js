const id =
  localStorage.getItem(
    "perfilSelecionado"
  );

const perfil =
  perfis.find(
    item => item.id === id
  );

if(perfil){

  document.getElementById("nome").innerHTML =
    perfil.nome;

  document.getElementById("titulo").innerHTML =
    perfil.titulo;

  document.getElementById("idade").innerHTML =
    perfil.idade;

  document.getElementById("sexo").innerHTML =
    perfil.sexo;

  document.getElementById("biografia").innerHTML =
    perfil.biografia;

  const primeiraMidia =
    perfil.midias.find(
      item =>
        item.categoria === "galeria"
    );

  if(primeiraMidia){

    document.getElementById(
      "imagem"
    ).src =
      primeiraMidia.completo;

  }

}

function abrirGaleria(){

  localStorage.setItem(
    "perfilGaleria",
    perfil.id
  );

  localStorage.setItem(
    "categoriaMidia",
    "galeria"
  );

  window.location.href =
    "galeria.html";

}

function abrirRoupas(){

  localStorage.setItem(
    "perfilGaleria",
    perfil.id
  );

  localStorage.setItem(
    "categoriaMidia",
    "roupas"
  );

  window.location.href =
    "galeria.html";

}

window.abrirGaleria =
  abrirGaleria;

window.abrirRoupas =
  abrirRoupas;