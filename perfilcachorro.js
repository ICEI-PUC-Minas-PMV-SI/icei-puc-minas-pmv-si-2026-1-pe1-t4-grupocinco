let fotosPet = [];
let fotoAtualIndex = 0;

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const petId = params.get("id");
  const petName = params.get("name");

  if (!petId && !petName) {
    mostrarErro("Nenhum pet selecionado. Volte para a tela de exibição e escolha um pet.");
    return;
  }

  try {
    const pet = await carregarPetPorIdOuNome(petId, petName);

    if (!pet) {
      mostrarErro("Pet não encontrado. Verifique se o link está correto.");
      return;
    }

    preencherDadosPet(pet);
    configurarNavegacaoFotos();
    configurarAcoesPerfil(pet);
  } catch (erro) {
    console.error("Erro ao carregar o perfil do pet:", erro);
    mostrarErro("Ocorreu um erro ao carregar o perfil do pet. Tente novamente.");
  }
});

async function carregarPetPorIdOuNome(petId, petName) {
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

  if (petId && petsMap.has(petId)) {
    return petsMap.get(petId);
  }

  if (petName) {
    const nomeBusca = petName.trim().toLowerCase();
    return Array.from(petsMap.values()).find(
      (pet) => pet.petname?.toLowerCase() === nomeBusca
    );
  }

  return null;
}

function preencherDadosPet(pet) {
  const image = document.getElementById("petImage");
  const name = document.getElementById("petName");
  const breed = document.getElementById("petBreed");
  const age = document.getElementById("petAge");
  const location = document.getElementById("petLocation");
  const description = document.getElementById("petDescription");
  const attributes = document.getElementById("petAttributes");
  const availability = document.getElementById("petAvailability");
  const familyProfile = document.getElementById("petFamilyProfile");
  const preferences = document.getElementById("petPreferences");
  const ideal = document.getElementById("petIdeal");

  fotosPet = pet.fotos || [];
  fotoAtualIndex = 0;

  if (image) {
    const photoUrl = fotosPet[fotoAtualIndex] || "";
    image.src = photoUrl;
    image.alt = pet.petname || "Pet";
  }

  const inspectLink = document.getElementById("inspectPhoto");
  if (inspectLink) {
    if (fotosPet.length > 0) {
      inspectLink.href = fotosPet[fotoAtualIndex];
      inspectLink.style.display = "inline-block";
    } else {
      inspectLink.style.display = "none";
    }
  }

  if (name) name.textContent = pet.petname || "Nome não disponível";
  if (breed) breed.textContent = pet.raca || "Raça não informada";
  if (age) age.textContent = pet.age || "Idade não informada";
  if (location) location.textContent = pet.localizacao || "Localização não informada";

  if (description) {
    description.textContent =
      pet.description ||
      `Conheça ${pet.petname || "este pet"}: um cão ${pet.raca || "de raça não informada"} ${pet.age || ""}. ${pet.personality || "Personalidade e características do pet não foram detalhadas."}`;
  }

  if (attributes) {
    const atributos = [
      pet.sex ? `Sexo: ${pet.sex}` : null,
      pet.size ? `Porte: ${pet.size}` : null,
      pet.vacinas?.length ? `Vacinas: ${pet.vacinas.join(", ")}` : null,
    ].filter(Boolean);

    attributes.innerHTML = atributos
      .map((texto) => `<button type="button" class="btn-primary">${texto}</button>`)
      .join("");
  }

  if (availability) {
    availability.textContent = pet.disponibilidade || "Imediata";
  }

  if (familyProfile) {
    familyProfile.textContent =
      pet.familyProfile ||
      "Família amorosa e atenciosa com disponibilidade para passeios e carinho.";
  }

  if (preferences) {
    const comportamento = pet.personality
      ? pet.personality.split(" ").slice(0, 4).join(" ")
      : "Alegre e amigável";

    preferences.textContent = pet.personality ||
      `Este pet é ${comportamento}.`;
  }

  if (ideal) {
    ideal.textContent = pet.ideal ||
      "Ambientes com espaço para passeios e atenção diária.";
  }

  document.title = `${pet.petname || "Perfil do Pet"} | LarCerto`;

  atualizarStatusCandidatura(pet);
}

function obterUsuarioLogado() {
  return JSON.parse(localStorage.getItem("usuarioLogado"));
}

function configurarAcoesPerfil(pet) {
  const btnFavorito = document.getElementById("btnFavorito");
  const btnAdotar = document.getElementById("btnAdotar");
  const usuarioLogado = obterUsuarioLogado();

  if (btnFavorito) {
    atualizarBotaoFavorito(pet.id);
    btnFavorito.addEventListener("click", () => {
      if (!usuarioLogado) {
        alert("Faça login para favoritar este pet.");
        window.location.href = "login.html";
        return;
      }
      toggleFavorito(pet.id);
    });
  }

  if (btnAdotar) {
    if (!usuarioLogado) {
      btnAdotar.textContent = "Faça login para adotar";
      btnAdotar.classList.add("disabled");
      btnAdotar.addEventListener("click", () => {
        window.location.href = "login.html";
      });
    } else if (usuarioLogado.perfil !== "adotar") {
      btnAdotar.textContent = "Apenas adotantes podem solicitar";
      btnAdotar.classList.add("disabled");
      btnAdotar.disabled = true;
    } else if (usuarioLogado.id === pet.userId) {
      btnAdotar.textContent = "Você é o proprietário";
      btnAdotar.classList.add("disabled");
      btnAdotar.disabled = true;
    } else {
      btnAdotar.addEventListener("click", () => enviarCandidatura(pet));
    }
  }
}

