// ==========================================
// perfilDoador.js
// Perfil do Doador — carrega do data.json
// Com edição e botões para histórico/pets
// ==========================================

let usuarioAtual = null;
let dadosSistema = null;
let modoEdicao = false;

document.addEventListener("DOMContentLoaded", iniciarPagina);

async function iniciarPagina() {

    try {

        const sessaoRaw =
            localStorage.getItem(
                "usuarioLogado"
            );

        if (!sessaoRaw) {

            exibirErro(
                "Você precisa estar logado para acessar esta página."
            );

            return;
        }

        // Parse da sessão (JSON ou string simples)
        let idUsuarioLogado;

        try {
            idUsuarioLogado =
                JSON.parse(sessaoRaw).id;
        } catch {
            idUsuarioLogado = sessaoRaw;
        }

        const resposta =
            await fetch(
                "../Javascript/data.json"
            );

        if (!resposta.ok) {
            throw new Error(
                "Não foi possível carregar os dados."
            );
        }

        const dados =
            await resposta.json();

        dadosSistema = dados;

        const usuariosSistema =
            obterUsuariosSistema(dados);

        const usuario =
            usuariosSistema.find(
                u => u.id === idUsuarioLogado
            );

        if (!usuario) {

            exibirErro(
                "Usuário não encontrado."
            );

            return;
        }

        usuarioAtual = usuario;

        // Carrega edições salvas
        const perfilSalvo =
            localStorage.getItem(
                "perfilEditado"
            );

        if (perfilSalvo) {

            const editado =
                JSON.parse(perfilSalvo);

            if (
                editado.id === usuario.id
            ) {
                Object.assign(
                    usuario,
                    editado
                );
            }
        }

        preencherPerfil(usuario);
        configurarEventos();

    } catch (erro) {

        console.error(erro);

        exibirErro(
            "Ocorreu um erro ao carregar o perfil."
        );
    }
}

function obterUsuariosSistema(dados) {
    const usuariosLocal =
        JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuariosPorId = new Map();

    (dados.usuarios || []).forEach(usuario => {
        usuariosPorId.set(usuario.id, usuario);
    });

    usuariosLocal.forEach(usuario => {
        usuariosPorId.set(usuario.id, usuario);
    });

    return Array.from(usuariosPorId.values());
}

function preencherPerfil(usuario) {

    // Foto
    const imgFoto =
        document.querySelector(
            ".foto"
        );

    if (imgFoto) {
        imgFoto.src =
            usuario.fotoPerfil ||
            "https://via.placeholder.com/400";

        imgFoto.alt = usuario.name;
    }

    // Nome
    const nomeEl =
        document.querySelector(
            ".nome"
        );

    if (nomeEl) {
        nomeEl.textContent =
            usuario.name;
    }

    // Informações nos campos .info-doador
    const campos =
        document.querySelectorAll(
            ".info-doador"
        );

    if (campos.length >= 6) {

        campos[0].textContent =
            usuario.name;

        campos[1].textContent =
            usuario.email ||
            "Não informado";

        campos[2].textContent =
            usuario.telefone ||
            "Não informado";

        campos[3].textContent =
            usuario.endereco ||
            usuario.cidade ||
            "Não informado";

        campos[4].textContent =
            usuario.bairro ||
            "Não informado";

        campos[5].textContent =
            usuario.estado ||
            "Não informado";
    }
}

