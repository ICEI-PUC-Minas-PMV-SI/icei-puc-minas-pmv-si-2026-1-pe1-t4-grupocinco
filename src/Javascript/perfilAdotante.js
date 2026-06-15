let usuarioAtual = null;
let usuarioLogadoSessao = null;
let perfilExibidoAtual = null;
let dadosSistema = null;
let modoEdicao = false;

document.addEventListener("DOMContentLoaded", iniciarPagina);

async function iniciarPagina() {

    try {

        const sessaoRaw =
            localStorage.getItem("usuarioLogado");

        if (!sessaoRaw) {

            exibirErro(
                "Você precisa estar logado para acessar esta página."
            );

            return;
        }

        // usuarioLogado pode ser JSON {id, name, perfil} ou string simples (ID)
        let idUsuarioLogado;
        let usuarioSessao = null;

        try {
            const parsed = JSON.parse(sessaoRaw);
            idUsuarioLogado = parsed.id;
            usuarioSessao = parsed;
        } catch {
            idUsuarioLogado = sessaoRaw;
        }

        const resposta = await fetch("../Javascript/data.json");

        if (!resposta.ok) {
            throw new Error(
                "Não foi possível carregar o data.json"
            );
        }

        const dados = await resposta.json();

        const usuariosSistema =
            obterUsuariosSistema(dados);

        dados.usuarios = usuariosSistema;
        dadosSistema = dados;

        const usuarioLogado =
            usuariosSistema.find(
                usuario =>
                    usuario.id === idUsuarioLogado
            );

        if (!usuarioLogado) {

            exibirErro(
                "Usuário logado não encontrado."
            );

            return;
        }

        usuarioLogadoSessao = usuarioLogado;

        // Se veio do script.js (login novo), copia o perfil e o tipo
        if (usuarioSessao && usuarioSessao.perfil) {
            usuarioLogado.tipo = usuarioSessao.perfil === "adotar" ? "adotante" : "doador";
        }

        const parametros =
            new URLSearchParams(
                window.location.search
            );

        const idPerfil =
            parametros.get("id") ||
            idUsuarioLogado;
        const petIdUrl = parametros.get("petId");

        const perfilExibido =
            usuariosSistema.find(
                usuario =>
                    usuario.id === idPerfil
            );

        if (!perfilExibido) {

            exibirErro(
                "Perfil não encontrado."
            );

            return;
        }

        usuarioAtual = perfilExibido;
        perfilExibidoAtual = perfilExibido;

        const perfilSalvo =
            localStorage.getItem(
                "perfilEditado"
            );

        if (perfilSalvo) {

            const perfilEditado =
                JSON.parse(perfilSalvo);

            if (
                perfilEditado.id ===
                perfilExibido.id
            ) {

                Object.assign(
                    perfilExibido,
                    perfilEditado
                );
            }
        }

        preencherPerfil(
            perfilExibido,
            dados,
            petIdUrl
        );

        atualizarAvatarHeader(usuarioLogado);

        controlarPermissoes(
            usuarioLogado,
            perfilExibido
        );

        configurarEventos(
            usuarioLogado,
            perfilExibido,
            petIdUrl
        );
        configurarTrocaFoto();
        configurarLogout();

    } catch (erro) {

        console.error(erro);

        exibirErro(
            "Ocorreu um erro ao carregar o perfil."
        );
    }
}

function preencherPerfil(usuario, dados, petIdUrl) {

    const foto =
        document.getElementById(
            "fotoPerfil"
        );

    if (foto) {

        foto.src =
            usuario.fotoPerfil ||
            "https://via.placeholder.com/400";

        foto.alt =
            usuario.name;
    }

    alterarTexto(
        "nomeUsuario",
        usuario.name
    );

    alterarTexto(
        "profissaoUsuario",
        usuario.profissao ||
        "Não informado"
    );

    alterarTexto(
        "idadeUsuario",
        `${usuario.idade} anos`
    );

    alterarTexto(
        "localizacaoUsuario",
        `${usuario.cidade || ""}${
            usuario.estado
                ? ", " + usuario.estado
                : ""
        }`
    );

    alterarTexto(
        "sobreUsuario",
        usuario.sobre ||
        "Não informado"
    );

    alterarTexto(
        "tipoMoradia",
        usuario.moradia?.tipo ||
        "Não informado"
    );

    alterarTexto(
        "quintal",
        usuario.moradia?.quintal
            ? "Sim"
            : "Não"
    );

    alterarTexto(
        "procurandoPor",
        usuario.procurandoPor ||
        "Não informado"
    );

    preencherTags(
        "experienciasPets",
        usuario.experiencias || [],
        "estVida exp"
    );

    preencherTags(
        "estilosVida",
        usuario.estiloVida || [],
        "estVida"
    );

    let pet = petIdUrl
        ? obterPetPorId(petIdUrl)
        : obterPetPorId(usuario.petInteresse);

    const candidatura = obterCandidaturaParaPerfil(usuario.id, pet?.id || petIdUrl);

    if (!pet && candidatura) {
        pet = obterPetPorId(candidatura.petId);
    }

    const nomePet =
        pet?.petname ||
        candidatura?.petName ||
        "Nenhum";

    alterarTexto(
        "nomePet",
        nomePet
    );

    atualizarStatusPerfil(usuario.id, pet?.id || petIdUrl);
}

