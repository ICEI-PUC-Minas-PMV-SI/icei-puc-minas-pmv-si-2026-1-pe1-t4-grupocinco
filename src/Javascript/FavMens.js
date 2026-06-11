document.addEventListener("DOMContentLoaded", () => {
    // === 1. SELEÇÃO DE ELEMENTOS DO CHAT ===
    const contactList = document.querySelector(".contact-list");
    const chatMessages = document.querySelector(".chat-messages");
    const chatInput = document.querySelector(".chat-input-container input");
    const chatHeader = document.querySelector(".chat-header");
    const searchInput = document.querySelector(".search-box input");
    
    // Atualizado aqui para buscar a classe nova do botão de enviar
    const sendBtn = document.querySelector(".send-btn"); 

    // === 2. BANCO DE DADOS DE CONVERSAS ===
    const historicoConversas = {
        "Ana Almeida": [
            { tipo: "sent", texto: "Olá, estou interessado nesse poodle fofinho.Ela é calma pois tenho um gatinho.", hora: "10:30" },
            { tipo: "received", texto: "Oii,tudo bem?É muito calma sim!! Aceita bem outros animais.", hora: "11:45" }
        ],
        "Marcos Souza": [
            { tipo: "received", texto: "Olá! O Cão Médio ainda está disponível para adoção?", hora: "14:20" }
        ],
        "Ludmilla Lara": [
            { tipo: "received", texto: "Oi! Vi o anúncio do Cão Pequeno. Qual o tamanho exato dele?", hora: "09:15" }
        ],
        "Ricardo Silva": [
            { tipo: "received", texto: "Gostei muito do Bobi! Pode me passar mais informações?", hora: "16:00" }
        ],
        "Beatriz Souza": [
            { tipo: "received", texto: "Olá, a Mel se dá bem com crianças?", hora: "11:02" }
        ],
        "Carlos Mendes": [
            { tipo: "received", texto: "Gostaria de agendar uma visita para conhecer o Thor.", hora: "13:40" }
        ],
        "Fernanda Lima": [
            { tipo: "received", texto: "A Luna já está castrada e vacinada?", hora: "10:10" }
        ],
        "André Santos": [
            { tipo: "received", texto: "Olá! O Max é muito agitado?", hora: "15:30" }
        ],
        "Juliana Paiva": [
            { tipo: "received", texto: "Oi, tenho interesse em adotar a Amora.", hora: "17:15" }
        ],
        "Roberto Dias": [
            { tipo: "received", texto: "Boa tarde, o Fred é dócil?", hora: "12:00" }
        ]
    };

    // === 3. FUNÇÕES AUXILIARES DO CHAT ===

    // Descobre quem é o contato ativo na tela
    function getContatoAtivo() {
        if (!chatHeader) return "Ana Almeida";
        const nomeElemento = chatHeader.querySelector("strong");
        return nomeElemento ? nomeElemento.innerText.trim() : "Ana Almeida";
    }

    // Renderiza o histórico de mensagens salvo na memória
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

    // Processa o envio e salva no histórico do contato correspondente
    function enviarMensagem() {
        if (!chatInput || !chatMessages) return;
        const texto = chatInput.value.trim();
        
        if (texto !== "") {
            const contatoAtivo = getContatoAtivo();
            
            const agora = new Date();
            const hora = String(agora.getHours()).padStart(2, '0');
            const minuto = String(agora.getMinutes()).padStart(2, '0');
            const horarioFormatado = `${hora}:${minuto}`;

            if (!historicoConversas[contatoAtivo]) {
                historicoConversas[contatoAtivo] = [];
            }
            
            // Adiciona no histórico
            historicoConversas[contatoAtivo].push({
                tipo: "sent",
                texto: texto,
                hora: horarioFormatado
            });

            // Atualiza a tela puxando o histórico atualizado
            carregarMensagens(contatoAtivo);
            
            chatInput.value = ""; 
            chatInput.focus();
        }
    }

    // === 4. EVENTOS (CLIQUES E TECLADO) ===

    // Envio pelo botão do aviãozinho
    if (sendBtn) {
        sendBtn.addEventListener("click", (e) => {
            e.preventDefault();
            enviarMensagem();
        });
        sendBtn.style.cursor = "pointer";
    }

    // Envio pela tecla Enter
    if (chatInput) {
        chatInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                enviarMensagem();
            }
        });
    }

    // Troca de Conversa ao clicar no contato lateral
    if (contactList) {
        const contatos = contactList.querySelectorAll(".contact");
        
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

    // Barra de Busca de Conversas
    if (searchInput && contactList) {
        searchInput.addEventListener("input", (e) => {
            const termoBusca = e.target.value.toLowerCase();
            const contatos = contactList.querySelectorAll(".contact");
            
            contatos.forEach(contato => {
                const nomeContato = contato.querySelector("strong").innerText.toLowerCase();
                if (nomeContato.includes(termoBusca)) {
                    contato.style.display = "flex";
                } else {
                    contato.style.display = "none";
                }
            });
        });
    }

    // Lógica da Tela de Favoritos (Remover Card com animação)
    const hearts = document.querySelectorAll(".heart-icon");
    hearts.forEach(coracao => {
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
});


