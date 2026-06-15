document.addEventListener("DOMContentLoaded", () => {
  const sessaoRaw = localStorage.getItem("usuarioLogado");
  if (!sessaoRaw) return;

  let usuarioLogado = null;

  try {
    usuarioLogado = JSON.parse(sessaoRaw);
  } catch (erro) {
    return;
  }

  const avatarImg = document.querySelector(".user img");
  if (avatarImg && usuarioLogado?.fotoPerfil) {
    avatarImg.src = usuarioLogado.fotoPerfil;
    avatarImg.alt = usuarioLogado.name || "Usuário";
  }

  const menuPerfil = document.getElementById("menuPerfil");
  if (menuPerfil) {
    const ehDoador =
      usuarioLogado.perfil === "doar" ||
      usuarioLogado.tipo === "doador";

    menuPerfil.href = ehDoador ? "PerfilDoador.html" : "perfilAdotante.html";
  }
});
