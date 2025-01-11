document.addEventListener('DOMContentLoaded', () => {
    const pacienteId = new URLSearchParams(window.location.search).get('id');
    const token = localStorage.getItem('access_token');

    if (!token) {
        alert('Você precisa estar logado para acessar os detalhes.');
        window.location.href = './login.html';
        return;
    }

    carregarDetalhesPaciente(pacienteId);

    // Verificando se o botão de editar existe antes de adicionar o eventListener
    const editarLink = document.querySelector('#editar-paciente');
    if (editarLink) {
        editarLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = `./editar_paciente.html?id=${pacienteId}`;
        });
    } else {
        console.error('Botão de editar não encontrado!');
    }

    // Verificando se o botão de deletar existe antes de adicionar o eventListener
    const deletarButton = document.querySelector('#deletar-paciente');
    if (deletarButton) {
        deletarButton.addEventListener('click', () => {
            deletarPaciente(pacienteId);
        });
    } else {
        console.error('Botão de deletar não encontrado!');
    }
});

async function carregarDetalhesPaciente(pacienteId) {
    const detalhesContainer = document.querySelector('#paciente-details');
    const token = localStorage.getItem('access_token');

    try {
        const response = await fetch(`http://localhost:5000/pacientes/${pacienteId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const paciente = data.paciente;

            detalhesContainer.innerHTML = `
                <p><label>Nome:</label> ${paciente.nome}</p>
                <p><label>Data de nascimento:</label> ${paciente.data_nascimento}</p>
                <p><label>Endereço:</label> ${paciente.endereco}</p>
                <p><label>Telefone:</label> ${paciente.telefone}</p>
            `;
        } else {
            const errorData = await response.json();
            alert(`Erro ao carregar detalhes: ${errorData.error || 'Erro desconhecido'}`);
        }
    } catch (error) {
        console.error('Erro ao carregar detalhes do paciente:', error);
        alert('Erro ao carregar detalhes do paciente.');
    }
}

async function deletarPaciente(pacienteId) {
    const token = localStorage.getItem('access_token');

    if (!token) {
        alert('Você precisa estar logado para deletar o paciente.');
        window.location.href = './login.html';
        return;
    }

    const confirmDelete = confirm('Tem certeza que deseja excluir este paciente? Se existirem consultas com esse paciente, elas também serão excluídas.');
    if (!confirmDelete) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/pacientes/${pacienteId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert('Paciente excluído com sucesso!');
            window.location.href = './lista_pacientes.html';
        } else {
            const errorData = await response.json();
            alert(`Erro ao deletar paciente: ${errorData.error || 'Erro desconhecido'}`);
        }
    } catch (error) {
        console.error('Erro ao deletar paciente:', error);
        alert('Erro ao deletar paciente.');
    }
}
