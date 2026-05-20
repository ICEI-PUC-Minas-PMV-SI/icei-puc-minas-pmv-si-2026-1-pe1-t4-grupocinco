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
