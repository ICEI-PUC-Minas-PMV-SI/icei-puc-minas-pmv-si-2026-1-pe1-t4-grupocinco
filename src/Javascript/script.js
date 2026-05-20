function direcionarUsuario() {
    // Captura o formulário e os campos
    const formulario = document.getElementById('meuForm');
    const opcaoAdotar = document.getElementById('adotar');
    const opcaoDoar = document.getElementById('doar');

    // Verifica se o formulário é válido (checa o 'required' do HTML)
    if (!formulario.checkValidity()) {
        // Se não for válido, dispara os avisos nativos do navegador
        formulario.reportValidity();
        return; // Interrompe a função aqui
    }

    // Se for válido, segue para a lógica de redirecionamento
    if (opcaoAdotar.checked) {
        window.location.href = "adotanteview.html"; 
    } 
    else if (opcaoDoar.checked) {
        window.location.href = "doadorview.html";
    } 
    else {
        // Caso os rádios não tenham 'required' ou falhem por algum motivo
        alert("Por favor, selecione uma opção: Adotar ou Doar.");
    }
}

function previewImages() {
    const previewContainer = document.getElementById('preview-container');
    const files = document.getElementById('petPhotos').files;
    
    // Limpa o container antes de mostrar novas fotos
    previewContainer.innerHTML = '';

    // Verifica se passou de 3 fotos
    if (files.length > 3) {
        alert("Por favor, selecione no máximo 3 fotos.");
        document.getElementById('petPhotos').value = ''; // Reseta o input
        return;
    }

    // Loop pelos arquivos selecionados
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.classList.add('img-preview');
            previewContainer.appendChild(img);
        }

        reader.readAsDataURL(file);
    }
}
