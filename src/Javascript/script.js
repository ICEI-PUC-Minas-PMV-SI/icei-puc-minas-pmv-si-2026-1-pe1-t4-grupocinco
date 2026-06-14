// ==========================================
// 0, 1 e 3) GESTÃO DE USUÁRIOS (CADASTRO / LOGIN)
// ==========================================

// Executa automaticamente ao carregar as páginas para verificar sessões
document.addEventListener("DOMContentLoaded", () => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    const path = window.location.pathname;

    // 3) Verifica se o usuário já está logado para evitar telas de login/cadastro
    if (usuarioLogado) {
        if (path.includes("cadastro.html") || path.includes("login.html")) {
            alert("Você já está logado!");
            // Redireciona conforme o perfil salvo na sessão
            if (usuarioLogado.perfil === "adotar") {
                window.location.href = "TelaExibição.html";
            } else {
                window.location.href = "PessoasInteressadas.html";
            }
        }
    }
});

// Função chamada no submit do formulário de cadastro.html
function registrarUsuario(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const name = document.getElementById("name").value.trim();
    const idnumber = document.getElementById("idnumber").value.trim();

    // Recupera usuários existentes ou cria um array vazio
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // 0) Verifica se o usuário já possui cadastro (por CPF ou Email)
    const usuarioExiste = usuarios.some(u => u.email === email || u.idnumber === idnumber);

    if (usuarioExiste) {
        alert("Erro: Já existe um usuário cadastrado com este E-mail ou CPF!");
        return;
    }

    // 1) Cria o novo usuário com os IDs do HTML + um ID único gerado por timestamp
    const novoUsuario = {
        id: "usr_" + Date.now(),
        tipo: "adotante",
        email: email,
        password: password,
        name: name,
        idnumber: idnumber,
        idade: null,
        profissao: "",
        cidade: "",
        estado: "",
        sobre: "",
        moradia: {
            tipo: "",
            quintal: false
        },
        experiencias: [],
        estiloVida: [],
        procurandoPor: "",
        fotoPerfil: "",
        petInteresse: ""
    };

    // Salva no array e atualiza o localStorage
    usuarios.push(novoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Cadastro realizado com sucesso!");
    window.location.href = "login.html";
}

// 2) Ajuste da sua função existente de login para incluir identificadores e sessão
function direcionarUsuario() {
    const formulario = document.getElementById('meuForm');
    const opcaoAdotar = document.getElementById('adotar');
    const opcaoDoar = document.getElementById('doar');
    const loginInput = document.getElementById('login').value.trim();
    const passwordInput = document.getElementById('password').value;

    if (!formulario.checkValidity()) {
        formulario.reportValidity();
        return;
    }

    // Busca a lista de usuários cadastrados
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Valida as credenciais (comparando com o campo email ou idnumber)
    const usuarioValido = usuarios.find(u => (u.email === loginInput || u.idnumber === loginInput) && u.password === passwordInput);

    if (!usuarioValido) {
        alert("Usuário ou senha incorretos. Por favor, verifique ou cadastre-se.");
        return;
    }

    // 2) Define o perfil escolhido na tela de login
    const perfilEscolhido = opcaoAdotar.checked ? "adotar" : "doar";

    // Cria a sessão do usuário logado mantendo o ID dele e o perfil escolhido nesta sessão
    const sessaoUsuario = {
        id: usuarioValido.id,
        name: usuarioValido.name,
        perfil: perfilEscolhido
    };
    
    localStorage.setItem("usuarioLogado", JSON.stringify(sessaoUsuario));

    // Redirecionamento original baseado na escolha
    if (opcaoAdotar.checked) {
        window.location.href = "TelaExibição.html"; 
    } else if (opcaoDoar.checked) {
        window.location.href = "PessoasInteressadas.html";
    } 
}

// Função utilitária para Logout (Limpar a sessão)
function fazerLogout() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
}


// ==========================================
// 4) GESTÃO DE PETS (cadastropet.html) - Abordagem por URL
// ==========================================

