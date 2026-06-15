let todosPets = [];

document.addEventListener("DOMContentLoaded", () => {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  configurarLinkPerfil(usuarioLogado);

  const ehDoador =
    usuarioLogado?.perfil === "doar" ||
    usuarioLogado?.tipo === "doador";

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "telainicial.html";
  });

  if (ehDoador) {
    configurarTelaDoador();
    return;
  }

  configurarTelaAdotante();

  carregarPets();

  document
    .getElementById("clearFilters")
    .addEventListener("click", limparFiltros);

  document
    .querySelector(".search-area input")
    .addEventListener("input", aplicarFiltros);

  document.querySelectorAll("select").forEach((select) => {
    select.addEventListener("change", aplicarFiltros);
  });

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "telainicial.html";
  });
});

function configurarLinkPerfil(usuarioLogado) {
  const linkPerfil = document.getElementById("menuPerfil");
  if (!linkPerfil) return;

  const ehDoador =
    usuarioLogado?.perfil === "doar" ||
    usuarioLogado?.tipo === "doador";

  linkPerfil.href = ehDoador ? "PerfilDoador.html" : "perfilAdotante.html";
}

function configurarTelaAdotante() {
  const menuCadastrarPet = document.getElementById("menuCadastrarPet");

  if (menuCadastrarPet) {
    menuCadastrarPet.style.display = "none";
  }
}

function configurarTelaDoador() {
  const menuCadastrarPet = document.getElementById("menuCadastrarPet");

  if (menuCadastrarPet) {
    menuCadastrarPet.style.display = "inline";
  }

  const menuFavoritos = document.getElementById("menuFavoritos");

  if (menuFavoritos) {
    menuFavoritos.style.display = "none";
  }

  const menuPets = document.getElementById("menuPets");

  if (menuPets) {
    menuPets.style.display = "none";
  }

  const searchArea = document.querySelector(".search-area");

  if (searchArea) {
    searchArea.style.display = "none";
  }

  const sidebar = document.querySelector(".sidebar");

  if (sidebar) {
    sidebar.style.display = "none";
  }

  const content = document.querySelector(".content");

  content.innerHTML = `

    <div class="painel-doador">

      <h1>Painel do Doador</h1>

      <p>
        Você está logado como doador.
      </p>

      <p>
        Como doador você pode:
      </p>

      <ul style="text-align:left; max-width:500px; margin:20px auto;">
        <li>Cadastrar pets</li>
        <li>Editar pets cadastrados</li>
        <li>Visualizar candidatos</li>
        <li>Aprovar ou rejeitar candidaturas</li>
        <li>Editar seu perfil</li>
      </ul>

      <a
        href="cadastropet.html"
        class="btn-doador"
      >
        Cadastrar Pet
      </a>

    </div>

  `;
}

async function carregarPets() {
  try {
    const response = await fetch("../Javascript/data.json");
    const dados = await response.json();

    todosPets = dados.pets || [];

    renderizarPets(todosPets);
    atualizarContador(todosPets.length);
  } catch (erro) {
    console.error("Erro ao carregar pets:", erro);
  }
}

function renderizarPets(pets) {
  const petGrid = document.getElementById("petGrid");

  petGrid.innerHTML = "";

  if (pets.length === 0) {
    mostrarMensagemVazia();
    return;
  }

  removerMensagemVazia();

  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

  pets.forEach((pet) => {
    const favoritado = favoritos.includes(pet.id);

    petGrid.innerHTML += `
      <div class="pet-card">

        <img
          src="${pet.fotos?.[0] || ""}"
          alt="${pet.petname}"
        >

        <button
          class="favorite ${favoritado ? "favoritado" : ""}"
          data-id="${pet.id}"
        >
          ${favoritado ? "❤" : "♡"}
        </button>

        <div class="pet-info">

          <h3>${pet.petname}</h3>

          <p>${pet.age} • ${pet.sex}</p>

          <p>${pet.size}</p>

          <p>${pet.personality}</p>

          <p>${pet.raca}</p>

          <a
            class="btn-profile"
            href="perfilcachorro.html?id=${pet.id}"
          >
            Ver perfil
          </a>

        </div>

      </div>
    `;
  });

  configurarFavoritos();
}

function aplicarFiltros() {
  const busca = document
    .querySelector(".search-area input")
    .value.toLowerCase();

  const idade = document.querySelectorAll("select")[0].value.toLowerCase();

  const porte = document.querySelectorAll("select")[1].value.toLowerCase();

  const genero = document.querySelectorAll("select")[2].value.toLowerCase();

  const temperamento = document
    .querySelectorAll("select")[3]
    .value.toLowerCase();

  const petsFiltrados = todosPets.filter((pet) => {
    const atendeBusca =
      busca === "" ||
      pet.petname.toLowerCase().includes(busca) ||
      pet.raca.toLowerCase().includes(busca) ||
      pet.personality.toLowerCase().includes(busca);

    const atendePorte = porte === "todos" || pet.size.toLowerCase() === porte;

    const atendeGenero = genero === "todos" || pet.sex.toLowerCase() === genero;

    const atendeTemperamento =
      temperamento === "todos" ||
      pet.personality.toLowerCase().includes(temperamento);

    const atendeIdade =
      idade === "todas" || pet.age.toLowerCase().includes(idade);

    return (
      atendeBusca &&
      atendeIdade &&
      atendePorte &&
      atendeGenero &&
      atendeTemperamento
    );
  });

  renderizarPets(petsFiltrados);
  atualizarContador(petsFiltrados.length);
}

function limparFiltros() {
  document.querySelector(".search-area input").value = "";

  document.querySelectorAll("select").forEach((select) => {
    select.selectedIndex = 0;
  });

  renderizarPets(todosPets);
  atualizarContador(todosPets.length);
}

function atualizarContador(total) {
  const contador = document.querySelector(".title-area span");

  if (contador) {
    contador.textContent = `${total} cães disponíveis`;
  }
}

function configurarFavoritos() {
  document.querySelectorAll(".favorite").forEach((btn) => {
    btn.addEventListener("click", () => {
      const petId = btn.dataset.id;

      let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

      if (favoritos.includes(petId)) {
        favoritos = favoritos.filter((id) => id !== petId);

        btn.textContent = "♡";
        btn.classList.remove("favoritado");
      } else {
        favoritos.push(petId);

        btn.textContent = "❤";
        btn.classList.add("favoritado");
      }

      localStorage.setItem("favoritos", JSON.stringify(favoritos));
    });
  });
}

function mostrarMensagemVazia() {
  let mensagem = document.getElementById("semResultados");

  if (!mensagem) {
    mensagem = document.createElement("div");

    mensagem.id = "semResultados";

    mensagem.style.textAlign = "center";
    mensagem.style.padding = "30px";
    mensagem.style.fontSize = "18px";
    mensagem.style.fontWeight = "bold";

    document.querySelector(".content").appendChild(mensagem);
  }

  mensagem.textContent = "Nenhum pet encontrado com os filtros selecionados.";
}

function removerMensagemVazia() {
  const mensagem = document.getElementById("semResultados");

  if (mensagem) {
    mensagem.remove();
  }
}