function obterCandidaturaPorCandidato(candidatoId) {
    const candidaturas =
        JSON.parse(localStorage.getItem("candidaturas")) || [];

    return candidaturas.find(
        (c) => c.candidatoId === candidatoId
    );
}

function obterCandidaturaParaPerfil(candidatoId, petId) {
    const candidaturas =
        JSON.parse(localStorage.getItem("candidaturas")) || [];

    if (petId) {
        return candidaturas.find(
            (c) => c.candidatoId === candidatoId && c.petId === petId
        );
    }

    return candidaturas.find(
        (c) => c.candidatoId === candidatoId
    );
}

function atualizarStatusPerfil(candidatoId, petId) {
    const statusEl = document.getElementById(
        "statusCandidatura"
    );

    if (!statusEl) return;

    const candidatura =
        obterCandidaturaParaPerfil(candidatoId, petId);

    if (!candidatura) {
        statusEl.textContent =
            "Status da candidatura: em análise";
        return;
    }

    const statusMap = {
        aprovado: "Aprovado",
        reprovado: "Reprovado",
        pendente: "Em análise"
    };

    statusEl.textContent =
        `Status da candidatura: ${statusMap[candidatura.status] || "Em análise"}`;
}

function atualizarAvatarHeader(usuarioLogado) {
    const avatarImg = document.querySelector(".header .user img");
    if (!avatarImg || !usuarioLogado?.fotoPerfil) return;

    avatarImg.src = usuarioLogado.fotoPerfil;
}

function preencherTags(
    idContainer,
    itens,
    classe
) {

    const container =
        document.getElementById(
            idContainer
        );

    if (!container) return;

    container.innerHTML = "";

    itens.forEach(item => {

        const tag =
            document.createElement("p");

        tag.className = classe;

        tag.textContent = item;

        container.appendChild(tag);
    });
}

function controlarPermissoes(
    usuarioLogado,
    perfilExibido
) {

    const btnEditar =
        document.getElementById(
            "btn-editar"
        );

    const btnSalvar =
        document.getElementById(
            "btn-salvar"
        );

    const acoesDoador =
        document.getElementById(
            "acoesDoador"
        );

    if (btnEditar)
        btnEditar.style.display = "none";

    if (btnSalvar)
        btnSalvar.style.display = "none";

    if (acoesDoador)
        acoesDoador.style.display = "none";

    const mesmoUsuario =
        usuarioLogado.id ===
        perfilExibido.id;

    if (mesmoUsuario) {

        btnEditar.style.display =
            "flex";

        return;
    }

    const podeAvaliarPerfil =
        usuarioLogado.tipo ===
            "doador" &&
        usuarioLogado.id !==
            perfilExibido.id;

    if (
        podeAvaliarPerfil &&
        acoesDoador
    ) {

        acoesDoador.style.display =
            "flex";
    }
}

