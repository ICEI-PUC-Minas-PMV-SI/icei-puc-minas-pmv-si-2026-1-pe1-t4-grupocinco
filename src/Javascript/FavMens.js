document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // SELEÇÃO DE ELEMENTOS (CHAT)
    // ==========================================
    const chatMessages = document.querySelector(".chat-messages");
    const chatInput = document.querySelector(".chat-input-container input");
    const chatHeader = document.querySelector(".chat-header");
    const searchInput = document.querySelector(".search-box input");
    const sendBtn = document.querySelector(".send-btn"); 
    const contactList = document.querySelector(".contact-list");
    let contatos = document.querySelectorAll(".contact");

    // === BANCO DE DADOS DE CONVERSAS ===
    const historicoConversas = {
        "Ana Almeida": [
            { tipo: "received", texto: "Olá, estou interessado nesse poodle fofinho.Ela é calma? Pois tenho um gatinho.", hora: "10:30" },
            { tipo: "sent", texto: "Oii,tudo bem?É muito calma sim!! Aceita bem outros animais.", hora: "11:45" }
        ],
        "Marcos Souza": [ { tipo: "received", texto: "Olá! O Cão Médio ainda está disponível para adoção?", hora: "14:20" } ],
        "Ludmilla Lara": [ { tipo: "received", texto: "Oi! Vi o anúncio do Cão Pequeno. Qual o tamanho exato dele?", hora: "09:15" } ],
        "Ricardo Silva": [ { tipo: "received", texto: "Gostei muito do Bobi! Pode me passar mais informações?", hora: "16:00" } ],
        "Beatriz Souza": [ { tipo: "received", texto: "Olá, a Mel se dá bem com crianças?", hora: "11:02" } ],
        "Carlos Mendes": [ { tipo: "received", texto: "Gostaria de agendar uma visita para conhecer o Thor.", hora: "13:40" } ],
        "Fernanda Lima": [ { tipo: "received", texto: "A Luna já está castrada e vacinada?", hora: "10:10" } ],
        "André Santos": [ { tipo: "received", texto: "Olá! O Max é muito agitado?", hora: "15:30" } ],
        "Juliana Paiva": [ { tipo: "received", texto: "Oi, tenho interesse em adotar a Amora.", hora: "17:15" } ],
        "Roberto Dias": [ { tipo: "received", texto: "Boa tarde, o Fred é dócil?", hora: "12:00" } ]
    };
// Ativa dinamicamente a cor laranja no menu baseado na página atual
const paginaAtual = window.location.pathname.split("/").pop();