function configurarEventos() {

    const btnEditar =
        document.getElementById(
            "btn-editar"
        );

    if (btnEditar) {
        btnEditar.addEventListener(
            "click",
            ativarModoEdicao
        );
    }

    // Troca de foto
    const overlay =
        document.querySelector(
            ".troca-foto-overlay"
        );

    const inputFoto =
        document.getElementById(
            "inputFoto"
        );

    if (overlay && inputFoto) {

        overlay.addEventListener(
            "click",
            () => inputFoto.click()
        );

        inputFoto.addEventListener(
            "change",
            function(event) {

                const arquivo =
                    event.target.files[0];

                if (!arquivo) return;

                // Limite de 10MB
                if (
                    arquivo.size >
                    10 * 1024 * 1024
                ) {

                    alert(
                        "A foto deve ter no máximo 10MB. Selecione uma imagem menor."
                    );

                    inputFoto.value = "";

                    return;
                }

                const leitor =
                    new FileReader();

                leitor.onload =
                    function(e) {

                        const img =
                            document.querySelector(
                                ".foto"
                            );

                        if (img) {
                            img.src =
                                e.target.result;
                        }
                    };

                leitor.readAsDataURL(
                    arquivo
                );
            }
        );
    }

    // Botão PETs em Adoção
    const btnAdocao =
        document.querySelector(
            ".btn-pet-adocao"
        );

    if (btnAdocao && usuarioAtual) {

        btnAdocao.addEventListener(
            "click",
            (e) => {

                e.preventDefault();

                window.location.href =
                    `HistoricoPetEAtivo.html?userId=${usuarioAtual.id}&em_adocao=true`;
            }
        );
    }

    // Botão Histórico de PETs
    const btnHistorico =
        document.querySelector(
            ".btn-pet-doados"
        );

    if (btnHistorico && usuarioAtual) {

        btnHistorico.addEventListener(
            "click",
            (e) => {

                e.preventDefault();

                window.location.href =
                    `HistoricoPetEAtivo.html?userId=${usuarioAtual.id}&em_adocao=false`;
            }
        );
    }
}

function ativarModoEdicao() {

    if (modoEdicao) return;

    modoEdicao = true;

    const campos =
        document.querySelectorAll(
            ".info-doador"
        );

    campos.forEach(campo => {

        const valor =
            campo.textContent.trim();

        if (
            valor === "Não informado"
        ) {
            campo.innerHTML = `
                <input
                    type="text"
                    class="campo-edicao"
                    value="">
            `;
        } else {
            campo.innerHTML = `
                <input
                    type="text"
                    class="campo-edicao"
                    value="${valor}">
            `;
        }
    });

    // Mostra o overlay de troca de foto
    const overlay =
        document.querySelector(
            ".troca-foto-overlay"
        );

    if (overlay) {
        overlay.style.display =
            "flex";
    }

    // Troca o botão editar por salvar
    const btnEditar =
        document.getElementById(
            "btn-editar"
        );

    if (btnEditar) {
        btnEditar.innerHTML = "💾";
        btnEditar.title =
            "Salvar Alterações";
        btnEditar.id = "btn-salvar";
        btnEditar.onclick =
            salvarPerfil;
    }
}

function salvarPerfil() {

    const campos =
        document.querySelectorAll(
            ".info-doador"
        );

    const valores = [];

    campos.forEach(campo => {

        const input =
            campo.querySelector(
                "input"
            );

        valores.push(
            input
                ? input.value
                : campo.textContent.trim()
        );
    });

    if (valores.length >= 6) {

        usuarioAtual.name =
            valores[0] ||
            usuarioAtual.name;

        usuarioAtual.email =
            valores[1];

        usuarioAtual.telefone =
            valores[2];

        usuarioAtual.endereco =
            valores[3];

        usuarioAtual.bairro =
            valores[4];

        usuarioAtual.estado =
            valores[5];
    }

    // Salva a foto
    const imgFoto =
        document.querySelector(
            ".foto"
        );

    if (imgFoto) {
        usuarioAtual.fotoPerfil =
            imgFoto.src;
    }

    localStorage.setItem(
        "perfilEditado",
        JSON.stringify(usuarioAtual)
    );

    // Volta ao modo normal
    modoEdicao = false;

    // Recarrega a página para resetar visual
    location.reload();
}

function exibirErro(mensagem) {

    const container =
        document.querySelector(
            ".container"
        );

    if (!container) return;

    container.innerHTML = `
        <div class="conteudo"
             style="
             padding:40px;
             text-align:center;
             ">
            <h2>Erro</h2>
            <p>${mensagem}</p>
        </div>
    `;
}
