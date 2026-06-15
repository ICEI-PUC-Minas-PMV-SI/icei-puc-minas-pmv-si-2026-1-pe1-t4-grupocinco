let todosCandidatos = [];
let todosAdotantes = [];
let usuarioAtual = null;

async function carregarAdotantes() {
  try {
    const sessaoRaw = localStorage.getItem("usuarioLogado");

    if (!sessaoRaw) {
      mostrarMensagemAviso(
        "Faça login como doador para visualizar os candidatos à adoção."
      );
      return;
    }

    const sessao = JSON.parse(sessaoRaw);
    usuarioAtual = sessao;

    if (usuarioAtual.perfil !== "doar" && usuarioAtual.tipo !== "doador") {
      mostrarMensagemAviso(
        "Esta página exibe apenas candidatos para doadores logados."
      );
      return;
    }

    const response = await fetch("../Javascript/data.json");
    const dados = await response.json();

    const usuariosSistema = obterUsuariosSistema(dados);
    todosAdotantes = usuariosSistema.filter(
      (usuario) => usuario.tipo === "adotante"
    );

    const candidaturas =
      JSON.parse(localStorage.getItem("candidaturas")) || [];

    todosCandidatos = candidaturas
      .filter((c) => c.doadorId === usuarioAtual.id)
      .map((candidatura) => {
        const adotante = usuariosSistema.find(
          (usuario) => usuario.id === candidatura.candidatoId
        );

        return {
          id: candidatura.candidatoId,
          name: candidatura.candidatoName || adotante?.name || "Adotante",
          fotoPerfil:
            candidatura.candidatoFoto || adotante?.fotoPerfil ||
            "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=500&q=80",
          cidade: adotante?.cidade || "Local não informado",
          estado: adotante?.estado || "",
          idade: adotante?.idade || null,
          experiencias: adotante?.experiencias || [],
          moradia: adotante?.moradia || {},
          petName: candidatura.petName || "Pet",
          mensagem: candidatura.mensagem || "Sem mensagem",
          status: candidatura.status || "pendente",
          timestamp: candidatura.timestamp || "",
        };
      });

    renderizarAdotantes(todosCandidatos);
  } catch (erro) {
    console.error("Erro ao carregar adotantes:", erro);

    const grid = document.getElementById("adoptersGrid");

    if (grid) {
      grid.innerHTML = "<p>Erro ao carregar os candidatos.</p>";
    }
  }
}

function obterUsuariosSistema(dados) {
  const usuariosLocal = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuariosPorId = new Map();

  (dados.usuarios || []).forEach((usuario) => {
    usuariosPorId.set(usuario.id, usuario);
  });

  usuariosLocal.forEach((usuario) => {
    usuariosPorId.set(usuario.id, usuario);
  });

  return Array.from(usuariosPorId.values());
}

function mostrarMensagemAviso(mensagem) {
  const grid = document.getElementById("adoptersGrid");
  if (!grid) return;

  grid.innerHTML = `
    <div class="sem-resultados">
      <p>${mensagem}</p>
    </div>
  `;

  atualizarContador(0);
}

function atualizarContador(total) {
  const contador = document.querySelector(".results");

  if (contador) {
    contador.textContent = `${total} candidatos encontrados`;
  }
}

function renderizarAdotantes(lista) {
  const grid = document.getElementById("adoptersGrid");

  if (!grid) return;

  grid.innerHTML = "";

  if (lista.length === 0) {
    grid.innerHTML = `
      <p class="sem-resultados">
        Nenhum candidato encontrado.
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
            📍 ${adotante.cidade}${adotante.estado ? ", " + adotante.estado : ""}
          </p>

          <p class="pet-solicitado">
            Pet solicitado: <strong>${adotante.petName}</strong>
          </p>

          <p class="mensagem-candidatura">
            ${adotante.mensagem}
          </p>

          <p class="status-candidatura">
            Status: <span>${adotante.status}</span>
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
  if (!id) return;
  window.location.href = `perfilAdotante.html?id=${id}`;
}

function aplicarFiltros() {
  let filtrados = [...todosCandidatos];

  const idade = document.getElementById("filtroIdade")?.value;
  const experiencia = document.getElementById("filtroExperiencia")?.value;
  const moradia = document.getElementById("filtroMoradia")?.value;
  const cidade =
    document.getElementById("filtroCidade")?.value?.toLowerCase().trim() || "";

  if (idade && idade !== "Todas") {
    filtrados = filtrados.filter((adotante) => {
      if (!adotante.idade) return false;

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
        adotante.name.toLowerCase().includes(cidade) ||
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

    const filtrados = todosCandidatos.filter((adotante) =>
      adotante.name.toLowerCase().includes(texto) ||
      adotante.cidade.toLowerCase().includes(texto) ||
      adotante.estado.toLowerCase().includes(texto) ||
      adotante.petName.toLowerCase().includes(texto)
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

    renderizarAdotantes(todosCandidatos);
  });
}

function configurarLogout() {
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "telainicial.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  configurarBusca();
  configurarFiltros();
  configurarLogout();
  carregarAdotantes();
});
