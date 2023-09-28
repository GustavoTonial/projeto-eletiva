function cadastrar() {
    var email = document.getElementById('email').value;
    var senha = document.getElementById('senha').value;

    // Salvar no Local Storage
    localStorage.setItem('email', email);
    localStorage.setItem('senha', senha);

    alert('Cadastro realizado com sucesso!');
    window.location.href = 'login.html'; // Redirecionar para a página de login
}