function configurarEventos(
    usuarioLogado,
    perfilExibido,
    petIdUrl
) {

    const btnEditar =
        document.getElementById(
            "btn-editar"
        );

    const btnSalvar =
        document.getElementById(
            "btn-salvar"
        );

    if (btnEditar) {

        btnEditar.addEventListener(
            "click",
            ativarModoEdicao
        );
    }

    if (btnSalvar) {

        btnSalvar.addEventListener(
            "click",
            salvarPerfil
        );
    }

    const btnAprovado = document.getElementById("btn-aprovado");
    const btnReprovado = document.getElementById("btn-reprovado");

    if (btnAprovado) {
        btnAprovado.addEventListener("click", () => {
            const nomeAdotante = perfilExibido.name;
            let pet = petIdUrl
                ? obterPetPorId(petIdUrl)
                : obterPetPorId(perfilExibido.petInteresse);

            const candidatura = obterCandidaturaParaPerfil(perfilExibido.id, petIdUrl || pet?.id);

            if (!pet && candidatura) {
                pet = obterPetPorId(candidatura.petId);
            }

            const petId = candidatura?.petId || pet?.id || petIdUrl || perfilExibido.petInteresse;
            const nomePet = pet?.petname || candidatura?.petName || "o pet";

            const atualizado = atualizarStatusCandidatura(
                perfilExibido.id,
                petId,
                "aprovado"
            );

            if (atualizado) {
                atualizarStatusPerfil(perfilExibido.id, petId);
            }

            mostrarPopupResultado(
                "Aprovado",
                `A candidatura de ${nomeAdotante} para ${nomePet} foi aprovada.`,
                () => {
                    window.location.href =
                        `PessoasInteressadas.html`;
                }
            );
        });
    }

    if (btnReprovado) {
        btnReprovado.addEventListener("click", () => {
            const nomeAdotante = perfilExibido.name;
            let pet = petIdUrl
                ? obterPetPorId(petIdUrl)
                : obterPetPorId(perfilExibido.petInteresse);

            const candidatura = obterCandidaturaParaPerfil(perfilExibido.id, petIdUrl || pet?.id);

            if (!pet && candidatura) {
                pet = obterPetPorId(candidatura.petId);
            }

            const petId = candidatura?.petId || pet?.id || petIdUrl || perfilExibido.petInteresse;
            const nomePet = pet?.petname || candidatura?.petName || "o pet";

            const perfilSalvo = localStorage.getItem("perfilEditado");

            if (perfilSalvo) {
                const editado = JSON.parse(perfilSalvo);
                if (editado.id === perfilExibido.id) {
                    delete editado.petInteresse;
                    perfilExibido.petInteresse = undefined;
                    localStorage.setItem("perfilEditado", JSON.stringify(editado));
                    alterarTexto("nomePet", "Nenhum");
                }
            }

            const atualizado = atualizarStatusCandidatura(
                perfilExibido.id,
                petId,
                "reprovado"
            );

            if (atualizado) {
                atualizarStatusPerfil(perfilExibido.id, petId);
            }

            mostrarPopupResultado(
                "Reprovado",
                `A candidatura de ${nomeAdotante} para ${nomePet} foi reprovada.`,
                () => {
                    window.location.href =
                        `PessoasInteressadas.html`;
                }
            );
        });
    }
}

