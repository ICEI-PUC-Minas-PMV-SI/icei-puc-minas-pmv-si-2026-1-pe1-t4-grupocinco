document.addEventListener("DOMContentLoaded", async () => {
  const sessaoRaw = localStorage.getItem("usuarioLogado");
  if (!sessaoRaw) return;

  let usuarioLogado = null;

  try {
    usuarioLogado = JSON.parse(sessaoRaw);
  } catch (erro) {
    return;
  }

  const avatarImg = document.querySelector(".user img");
  const usuarioCompleto = await obterUsuarioCompleto(usuarioLogado);

  if (avatarImg && usuarioCompleto?.fotoPerfil) {
    avatarImg.src = usuarioCompleto.fotoPerfil;
    avatarImg.alt = usuarioCompleto.name || "Usuário";
  }

  async function obterUsuarioCompleto(sessao) {
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

  const ehDoador =
    usuarioLogado.perfil === "doar" ||
    usuarioLogado.tipo === "doador";

  const menuPerfil = document.getElementById("menuPerfil");
  if (menuPerfil) {
    menuPerfil.href = ehDoador ? "PerfilDoador.html" : "perfilAdotante.html";
  }

  const painelDoador = document.getElementById("painelDoador");
  if (painelDoador) {
    if (ehDoador) {
      painelDoador.style.display = "inline-block";
      painelDoador.href = "TelaExibição.html";
    } else {
      painelDoador.style.display = "none";
    }
  }

  const menuPets = document.getElementById("menuPets");
  if (menuPets && ehDoador) {
    menuPets.href = "TelaExibição.html";
  }
});
