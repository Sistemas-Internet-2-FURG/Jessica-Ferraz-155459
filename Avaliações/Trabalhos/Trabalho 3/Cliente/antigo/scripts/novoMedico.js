document.addEventListener('DOMContentLoaded', () => {
    const formMedico = document.querySelector('#formMedico');
    formMedico.addEventListener('submit', adicionarMedico);
});

async function adicionarMedico(event) {
    event.preventDefault();
    const nome = document.querySelector('#nome').value;
    const especialidade = document.querySelector('#especialidade').value;
    const crm = document.querySelector('#crm').value;
    const token = localStorage.getItem('access_token');

    if (!token) {
        alert('Você precisa estar logado para acessar.')
        window.location.href = './login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/medicos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nome, especialidade, crm })
        });

        if (response.ok) {
            alert('Médico adicionado com sucesso!');
            window.location.href = './lista_medicos.html';
        } else if (response.status == 401) {
            alert('Login expirado, faça o login noavamente');
            window.location.href = './login.html';
            return;
        }
        else {
            alert(`Erro ao adicionar médico.`);
        }
    } catch (error) {
        alert('Erro ao adicionar médico.');
    }
}
