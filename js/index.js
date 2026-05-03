const cards =
  document.getElementById("cards");

const contador =
  document.getElementById("contador");

const buscar =
  document.getElementById("buscar");

function renderizar(lista){

  cards.innerHTML = "";

  contador.innerHTML =
    `${lista.length} perfil(is) encontrado(s)`;

  lista.forEach(perfil => {

    const capa =
      perfil.midias[0];

    cards.innerHTML += `
      <div
        class="card"
        onclick="abrirPerfil('${perfil.id}')"
      >

        <img src="${capa.completo}">

        <div class="card-content">

          <h2>${perfil.nome}</h2>

          <p>${perfil.biografia}</p>

        </div>

      </div>
    `;

  });

}

function abrirPerfil(id){

  localStorage.setItem(
    "perfilSelecionado",
    id
  );

  window.location.href =
    "perfil.html";

}

buscar.addEventListener("input", () => {

  const valor =
    buscar.value.toLowerCase();

  const filtrado =
    perfis.filter(perfil =>
      perfil.nome.toLowerCase().includes(valor)
    );

  renderizar(filtrado);

});

renderizar(perfis);