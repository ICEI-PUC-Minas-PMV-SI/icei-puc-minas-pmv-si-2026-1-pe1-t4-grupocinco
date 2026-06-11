// Dados iniciais

const adotantesPadrao = [
  {
    id: 1,
    nome: "Ana Beatriz",
    cidade: "Curitiba, PR",
    foto: "https://img.magnific.com/fotos-gratis/close-up-de-jovem-profissional-feminina-fazendo-contato-visual-contra-fundo-colorido_662251-651.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    id: 2,
    nome: "Lucas Martins",
    cidade: "São Paulo, SP",
    foto: "https://img.magnific.com/fotos-gratis/close-up-de-jovem-profissional-feminina-fazendo-contato-visual-contra-fundo-colorido_662251-651.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    id: 3,
    nome: "Juliana Costa",
    cidade: "Belo Horizonte, MG",
    foto: "https://img.magnific.com/fotos-gratis/close-up-de-jovem-profissional-feminina-fazendo-contato-visual-contra-fundo-colorido_662251-651.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    id: 4,
    nome: "Pedro Henrique",
    cidade: "Porto Alegre, RS",
    foto: "https://img.magnific.com/fotos-gratis/close-up-de-jovem-profissional-feminina-fazendo-contato-visual-contra-fundo-colorido_662251-651.jpg?semt=ais_hybrid&w=740&q=80",
  },
];

// Inicializa Local Storage

if (!localStorage.getItem("adotantes")) {
  localStorage.setItem("adotantes", JSON.stringify(adotantesPadrao));
}

// Carrega adotantes

function carregarAdotantes() {
  return JSON.parse(localStorage.getItem("adotantes")) || [];
}

// Atualiza contador

function atualizarContador() {
  const total = carregarAdotantes().length;

  document.querySelector(".results").textContent =
    `${total} adotantes encontrados`;
}

// Renderiza cards

function renderizarAdotantes(lista) {
  const grid = document.getElementById("adoptersGrid");

  grid.innerHTML = "";

  lista.forEach((adotante) => {
    grid.innerHTML += `
      <div class="adopter-card">

        <img
          src="${adotante.foto}"
          class="profile-img"
          alt="${adotante.nome}"
        >

        <div class="card-content">

          <h3>${adotante.nome}</h3>

          <p class="city">
            📍 ${adotante.cidade}
          </p>

          <button
            class="outline-btn"
            onclick="abrirPerfil(${adotante.id})"
          >
            Ver Perfil
          </button>

        </div>

      </div>
    `;
  });

  atualizarContador();
}

// Salva ID do perfil e abre página

function abrirPerfil(id) {
  localStorage.setItem("perfilSelecionado", id);

  window.location.href = "perfiladotante.html";
}

// Busca pelo campo superior

const campoBusca = document.querySelector(".header-right input");

campoBusca.addEventListener("input", () => {
  const texto = campoBusca.value.toLowerCase();

  const adotantes = carregarAdotantes();

  const filtrados = adotantes.filter(
    (adotante) =>
      adotante.nome.toLowerCase().includes(texto) ||
      adotante.cidade.toLowerCase().includes(texto),
  );

  renderizarAdotantes(filtrados);
});

// LIMPAR FILTROS

const clearButton = document.getElementById("clearFilters");

clearButton.addEventListener("click", () => {
  const selects = document.querySelectorAll("select");

  const inputs = document.querySelectorAll("input");

  selects.forEach((select) => {
    select.selectedIndex = 0;
  });

  inputs.forEach((input) => {
    if (input.type !== "submit") {
      input.value = "";
    }
  });

  renderizarAdotantes(carregarAdotantes());
});

// Inicialização

renderizarAdotantes(carregarAdotantes());
