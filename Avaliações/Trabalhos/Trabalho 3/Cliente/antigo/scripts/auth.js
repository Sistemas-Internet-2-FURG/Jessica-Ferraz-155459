document.addEventListener('DOMContentLoaded', verificarAutenticacao);

function verificarAutenticacao() {
    const token = localStorage.getItem('access_token');
    if (!token) {
        alert('Você precisa estar logado para acessar.')
        window.location.href = './login.html';
        return;
    }

    fetch('http://localhost:5000/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })
    .then(response => {
        if (response.status == 401) {
            alert('Login expirado, faça o login noavamente');
            window.location.href = './login.html';
            return;
        }
    })
    .catch(error => {
        alert("Ocorreu um erro.")
        window.location.reload();
    });
}
