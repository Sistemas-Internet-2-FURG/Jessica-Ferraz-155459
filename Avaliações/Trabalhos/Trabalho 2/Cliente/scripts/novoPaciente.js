document.addEventListener('DOMContentLoaded', () => {
    const formPaciente = document.querySelector('#formPaciente');
    formPaciente.addEventListener('submit', adicionarPaciente);
});

async function adicionarPaciente(event) {
    event.preventDefault();
    const nome = document.querySelector('#nome').value;
    const dataNascimento = document.querySelector('#dataNascimento').value;
    const endereco = document.querySelector('#endereco').value;
    const telefone = document.querySelector('#telefone').value;
    const token = localStorage.getItem('access_token');

    if (!token) {
        alert('Você precisa estar logado para realizar esta ação.');
        window.location.href = './login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/pacientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nome, data_nascimento: dataNascimento, endereco, telefone })
        });

        if (response.ok) {
            alert('Paciente adicionado com sucesso!');
            window.location.href = './lista_pacientes.html';
        } else {
            const errorData = await response.json();
            alert(`Erro ao adicionar paciente: ${errorData.error || 'Erro desconhecido'} \nDetalhes: ${errorData.details || ''}`);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao adicionar paciente.');
    }
}
