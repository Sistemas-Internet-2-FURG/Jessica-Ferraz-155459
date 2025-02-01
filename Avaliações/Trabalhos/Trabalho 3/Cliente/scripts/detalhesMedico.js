document.addEventListener('DOMContentLoaded', () => {
    const medicoId = new URLSearchParams(window.location.search).get('id');
    const token = localStorage.getItem('access_token');

    if (!token) {
        alert('Você precisa estar logado para acessar!');
        window.location.href = './login.html';
        return;
    }

    carregarDetalhesMedico(medicoId);

    const editarLink = document.querySelector('#editar-medico');
    editarLink.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = `./editar_medico.html?id=${medicoId}`;
    });

    const deletarButton = document.querySelector('#deletar-medico');
    deletarButton.addEventListener('click', () => {
        deletarMedico(medicoId);
    });
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
        } else if (response.status == 401) {
            alert('Login expirado, faça o login noavamente');
            window.location.href = './login.html';
            return;
        }
    } catch (error) {
        alert('Erro ao carregar detalhes do médico.');
    }
}

async function deletarMedico(medicoId) {
    const token = localStorage.getItem('access_token');

    if (!token) {
        alert('Você precisa estar logado para acessar!');
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
        } else if (response.status == 401) {
            alert('Login expirado, faça o login noavamente');
            window.location.href = './login.html';
            return;
        }
    } catch (error) {
        alert('Erro ao deletar médico.');
    }
}

