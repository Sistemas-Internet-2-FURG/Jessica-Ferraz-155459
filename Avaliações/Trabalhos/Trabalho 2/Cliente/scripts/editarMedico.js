document.addEventListener('DOMContentLoaded', () => {
    const medicoId = new URLSearchParams(window.location.search).get('id');
    const token = localStorage.getItem('access_token');

    if (!token) {
        alert('Você precisa estar logado para editar a consulta.');
        window.location.href = './login.html';
        return;
    }

    carregarDetalhesMedico(medicoId);

    const form = document.querySelector('#editarMedicoForm');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        editarMedico(medicoId);
    });
});

async function carregarDetalhesMedico(medicoId) {
    const nomeInput = document.querySelector('#nome');
    const especialidadeInput = document.querySelector('#especialidade');
    const crmInput = document.querySelector('#crm');
    const token = localStorage.getItem('access_token');

    try {
        // Carrega os detalhes da consulta
        const response = await fetch(`http://localhost:5000/medicos/${medicoId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const medico = data.medico;

            // Preenche o campo de data com o valor formatado
            nomeInput.value = medico.nome;

            especialidadeInput.value = medico.especialidade;

            crmInput.value = medico.crm;

        } else {
            const errorData = await response.json();
            alert(`Erro ao carregar detalhes: ${errorData.error || 'Erro desconhecido'}`);
        }
    } catch (error) {
        console.error('Erro ao carregar detalhes do médico:', error);
        alert('Erro ao carregar detalhes do médico.');
    }
}

async function editarMedico(medicoId) {
    const nome = document.querySelector('#nome').value;
    const especialidade = document.querySelector('#especialidade').value;
    const crm = document.querySelector('#crm').value;
    const token = localStorage.getItem('access_token');

    try {
        const response = await fetch(`http://localhost:5000/medicos/${medicoId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nome,
                especialidade: especialidade,
                crm: crm
            })
        });

        if (response.ok) {
            alert('Médico atualizado com sucesso!');
            window.location.href = './lista_medicos.html';
        } else {
            const errorData = await response.json();
            alert(`Erro ao atualizar médico: ${errorData.error || 'Erro desconhecido'}`);
        }
    } catch (error) {
        console.error('Erro ao editar médico:', error);
        alert('Erro ao editar médico.');
    }
}