if (paginaAtual === "telainicial.html") {
    document.getElementById("nav-inicio")?.classList.add("active");
} else if (paginaAtual === "PessoasInteressadas.html") {
    document.getElementById("nav-adotantes")?.classList.add("active");
} else if (paginaAtual === "favoritos.html") {
    document.getElementById("nav-favoritos")?.classList.add("active");
} else if (paginaAtual === "mensagens.html") {
    document.getElementById("nav-mensagens")?.classList.add("active");
} else if (paginaAtual === "PerfilDoador.html") {
    document.getElementById("nav-perfil")?.classList.add("active");
}

    carregarContatosDinamicos();
    contatos = document.querySelectorAll(".contact");
    // === FUNÇÕES AUXILIARES DO CHAT ===
    function getContatoAtivo() {
        if (!chatHeader) return "Ana Almeida";
        const nomeElemento = chatHeader.querySelector("strong");
        return nomeElemento ? nomeElemento.innerText.trim() : "Ana Almeida";
    }

    function carregarMensagens(nomeContato) {
        if (!chatMessages) return;
        chatMessages.innerHTML = ""; 

        const mensagens = historicoConversas[nomeContato] || [];
        mensagens.forEach(msg => {
            const novaBolha = document.createElement("div");
            novaBolha.className = `bubble ${msg.tipo}`;
            novaBolha.innerHTML = `
                <span class="message-text">${msg.texto}</span>
                <span class="message-time">${msg.hora}</span>
            `;
            chatMessages.appendChild(novaBolha);
        });
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function enviarMensagem() {
        if (!chatInput || !chatMessages) return;
        const texto = chatInput.value.trim();
        
        if (texto !== "") {
            const contatoAtivo = getContatoAtivo();
            const agora = new Date();
            const hora = String(agora.getHours()).padStart(2, '0');
            const minuto = String(agora.getMinutes()).padStart(2, '0');
            
            if (!historicoConversas[contatoAtivo]) {
                historicoConversas[contatoAtivo] = [];
            }
            
            historicoConversas[contatoAtivo].push({
                tipo: "sent",
                texto: texto,
                hora: `${hora}:${minuto}`
            });

            carregarMensagens(contatoAtivo);
            chatInput.value = ""; 
            chatInput.focus();
        }
    }

    // ==========================================
    // EXECUÇÃO DO CHAT (SÓ TRAVAMOS OS EVENTOS SE OS BOTÕES EXISTIREM)
    // ==========================================
    if (sendBtn && chatInput) {
        sendBtn.addEventListener("click", (e) => {
            e.preventDefault();
            enviarMensagem();
        });

        chatInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                enviarMensagem();
            }
        });
    }

    if (contatos.length > 0) {
        contatos.forEach(contato => {
            contato.addEventListener("click", () => {
                contatos.forEach(c => c.classList.remove("active"));
                contato.classList.add("active");
                
                const nome = contato.querySelector("strong").innerText.trim();
                const fotoSrc = contato.querySelector(".avatar-img").src;
                const sobreText = contato.querySelector(".sub-text").innerText;
                
                if (chatHeader) {
                    chatHeader.innerHTML = `
                        <img src="${fotoSrc}" class="avatar-img" alt="${nome}">
                        <div class="header-text"><strong>${nome}</strong><p>${sobreText}</p></div>
                    `;
                }
                carregarMensagens(nome);
            });
        });
    }

    function carregarContatosDinamicos() {
        if (!contactList) return;

        const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || {};
        if (usuarioLogado.perfil !== "doar") return;

        const candidaturas = JSON.parse(localStorage.getItem("candidaturas")) || [];
        const candidaturasDoDoador = candidaturas.filter(c => c.doadorId === usuarioLogado.id);
        if (!candidaturasDoDoador.length) return;

        candidaturasDoDoador.forEach(candidatura => {
            const existeContato = Array.from(contactList.querySelectorAll(".contact strong")).some(
                (el) => el.innerText.trim() === candidatura.candidatoName
            );

            if (existeContato) return;

            const contato = document.createElement("div");
            contato.className = "contact";
            contato.innerHTML = `
                <img src="${candidatura.candidatoFoto || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop"}" class="avatar-img" alt="${candidatura.candidatoName}">
                <div class="contact-info">
                    <div class="name-time"><strong>${candidatura.candidatoName}</strong></div>
                    <p class="sub-text">Sobre: ${candidatura.petName}</p>
                    <p class="last-msg">Nova candidatura recebida</p>
                </div>
            `;

            contactList.prepend(contato);
            historicoConversas[candidatura.candidatoName] = historicoConversas[candidatura.candidatoName] || [];
            historicoConversas[candidatura.candidatoName].unshift({
                tipo: "received",
                texto: candidatura.mensagem,
                hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
        });
    }

    if (searchInput && contatos.length > 0) {
        searchInput.addEventListener("input", (e) => {
            const termoBusca = e.target.value.toLowerCase();
            contatos.forEach(contato => {
                const nomeContato = contato.querySelector("strong").innerText.toLowerCase();
                contato.style.display = nomeContato.includes(termoBusca) ? "flex" : "none";
            });
        });
    }

    // ==========================================
    // EXECUÇÃO DOS FAVORITOS (SÓ RODA SE OS CORAÇÕES EXISTIREM)
    // ==========================================
    const hearts = document.querySelectorAll(".heart-icon");
    
    if (hearts.length > 0) {
        hearts.forEach(coracao => {
            coracao.style.cursor = "pointer"; // Adiciona a mãozinha do mouse ao passar por cima
            coracao.addEventListener("click", () => {
                const cardPet = coracao.closest(".card"); 
                if (cardPet) {
                    cardPet.style.transition = "all 0.4s ease";
                    cardPet.style.opacity = "0";
                    cardPet.style.transform = "scale(0.8)";
                    
                    setTimeout(() => {
                        cardPet.remove();
                        const grid = document.querySelector(".favorites-grid");
                        if (grid && grid.querySelectorAll(".card").length === 0) {
                            grid.innerHTML = `<p class="subtitle" style="grid-column: 1/-1; text-align: center;">Sua lista está vazia. Explore novos pets!</p>`;
                        }
                    }, 400);
                }
            });
        });
    }
});
