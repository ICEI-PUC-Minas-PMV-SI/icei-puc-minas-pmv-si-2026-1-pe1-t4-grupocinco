function montarHeaderDoador() {
  return `
    <div class="logo">🐾 LarCerto</div>

    <nav class="nav">
      <a href="TelaExibição.html">Início</a>
      <a href="PessoasInteressadas.html">Interessados</a>
      <a href="TelaExibição.html">Pets</a>
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
      <a href="telainicial.html" id="nav-inicio">Início</a>
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

function configurarHeaderMensagens() {
  const header = document.getElementById("pageHeader");
  if (!header) return;

  const sessaoRaw = localStorage.getItem("usuarioLogado");
  let perfil = null;
  let tipo = null;

  if (sessaoRaw) {
    try {
      const sessao = JSON.parse(sessaoRaw);
      perfil = sessao.perfil;
      tipo = sessao.tipo;
    } catch {
      perfil = null;
      tipo = null;
    }
  }

  const ehDoador = perfil === "doar" || tipo === "doador";

  header.className = ehDoador ? "header header-doador" : "header header-adotante";
  header.innerHTML = ehDoador ? montarHeaderDoador() : montarHeaderAdotante();

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "telainicial.html";
  });
}

document.addEventListener("DOMContentLoaded", configurarHeaderMensagens);
