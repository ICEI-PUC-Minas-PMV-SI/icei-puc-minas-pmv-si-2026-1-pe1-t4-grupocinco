let usuarioAtual = null;
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

        const resposta =
            await fetch("../Javascript/data.json");

        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar o data.json"
            );
        }

        const dados =
            await resposta.json();

        dadosSistema = dados;

        const usuarioLogado =
            dados.usuarios.find(
                usuario =>
                    usuario.id === idUsuarioLogado
            );

        if (!usuarioLogado) {

            exibirErro(
                "Usuário logado não encontrado."
            );

            return;
        }

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

        const perfilExibido =
            dados.usuarios.find(
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
            dados
        );

        controlarPermissoes(
            usuarioLogado,
            perfilExibido
        );

        configurarEventos(
            usuarioLogado,
            perfilExibido
        );
        configurarTrocaFoto();

    } catch (erro) {

        console.error(erro);

        exibirErro(
            "Ocorreu um erro ao carregar o perfil."
        );
    }
}

function preencherPerfil(usuario, dados) {

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

    const pet =
        dados.pets.find(
            pet =>
                pet.id ===
                usuario.petInteresse
        );

    alterarTexto(
        "nomePet",
        pet?.petname || "Nenhum"
    );
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

    document
        .getElementById(
            "btn-aprovado"
        )
        ?.addEventListener(
            "click",
            () => {

                const nomeAdotante =
                    perfilExibido.name;

                const pet =
                    dados.pets.find(
                        p =>
                            p.id ===
                            perfilExibido.petInteresse
                    );

                const nomePet =
                    pet?.petname ||
                    "o pet";

                const mensagem =
                    encodeURIComponent(
                        `Parabéns, ${nomeAdotante}!! Você acabou de ser aprovado para a adoção do ${nomePet}. Deseja continuar com a adoção?`
                    );

                window.location.href =
                    `mensagens.html?contato=${encodeURIComponent(nomeAdotante)}&msg=${mensagem}`;
            }
        );

    document
        .getElementById(
            "btn-reprovado"
        )
        ?.addEventListener(
            "click",
            () => {

                const nomeAdotante =
                    perfilExibido.name;

                const pet =
                    dados.pets.find(
                        p =>
                            p.id ===
                            perfilExibido.petInteresse
                    );

                const nomePet =
                    pet?.petname ||
                    "o pet";

                // Remove petInteresse do perfil editado
                const perfilSalvo =
                    localStorage.getItem(
                        "perfilEditado"
                    );

                if (perfilSalvo) {

                    const editado =
                        JSON.parse(
                            perfilSalvo
                        );

                    if (
                        editado.id ===
                        perfilExibido.id
                    ) {

                        delete editado.petInteresse;

                        perfilExibido.petInteresse =
                            undefined;

                        localStorage.setItem(
                            "perfilEditado",
                            JSON.stringify(
                                editado
                            )
                        );

                        // Atualiza a tela
                        alterarTexto(
                            "nomePet",
                            "Nenhum"
                        );
                    }
                }

                const mensagem =
                    encodeURIComponent(
                        `Poxa, ${nomeAdotante}, seu perfil foi analisado e você não se enquadra para a adoção do ${nomePet}.`
                    );

                window.location.href =
                    `mensagens.html?contato=${encodeURIComponent(nomeAdotante)}&msg=${mensagem}`;
            }
        );
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

    overlay?.addEventListener(
        "click",
        () => input.click()
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