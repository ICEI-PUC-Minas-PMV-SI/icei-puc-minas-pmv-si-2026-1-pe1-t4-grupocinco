document.addEventListener("DOMContentLoaded", async () => {
  configurarLogout();
  await carregarFavoritos();
});

function configurarLogout() {
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
  });
}

async function carregarFavoritos() {
  const favoritosIds = JSON.parse(localStorage.getItem("favoritos")) || [];
  const favoritesGrid = document.querySelector(".favorites-grid");

  if (!favoritesGrid) return;

  if (favoritosIds.length === 0) {
    favoritesGrid.innerHTML = `
      <div class="empty-favorites">
        <h2>Você ainda não favoritou nenhum pet.</h2>
        <p>Visite a lista de pets e clique no coração para salvar seus favoritos.</p>
      </div>
    `;
    return;
  }

  try {
    const response = await fetch("data.json");
    const dados = await response.json();
    const petsJson = dados.pets || [];
    const petsLocal = JSON.parse(localStorage.getItem("pets")) || [];
    const petsMap = new Map();

    petsJson.forEach((pet) => {
      if (pet.id) {
        petsMap.set(pet.id, pet);
      }
    });

    petsLocal.forEach((pet) => {
      if (pet.id) {
        petsMap.set(pet.id, pet);
      }
    });

    const petsFavoritos = favoritosIds
      .map((id) => petsMap.get(id))
      .filter(Boolean);

    if (petsFavoritos.length === 0) {
      favoritesGrid.innerHTML = `
        <div class="empty-favorites">
          <h2>Você ainda não favoritou nenhum pet.</h2>
          <p>Os pets gravados nos favoritos não foram encontrados.</p>
        </div>
      `;
      return;
    }

    favoritesGrid.innerHTML = petsFavoritos
      .map((pet) => formatarCardFavorito(pet))
      .join("");

    favoritesGrid.addEventListener("click", (event) => {
      const target = event.target;
      if (!target.matches(".heart-icon")) return;

      const petId = target.dataset.id;
      if (!petId) return;

      removerFavorito(petId);
      carregarFavoritos();
    });
  } catch (erro) {
    console.error("Erro ao carregar favoritos:", erro);
    favoritesGrid.innerHTML = `
      <div class="empty-favorites">
        <h2>Erro ao carregar os favoritos.</h2>
        <p>Tente novamente em alguns instantes.</p>
      </div>
    `;
  }
}

function formatarCardFavorito(pet) {
  return `
    <div class="card">
      <img src="${pet.fotos?.[0] || "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=500&q=80"}" alt="${pet.petname || "Pet favorito"}" />
      <div class="card-content">
        <h3 class="pet-name">${pet.petname || "Nome não disponível"}</h3>
        <p><strong>Raça:</strong> ${pet.raca || "Não informada"}</p>
        <p><strong>Idade:</strong> ${pet.age || "Não informada"}</p>
        <p><strong>Local:</strong> ${pet.localizacao || "Não informada"}</p>
        <div class="card-footer">
          <button type="button" class="heart-icon" data-id="${pet.id}" title="Remover dos favoritos">❤️</button>
          <a href="perfilcachorro.html?id=${pet.id}"><button class="btn-perfil">Ver Perfil</button></a>
        </div>
      </div>
    </div>
  `;
}

function removerFavorito(petId) {
  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  const novosFavoritos = favoritos.filter((id) => id !== petId);
  localStorage.setItem("favoritos", JSON.stringify(novosFavoritos));
}
