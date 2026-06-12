let todosAdotantes = [];

async function carregarAdotantes() {
  try {
    const response = await fetch("../Javascript/data.json");
    const dados = await response.json();

    todosAdotantes = dados.usuarios.filter(
      (usuario) => usuario.tipo === "adotante",
    );

    renderizarAdotantes(todosAdotantes);
  } catch (erro) {
    console.error("Erro ao carregar adotantes:", erro);

    const grid = document.getElementById("adoptersGrid");

    if (grid) {
      grid.innerHTML = "<p>Erro ao carregar os adotantes.</p>";
    }
  }
}

function atualizarContador(total) {
  const contador = document.querySelector(".results");

  if (contador) {
    contador.textContent = `${total} adotantes encontrados`;
  }
}

function renderizarAdotantes(lista) {
  const grid = document.getElementById("adoptersGrid");

  if (!grid) return;

  grid.innerHTML = "";

  if (lista.length === 0) {
    grid.innerHTML = `
      <p class="sem-resultados">
        Nenhum adotante encontrado.
      </p>
    `;

    atualizarContador(0);
    return;
  }

  lista.forEach((adotante) => {
    grid.innerHTML += `
      <div class="adopter-card">

        <img
          src="${adotante.fotoPerfil}"
          class="profile-img"
          alt="${adotante.name}"
        >

        <div class="card-content">

          <h3>${adotante.name}</h3>

          <p class="city">
            📍 ${adotante.cidade}, ${adotante.estado}
          </p>

          <button
            class="outline-btn"
            onclick="abrirPerfil('${adotante.id}')"
          >
            Ver Perfil
          </button>

        </div>

      </div>
    `;
  });

  atualizarContador(lista.length);
}

function abrirPerfil(id) {
  window.location.href = `perfilAdotante.html?id=${id}`;
}

function aplicarFiltros() {
  let filtrados = [...todosAdotantes];

  const idade = document.getElementById("filtroIdade")?.value;

  const experiencia = document.getElementById("filtroExperiencia")?.value;

  const moradia = document.getElementById("filtroMoradia")?.value;

  const cidade =
    document.getElementById("filtroCidade")?.value?.toLowerCase().trim() || "";

  if (idade && idade !== "Todas") {
    filtrados = filtrados.filter((adotante) => {
      if (idade === "18 - 25") {
        return adotante.idade >= 18 && adotante.idade <= 25;
      }

      if (idade === "26 - 35") {
        return adotante.idade >= 26 && adotante.idade <= 35;
      }

      if (idade === "36 - 50") {
        return adotante.idade >= 36 && adotante.idade <= 50;
      }

      return true;
    });
  }

  if (experiencia && experiencia !== "Todos") {
    filtrados = filtrados.filter((adotante) => {
      const quantidade = adotante.experiencias?.length || 0;

      if (experiencia === "Iniciante") {
        return quantidade <= 1;
      }

      if (experiencia === "Intermediário") {
        return quantidade === 2;
      }

      if (experiencia === "Experiente") {
        return quantidade >= 3;
      }

      return true;
    });
  }

  if (moradia && moradia !== "Todos") {
    filtrados = filtrados.filter(
      (adotante) => adotante.moradia?.tipo === moradia,
    );
  }

  if (cidade) {
    filtrados = filtrados.filter(
      (adotante) =>
        adotante.cidade.toLowerCase().includes(cidade) ||
        adotante.estado.toLowerCase().includes(cidade),
    );
  }

  renderizarAdotantes(filtrados);
}

function configurarBusca() {
  const campoBusca = document.querySelector(".header-right input");

  if (!campoBusca) return;

  campoBusca.addEventListener("input", () => {
    const texto = campoBusca.value.toLowerCase().trim();

    const filtrados = todosAdotantes.filter(
      (adotante) =>
        adotante.name.toLowerCase().includes(texto) ||
        adotante.cidade.toLowerCase().includes(texto) ||
        adotante.estado.toLowerCase().includes(texto),
    );

    renderizarAdotantes(filtrados);
  });
}

function configurarFiltros() {
  document
    .getElementById("aplicarFiltros")
    ?.addEventListener("click", aplicarFiltros);

  document.getElementById("clearFilters")?.addEventListener("click", () => {
    document.querySelectorAll("select").forEach((select) => {
      select.selectedIndex = 0;
    });

    const cidadeInput = document.getElementById("filtroCidade");

    if (cidadeInput) {
      cidadeInput.value = "";
    }

    renderizarAdotantes(todosAdotantes);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  configurarBusca();

  configurarFiltros();

  carregarAdotantes();
});
