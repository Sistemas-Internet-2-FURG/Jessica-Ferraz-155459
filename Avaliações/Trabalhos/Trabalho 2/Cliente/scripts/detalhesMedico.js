document.addEventListener('DOMContentLoaded', () => {
    const medicoId = new URLSearchParams(window.location.search).get('id');
    const token = localStorage.getItem('access_token');

    if (!token) {
        alert('Você precisa estar logado para acessar os detalhes.');
        window.location.href = './login.html';
        return;
    }

    carregarDetalhesMedico(medicoId);

    // Verificando se o botão de editar existe antes de adicionar o eventListener
    const editarLink = document.querySelector('#editar-medico');
    if (editarLink) {
        editarLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = `./editar_medico.html?id=${medicoId}`;
        });
    } else {
        console.error('Botão de editar não encontrado!');
    }

    // Verificando se o botão de deletar existe antes de adicionar o eventListener
    const deletarButton = document.querySelector('#deletar-medico');
    if (deletarButton) {
        deletarButton.addEventListener('click', () => {
            deletarMedico(medicoId);
        });
    } else {
        console.error('Botão de deletar não encontrado!');
    }
});

async function carregarDetalhesMedico(medicoId) {
    const detalhesContainer = document.querySelector('#medico-details');
    const token = localStorage.getItem('access_token');

    try {
        const response = await fetch(`http://localhost:5000/medicos/${medicoId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const medico = data.medico;

            detalhesContainer.innerHTML = `
                <p><label>Nome:</label> ${medico.nome}</p>
                <p><label>Especialidade:</label> ${medico.especialidade}</p>
                <p><label>CRM:</label> ${medico.crm}</p>
            `;
        } else {
            const errorData = await response.json();
            alert(`Erro ao carregar detalhes: ${errorData.error || 'Erro desconhecido'}`);
        }
    } catch (error) {
        console.error('Erro ao carregar detalhes do médico:', error);
        alert('Erro ao carregar detalhes do médico.');
    }
}

async function deletarMedico(medicoId) {
    const token = localStorage.getItem('access_token');

    if (!token) {
        alert('Você precisa estar logado para deletar o médico.');
        window.location.href = './login.html';
        return;
    }

    const confirmDelete = confirm('Tem certeza que deseja excluir este médico? Se existirem consultas com esse médico, elas também serão excluídas.');
    if (!confirmDelete) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/medicos/${medicoId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert('Médico excluído com sucesso!');
            window.location.href = './lista_medicos.html';
        } else {
            const errorData = await response.json();
            alert(`Erro ao deletar médico: ${errorData.error || 'Erro desconhecido'}`);
        }
    } catch (error) {
        console.error('Erro ao deletar médico:', error);
        alert('Erro ao deletar médico.');
    }
}