// Função chamada no submit do formulário de cadastropet.html
function registrarPet(event) {
    event.preventDefault(); // Impede o redirecionamento imediato

    // Verifica se há um usuário logado para vinculação
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuarioLogado) {
        alert("Erro: Você precisa estar logado para cadastrar um pet.");
        window.location.href = "login.html";
        return;
    }

    // Captura os campos usando exatamente os IDs do HTML
    const petname = document.getElementById("petname").value.trim();
    const raca = document.getElementById("raca").value.trim();
    const age = document.getElementById("age").value.trim();
    const size = document.getElementById("size").value.trim();
    const sex = document.getElementById("sex").value.trim();
    const personality = document.getElementById("personality").value.trim();

    // Captura os links das fotos inseridos nos inputs
    const fotos = [];
    const foto1 = document.getElementById("petPhoto1").value.trim();
    const foto2 = document.getElementById("petPhoto2").value.trim();
    const foto3 = document.getElementById("petPhoto3").value.trim();

    if (foto1) fotos.push(foto1);
    if (foto2) fotos.push(foto2);
    if (foto3) fotos.push(foto3);

    // Garante que pelo menos uma foto foi enviada (opcional, remova se não for obrigatório)
    if (fotos.length === 0) {
        alert("Por favor, insira o link de pelo menos uma foto para o pet.");
        return;
    }

    // Captura as vacinas
    const vacinas = [];
    if (document.getElementById("vac_v8").checked) vacinas.push("v8_v10");
    if (document.getElementById("vac_raiva").checked) vacinas.push("raiva");
    if (document.getElementById("vac_gripe").checked) vacinas.push("gripe");
    if (document.getElementById("vac_giardia").checked) vacinas.push("giardia");
    if (document.getElementById("vac_leish").checked) vacinas.push("leishmaniose");

    // Recupera a lista de pets global do localStorage
    let pets = JSON.parse(localStorage.getItem("pets")) || [];

    // Verifica se o animal já está cadastrado (validação por nome, raça e dono)
    const petExiste = pets.some(pet => 
        pet.petname.toLowerCase() === petname.toLowerCase() && 
        pet.raca.toLowerCase() === raca.toLowerCase() &&
        pet.userId === usuarioLogado.id
    );

    if (petExiste) {
        alert("Você já cadastrou um pet com esse mesmo nome e raça!");
        return;
    }

    // Cria o objeto do pet vinculando ao ID do usuário logado e incluindo as URLs das fotos
    const novoPet = {
        id: "pet_" + Date.now(),
        userId: usuarioLogado.id, 
        petname: petname,
        raca: raca,
        age: age,
        size: size,
        sex: sex,
        personality: personality,
        vacinas: vacinas,
        fotos: fotos // Array contendo as strings das URLs das imagens
    };

    pets.push(novoPet);
    localStorage.setItem("pets", JSON.stringify(pets));

    alert("Pet cadastrado com sucesso!");
    window.location.href = "TelaExibição.html";
}

// Nova função de preview adaptada para URLs de imagens
// Adiciona ouvintes para atualizar o preview assim que o usuário sai do campo de texto (evento 'blur')
document.addEventListener("DOMContentLoaded", () => {
    const p1 = document.getElementById("petPhoto1");
    const p2 = document.getElementById("petPhoto2");
    const p3 = document.getElementById("petPhoto3");

    // Só adiciona os eventos se os campos existirem na página atual (cadastropet.html)
    if (p1 && p2 && p3) {
        [p1, p2, p3].forEach(input => {
            input.addEventListener("blur", atualizarPreviewLinks);
        });
    }
});

function atualizarPreviewLinks() {
    // Procura ou cria o container de preview dinamicamente caso ele não esteja explícito abaixo dos novos inputs
    let previewContainer = document.getElementById('preview-container');
    if (!previewContainer) {
        previewContainer = document.createElement('div');
        previewContainer.id = 'preview-container';
        previewContainer.className = 'd-flex flex-wrap gap-2 mt-3';
        document.getElementById("petPhoto3").parentNode.appendChild(previewContainer);
    }

    previewContainer.innerHTML = ''; // Limpa os previews antigos

    const foto1 = document.getElementById("petPhoto1").value.trim();
    const foto2 = document.getElementById("petPhoto2").value.trim();
    const foto3 = document.getElementById("petPhoto3").value.trim();

    [foto1, foto2, foto3].forEach(url => {
        if (url) {
            const img = document.createElement('img');
            img.src = url;
            img.classList.add('img-preview');
            img.style.width = "100px";
            img.style.height = "100px";
            img.style.objectFit = "cover";
            img.style.borderRadius = "8px";
            img.style.border = "1px solid #ccc";
            
            // Tratamento caso a URL colada seja inválida ou quebrada
            img.onerror = function() {
                this.src = "https://placehold.co/100x100?text=Erro+Imagem"; // Placeholder de erro visual
            };

            previewContainer.appendChild(img);
        }
    });
}
