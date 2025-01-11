document.addEventListener('DOMContentLoaded', () => {
    const formPaciente = document.querySelector('#formMedico');
    formPaciente.addEventListener('submit', adicionarMedico);
});

async function adicionarMedico(event) {
    event.preventDefault();
    const nome = document.querySelector('#nome').value;
    const especialidade = document.querySelector('#especialidade').value;
    const crm = document.querySelector('#crm').value;
    const token = localStorage.getItem('access_token');

    if (!token) {
        alert('Você precisa estar logado para realizar esta ação.');
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
        } else {
            const errorData = await response.json();
            alert(`Erro ao adicionar médico: ${errorData.error || 'Erro desconhecido'} \nDetalhes: ${errorData.details || ''}`);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao adicionar médico.');
    }
}
