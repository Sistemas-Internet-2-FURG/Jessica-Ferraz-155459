document.addEventListener('DOMContentLoaded', () => {
    const pacienteId = new URLSearchParams(window.location.search).get('id');
    const token = localStorage.getItem('access_token');

    if (!token) {
        alert('Você precisa estar logado para acessar!');
        window.location.href = './login.html';
        return;
    }

    carregarDetalhesPaciente(pacienteId);

    const editarLink = document.querySelector('#editar-paciente');
    editarLink.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = `./editar_paciente.html?id=${pacienteId}`;
    });

    const deletarButton = document.querySelector('#deletar-paciente');
    deletarButton.addEventListener('click', () => {
        deletarPaciente(pacienteId);
    });
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
        } else if (response.status == 401) {
            alert('Login expirado, faça o login noavamente');
            window.location.href = './login.html';
            return;
        }
    } catch (error) {
        alert('Erro ao carregar detalhes do paciente.');
    }
}

async function deletarPaciente(pacienteId) {
    const token = localStorage.getItem('access_token');

    if (!token) {
        alert('Você precisa estar logado para acessar!');
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
        } else if (response.status == 401) {
            alert('Login expirado, faça o login noavamente');
            window.location.href = './login.html';
            return;
        }
    } catch (error) {
        alert('Erro ao deletar paciente.');
    }
}
