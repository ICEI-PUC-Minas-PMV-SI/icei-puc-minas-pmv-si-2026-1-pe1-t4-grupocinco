function montarHeaderDoador() {
  return `
    <div class="logo">🐾 LarCerto</div>

    <nav class="nav">
      <a href="index.html">Início</a>
      <a href="PessoasInteressadas.html">Interessados</a>
      <a href="TelaExibição.html">Painel Doador</a>
      <a href="mensagens.html" id="nav-mensagens" class="active">Mensagens</a>
      <a href="PerfilDoador.html">Perfil</a>
    </nav>

    <div class="header-right">
      <input type="text" placeholder="Buscar adotantes..." />
      <button type="button" id="logoutBtn" class="login-btn">Sair</button>
      <div class="user">
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
          alt="Usuário"
        />
      </div>
    </div>
  `;
}

function montarHeaderAdotante() {
  return `
    <div class="logo">🐾 LarCerto</div>

    <nav class="nav">
      <a href="index.html" id="nav-inicio">Início</a>
      <a href="TelaExibição.html" id="menuPets">Pets</a>
      <a href="favoritos.html" id="nav-favoritos">Favoritos</a>
      <a href="mensagens.html" id="nav-mensagens" class="active">Mensagens</a>
      <a href="cadastropet.html" id="menuCadastrarPet" style="display: none">Cadastrar Pet</a>
      <a href="perfilAdotante.html" id="menuPerfil">Perfil</a>
    </nav>

    <button type="button" id="logoutBtn" class="login-btn">Sair</button>

    <div class="user">
      <img
        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
        alt="Usuário"
      />
    </div>
  `;
}

async function configurarHeaderMensagens() {
  const header = document.getElementById("pageHeader");
  if (!header) return;

  const sessaoRaw = localStorage.getItem("usuarioLogado");
  let perfil = null;
  let tipo = null;
  let usuarioLogado = null;

  if (sessaoRaw) {
    try {
      usuarioLogado = JSON.parse(sessaoRaw);
      perfil = usuarioLogado.perfil;
      tipo = usuarioLogado.tipo;
    } catch {
      perfil = null;
      tipo = null;
    }
  }

  const ehDoador = perfil === "doar" || tipo === "doador";

  header.className = ehDoador ? "header header-doador" : "header header-adotante";
  header.innerHTML = ehDoador ? montarHeaderDoador() : montarHeaderAdotante();

  const usuarioCompleto = await carregarUsuarioCompleto(usuarioLogado);
  const avatarImg = document.querySelector(".user img");
  if (avatarImg && usuarioCompleto?.fotoPerfil) {
    avatarImg.src = usuarioCompleto.fotoPerfil;
    avatarImg.alt = usuarioCompleto.name || "Usuário";
  }

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await configurarHeaderMensagens();
});

async function carregarUsuarioCompleto(sessao) {
  if (!sessao || !sessao.id) return sessao;
  if (sessao.fotoPerfil && sessao.name) return sessao;

  const perfilEditado = JSON.parse(localStorage.getItem("perfilEditado")) || null;
  if (perfilEditado?.id === sessao.id) {
    return { ...sessao, ...perfilEditado };
  }

  const usuariosLocal = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuarioLocal = usuariosLocal.find((u) => u.id === sessao.id);
  if (usuarioLocal) {
    return { ...sessao, ...usuarioLocal };
  }

  try {
    const resposta = await fetch("data.json");
    const dados = await resposta.json();
    const usuarioData = (dados.usuarios || []).find((u) => u.id === sessao.id);
    if (usuarioData) {
      return { ...sessao, ...usuarioData };
    }
  } catch (erro) {
    console.error("Erro ao carregar usuário completo:", erro);
  }

  return sessao;
}