function mostrarPopupResultado(titulo, mensagem, onConfirm) {
    const overlay = document.createElement("div");
    overlay.id = "popupOverlay";
    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.45)";
    overlay.style.zIndex = 9999;

    overlay.innerHTML = `
        <div style="background:#fff; padding:24px; border-radius:16px; width: min(520px, 90%); text-align:center; box-shadow:0 14px 40px rgba(0,0,0,0.18);">
            <h2 style="margin-bottom:12px; color:#1f2937;">${titulo}</h2>
            <p style="margin-bottom:24px; color:#4b5563;">${mensagem}</p>
            <button id="popupConfirm" style="padding:12px 24px; background:#2563eb; color:#fff; border:none; border-radius:10px; cursor:pointer; font-size:1rem;">OK</button>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById("popupConfirm")?.addEventListener("click", () => {
        overlay.remove();
        onConfirm?.();
    });
}

function atualizarStatusCandidatura(candidatoId, petId, status) {
    const candidaturas =
        JSON.parse(localStorage.getItem("candidaturas")) || [];

    if (!petId) {
        const fallback = candidaturas.find(
            (cand) => cand.candidatoId === candidatoId
        );
        petId = fallback?.petId;
    }

    if (!candidatoId) return false;

    if (!petId) {
        petId = perfilExibidoAtual?.petInteresse || candidaturas.find(
            (cand) => cand.candidatoId === candidatoId
        )?.petId;
    }

    if (!petId) return false;

    const indice = candidaturas.findIndex(
        (cand) =>
            cand.candidatoId === candidatoId &&
            cand.petId === petId
    );

    if (indice >= 0) {
        candidaturas[indice].status = status;
        candidaturas[indice].timestamp = new Date().toISOString();
    } else {
        const pet = obterPetPorId(petId);

        const doadorId = usuarioLogadoSessao?.id || "";
        const candidatoName =
            perfilExibidoAtual?.name || "Adotante";
        const candidatoFoto =
            perfilExibidoAtual?.fotoPerfil || "";

        candidaturas.push({
            id: `cand_${Date.now()}`,
            petId,
            petName: pet?.petname || "Pet",
            doadorId,
            candidatoId,
            candidatoName,
            candidatoFoto,
            status,
            timestamp: new Date().toISOString(),
            mensagem:
                status === "aprovado"
                    ? `Sua candidatura para ${pet?.petname || "o pet"} foi aprovada.`
                    : `Sua candidatura para ${pet?.petname || "o pet"} foi reprovada.`,
        });
    }

    localStorage.setItem(
        "candidaturas",
        JSON.stringify(candidaturas)
    );

    return true;
}

function configurarTrocaFoto() {

    const input =
        document.getElementById("inputFoto");

    const foto =
        document.getElementById("fotoPerfil");

    const overlay =
    document.getElementById(
        "overlayFoto"
    );

    if (!input || !foto) return;

    input.addEventListener(
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

                input.value = "";

                return;
            }

            const leitor =
                new FileReader();

            leitor.onload =
                function(e) {

                    foto.src =
                        e.target.result;
                };

            leitor.readAsDataURL(
                arquivo
            );
        }
    );
}

function configurarLogout() {
    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );

    if (!logoutBtn) return;

    logoutBtn.addEventListener(
        "click",
        () => {
            localStorage.removeItem(
                "usuarioLogado"
            );
            window.location.href =
                "telainicial.html";
        }
    );
}

function ativarModoEdicao() {

    if (modoEdicao) return;

    modoEdicao = true;

    transformarEmInput(
        "nomeUsuario"
    );

    transformarEmInput(
        "profissaoUsuario"
    );

    transformarEmInput(
        "idadeUsuario"
    );

    transformarEmInput(
        "localizacaoUsuario"
    );

    transformarEmTextarea(
        "sobreUsuario"
    );

    transformarEmTextarea(
        "procurandoPor"
    );

    transformarEmSelect(
        "tipoMoradia",
        [
            "Casa",
            "Apartamento",
            "Chácara",
            "Sítio"
        ]
    );

    transformarEmSelect(
        "quintal",
        [
            "Sim",
            "Não"
        ]
    );

    transformarTagsEmEdicao(
        "experienciasPets",
        usuarioAtual.experiencias || []
    );

    transformarTagsEmEdicao(
        "estilosVida",
        usuarioAtual.estiloVida || []
    );

    document.getElementById(
        "btn-salvar"
    ).style.display = "flex";

    const overlay =
    document.getElementById(
        "overlayFoto"
    );

    // O input de arquivo permanece invisível; o label `overlayFoto` usa `for="inputFoto"`.

    if (overlay) {

        overlay.style.display =
            "flex";
    }
}

function transformarTagsEmEdicao(
    idContainer,
    itens
) {

    const container =
        document.getElementById(
            idContainer
        );

    if (!container) return;

    container.innerHTML = `
        <textarea
            class="campo-edicao-area"
            rows="4">${itens.join(", ")}</textarea>

        <small>
            Separe os itens por vírgula
        </small>
    `;
}

function transformarEmInput(id) {

    const elemento =
        document.getElementById(id);

    const valor =
        elemento.textContent.trim();

    elemento.innerHTML =
        `<input
            type="text"
            class="campo-edicao"
            value="${valor}">`;
        if (id === "idadeUsuario") {

    elemento.innerHTML = `
        <input
            type="number"
            min="0"
            class="campo-edicao"
            value="${valor}">
        <span> anos</span>
    `;

    return;
}
}

function transformarEmTextarea(id) {

    const elemento =
        document.getElementById(id);

    const valor =
        elemento.textContent.trim();

    elemento.innerHTML =
        `<textarea class="campo-edicao-area">${valor}</textarea>`;
}

function transformarEmSelect(
    id,
    opcoes
) {

    const elemento =
        document.getElementById(id);

    const valorAtual =
        elemento.textContent.trim();

    let html =
        `<select class="campo-edicao">`;

    opcoes.forEach(opcao => {

        html += `
            <option
                value="${opcao}"
                ${opcao === valorAtual ? "selected" : ""}>
                ${opcao}
            </option>
        `;
    });

    html += "</select>";

    elemento.innerHTML = html;
}

function salvarPerfil() {

    usuarioAtual.name =
        document.querySelector(
            "#nomeUsuario input"
        ).value;

    usuarioAtual.profissao =
        document.querySelector(
            "#profissaoUsuario input"
        ).value;

    usuarioAtual.idade =
    document.querySelector(
        "#idadeUsuario input"
    ).value.replace(" anos", "");

    const localizacao =
        document.querySelector(
            "#localizacaoUsuario input"
        ).value;

    const partes =
        localizacao.split(",");

    usuarioAtual.cidade =
        partes[0]?.trim() || "";

    usuarioAtual.estado =
        partes[1]?.trim() || "";

    usuarioAtual.sobre =
        document.querySelector(
            "#sobreUsuario textarea"
        ).value;

    usuarioAtual.procurandoPor =
        document.querySelector(
            "#procurandoPor textarea"
        ).value;

    usuarioAtual.moradia.tipo =
        document.querySelector(
            "#tipoMoradia select"
        ).value;

    usuarioAtual.moradia.quintal =
        document.querySelector(
            "#quintal select"
        ).value === "Sim";

    usuarioAtual.experiencias =
        document
            .querySelector(
                "#experienciasPets textarea"
            )
            .value
            .split(",")
            .map(item => item.trim())
            .filter(Boolean);

    usuarioAtual.estiloVida =
        document
            .querySelector(
                "#estilosVida textarea"
            )
            .value
            .split(",")
            .map(item => item.trim())
            .filter(Boolean);

    usuarioAtual.fotoPerfil =
        document.getElementById(
            "fotoPerfil"
        ).src;

    salvarUsuarioLocalStorage(usuarioAtual);

    const sessaoRaw = localStorage.getItem("usuarioLogado");
    if (sessaoRaw) {
        try {
            const sessaoAtual = JSON.parse(sessaoRaw);
            const sessaoAtualizada = {
                ...sessaoAtual,
                name: usuarioAtual.name || sessaoAtual.name,
                fotoPerfil: usuarioAtual.fotoPerfil || sessaoAtual.fotoPerfil,
            };
            localStorage.setItem(
                "usuarioLogado",
                JSON.stringify(sessaoAtualizada)
            );
            usuarioLogadoSessao = sessaoAtualizada;
        } catch {
            // ignore invalid session format
        }
    }

    localStorage.setItem(
        "perfilEditado",
        JSON.stringify(usuarioAtual)
    );

    preencherPerfil(
        usuarioAtual,
        dadosSistema
    );

    const inputFoto =
        document.getElementById(
            "inputFoto"
        );

    if (inputFoto) {

        inputFoto.style.display =
            "none";
    }

    document.getElementById(
        "btn-salvar"
    ).style.display = "none";

    modoEdicao = false;

    alert(
        "Alterações salvas com sucesso!"
    );

    const overlay =
    document.getElementById(
        "overlayFoto"
    );

    if (overlay) {

        overlay.style.display =
            "none";
}
}

function carregarUsuariosLocalStorage() {
    try {
        return JSON.parse(
            localStorage.getItem("usuarios")
        ) || [];
    } catch {
        return [];
    }
}

function salvarUsuarioLocalStorage(usuario) {
    const usuariosLocal =
        carregarUsuariosLocalStorage();

    const indice = usuariosLocal.findIndex(
        u => u.id === usuario.id
    );

    if (indice >= 0) {
        usuariosLocal[indice] = usuario;
    } else {
        usuariosLocal.push(usuario);
    }

    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuariosLocal)
    );
}

function obterUsuariosSistema(dados) {
    const usuariosLocal =
        carregarUsuariosLocalStorage();

    const usuariosPorId = new Map();

    (dados.usuarios || []).forEach(usuario => {
        usuariosPorId.set(usuario.id, usuario);
    });

    usuariosLocal.forEach(usuario => {
        usuariosPorId.set(usuario.id, usuario);
    });

    return Array.from(usuariosPorId.values());
}

function obterPetPorId(petId) {
    if (!petId) return null;

    const petsJson = dadosSistema?.pets || [];
    const petsLocal = JSON.parse(localStorage.getItem("pets")) || [];
    const petsPorId = new Map();

    [...petsJson, ...petsLocal].forEach(pet => {
        if (pet?.id) {
            petsPorId.set(pet.id, pet);
        }
    });

    return petsPorId.get(petId) || null;
}

function alterarTexto(
    id,
    valor
) {

    const elemento =
        document.getElementById(id);

    if (elemento) {

        elemento.textContent =
            valor;
    }
}

function exibirErro(
    mensagem
) {

    const container =
        document.querySelector(
            ".container"
        );

    if (!container) return;

    container.innerHTML = `
        <div class="caixa"
             style="
             grid-column: span 2;
             padding:40px;
             text-align:center;
             ">
            <h2>Erro</h2>
            <p>${mensagem}</p>
        </div>
    `;
}