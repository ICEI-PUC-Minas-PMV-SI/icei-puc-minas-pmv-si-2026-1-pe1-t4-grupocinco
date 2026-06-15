document.addEventListener("DOMContentLoaded", iniciarHistoricoPetEAtivo);

async function iniciarHistoricoPetEAtivo() {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("userId");
  const emAdocao = params.get("em_adocao") === "true";

  const sessaoRaw = localStorage.getItem("usuarioLogado");
  let usuarioLogado = null;

  if (sessaoRaw) {
    try {
      usuarioLogado = JSON.parse(sessaoRaw);
    } catch {
      usuarioLogado = { id: sessaoRaw };
    }
  }

  const podeEditar =
    emAdocao &&
    usuarioLogado &&
    (usuarioLogado.perfil === "doar" || usuarioLogado.tipo === "doador") &&
    usuarioLogado.id === userId;

  const titulo = document.querySelector(".title-area h2");
  if (titulo) {
    titulo.textContent = emAdocao ? "Meus PETs em Adoção" : "Meu Histórico de PETs";
  }

  if (!userId) {
    exibirMensagem(
      "Não foi possível encontrar o dono dos pets. Volte ao perfil e tente novamente."
    );
    return;
  }

  try {
    const response = await fetch("../Javascript/data.json");
    const dados = await response.json();

    const petsJson = dados.pets || [];
    const petsLocal = JSON.parse(localStorage.getItem("pets")) || [];

    const petsMap = new Map();
    [...petsJson, ...petsLocal].forEach((pet) => {
      if (pet.id) {
        petsMap.set(pet.id, pet);
      }
    });

    const petsDoUsuario = Array.from(petsMap.values()).filter(
      (pet) => pet.userId === userId
    );

    const petsExibidos = petsDoUsuario.filter((pet) => {
      if (emAdocao) {
        return pet.status ? pet.status !== "adotado" : true;
      }
      return pet.status ? pet.status === "adotado" : true;
    });

    renderizarPets(petsExibidos, emAdocao, podeEditar);
  } catch (erro) {
    console.error("Erro ao carregar histórico de pets:", erro);
    exibirMensagem(
      "Ocorreu um erro ao carregar os pets. Atualize a página e tente novamente."
    );
  }
}

function renderizarPets(pets, emAdocao, podeEditar) {
  const petGrid = document.querySelector(".pet-grid");
  if (!petGrid) return;

  if (!pets.length) {
    const mensagem = emAdocao
      ? "Você não possui pets em adoção no momento."
      : "Nenhum pet encontrado no histórico."
    petGrid.innerHTML = `
      <div class="empty-state">
        <p>${mensagem}</p>
      </div>
    `;
    return;
  }

  petGrid.innerHTML = pets
    .map((pet) => formatarCardPet(pet, podeEditar))
    .join("");

  petGrid.querySelectorAll(".btn-selecionar").forEach((btn) => {
    btn.addEventListener("click", () => {
      const petId = btn.dataset.petId;
      if (petId) {
        window.location.href = `perfilcachorro.html?id=${petId}`;
      }
    });
  });

  petGrid.querySelectorAll(".btn-editar-pet").forEach((btn) => {
    btn.addEventListener("click", () => {
      const petId = btn.dataset.petId;
      if (petId) {
        window.location.href = `cadastropet.html?petId=${petId}`;
      }
    });
  });
}

function formatarCardPet(pet, podeEditar) {
  const foto = pet.fotos?.[0] || "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=500&q=80";
  const localizacao = pet.localizacao || pet.cidade || "Local não informado";
  const idade = pet.age || "Idade não informada";
  const sexo = pet.sex || "Sexo não informado";
  const porte = pet.size || "Porte não informado";
  const personalidade = pet.personality || "Sem descrição";

  return `
    <div class="pet-card">
      <img src="${foto}" alt="${pet.petname || "Pet"}" />
      <div class="pet-info">
        <h3>${pet.petname || "Nome não disponível"}</h3>
        <p>${idade} • ${sexo}</p>
        <p>${porte} • ${personalidade}</p>
        <p>📍 ${localizacao}</p>
        <button type="button" class="btn-selecionar" data-pet-id="${pet.id}">Selecionar</button>
        ${podeEditar ? `<button type="button" class="btn-editar-pet" data-pet-id="${pet.id}">Editar</button>` : ""}
      </div>
    </div>
  `;
}

function exibirMensagem(texto) {
  const petGrid = document.querySelector(".pet-grid");
  if (!petGrid) return;

  petGrid.innerHTML = `
    <div class="empty-state">
      <p>${texto}</p>
    </div>
  `;
}