function atualizarBotaoFavorito(petId) {
  const btnFavorito = document.getElementById("btnFavorito");
  if (!btnFavorito) return;

  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  const estaFavorito = favoritos.includes(petId);

  btnFavorito.textContent = estaFavorito ? "Favorito ❤️" : "Favoritar";
  btnFavorito.classList.toggle("favoritado", estaFavorito);
}

function toggleFavorito(petId) {
  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  const index = favoritos.indexOf(petId);

  if (index >= 0) {
    favoritos.splice(index, 1);
  } else {
    favoritos.push(petId);
  }

  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  atualizarBotaoFavorito(petId);
}

function enviarCandidatura(pet) {
  const usuarioLogado = obterUsuarioLogado();
  if (!usuarioLogado) {
    alert("Faça login para enviar sua candidatura.");
    window.location.href = "login.html";
    return;
  }

  const candidaturas = JSON.parse(localStorage.getItem("candidaturas")) || [];

  const jaCandidatou = candidaturas.some(
    (cand) => cand.petId === pet.id && cand.candidatoId === usuarioLogado.id
  );

  if (jaCandidatou) {
    alert("Você já enviou uma candidatura para este pet.");
    return;
  }

  const candidatura = {
    id: `cand_${Date.now()}`,
    petId: pet.id,
    petName: pet.petname || "Pet",
    doadorId: pet.userId || "",
    candidatoId: usuarioLogado.id,
    candidatoName: usuarioLogado.name || "Adotante",
    candidatoFoto: usuarioLogado.fotoPerfil || "",
    status: "pendente",
    timestamp: new Date().toISOString(),
    mensagem: `${usuarioLogado.name || "Um interessado"} enviou uma candidatura para ${pet.petname || "este pet"}.`
  };

  candidaturas.push(candidatura);
  localStorage.setItem("candidaturas", JSON.stringify(candidaturas));

  alert("Candidatura enviada com sucesso! O doador será notificado.");
}

function configurarNavegacaoFotos() {
  const prevButton = document.getElementById("prevPhoto");
  const nextButton = document.getElementById("nextPhoto");

  if (prevButton) {
    prevButton.addEventListener("click", () => mudarFoto(-1));
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => mudarFoto(1));
  }

  atualizarNavegacaoFotos();
}

function mudarFoto(direcao) {
  if (fotosPet.length <= 1) return;

  fotoAtualIndex = Math.max(0, Math.min(fotosPet.length - 1, fotoAtualIndex + direcao));
  atualizarImagem();
}

function atualizarImagem() {
  const image = document.getElementById("petImage");
  const inspectLink = document.getElementById("inspectPhoto");

  if (image && fotosPet.length > 0) {
    image.src = fotosPet[fotoAtualIndex];
  }

  if (inspectLink && fotosPet.length > 0) {
    inspectLink.href = fotosPet[fotoAtualIndex];
  }

  atualizarNavegacaoFotos();
}

function atualizarNavegacaoFotos() {
  const prevButton = document.getElementById("prevPhoto");
  const nextButton = document.getElementById("nextPhoto");

  if (!prevButton || !nextButton) return;

  const temVarios = fotosPet.length > 1;
  prevButton.style.display = temVarios ? "block" : "none";
  nextButton.style.display = temVarios ? "block" : "none";
  prevButton.disabled = fotoAtualIndex === 0;
  nextButton.disabled = fotoAtualIndex === fotosPet.length - 1;
}

function mostrarErro(mensagem) {
  const main = document.querySelector("main.container");
  if (!main) return;

  main.innerHTML = `
    <div class="caixa" style="text-align:center; padding: 40px;">
      <h2>Ops!</h2>
      <p>${mensagem}</p>
      <a href="TelaExibição.html" class="btn-primary" style="margin-top:20px; display:inline-block;">Voltar para a lista</a>
    </div>
  `;
}

function atualizarStatusCandidatura(pet) {
  const statusEl = document.getElementById("candidacyStatus");
  const btnAdotar = document.getElementById("btnAdotar");
  if (!statusEl) return;

  const usuarioLogado = obterUsuarioLogado();
  if (!usuarioLogado || usuarioLogado.perfil !== "adotar") {
    statusEl.textContent =
      "Faça login como adotante para ver o status da candidatura.";
    return;
  }

  const candidaturas = JSON.parse(localStorage.getItem("candidaturas")) || [];
  const candidatura = candidaturas.find(
    (cand) => cand.petId === pet.id && cand.candidatoId === usuarioLogado.id
  );

  if (!candidatura) {
    statusEl.textContent = "Nenhuma candidatura enviada";
    if (btnAdotar) {
      btnAdotar.disabled = false;
      btnAdotar.textContent = "Adotar";
      btnAdotar.classList.remove("disabled");
    }
    return;
  }

  const status = candidatura.status || "pendente";
  const statusTexto =
    status === "aprovado"
      ? "Aprovado"
      : status === "reprovado"
      ? "Reprovado"
      : "Em análise";

  statusEl.textContent = `Status da candidatura: ${statusTexto}`;

  if (btnAdotar) {
    btnAdotar.disabled = true;
    btnAdotar.classList.add("disabled");

    if (status === "aprovado") {
      btnAdotar.textContent = "Candidatura aprovada";
    } else if (status === "reprovado") {
      btnAdotar.textContent = "Candidatura reprovada";
    } else {
      btnAdotar.textContent = "Candidatura em análise";
    }
  }
}
