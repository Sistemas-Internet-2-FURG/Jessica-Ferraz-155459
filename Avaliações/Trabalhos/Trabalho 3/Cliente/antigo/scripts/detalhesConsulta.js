document.addEventListener('DOMContentLoaded', () => {
    const consultaId = new URLSearchParams(window.location.search).get('id');
    const token = localStorage.getItem('access_token');

    if (!token) {
        alert('Você precisa estar logado para acessar!');
        window.location.href = './login.html';
        return;
    }

    carregarDetalhesConsulta(consultaId);

    const editarLink = document.querySelector('#editar-consulta');
    editarLink.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = `./editar_consulta.html?id=${consultaId}`;
    });

    const deletarButton = document.querySelector('#deletar-consulta');
    deletarButton.addEventListener('click', () => {
        deletarConsulta(consultaId);
    });
});

async function carregarDetalhesConsulta(consultaId) {
    const detalhesContainer = document.querySelector('#consulta-details');
    const token = localStorage.getItem('access_token');

    try {
        const response = await fetch(`http://localhost:5000/consultas/${consultaId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const consulta = data.consulta;

            detalhesContainer.innerHTML = `
                <p><label>Paciente:</label> ${consulta.paciente.nome}</p>
                <p><label>Médico:</label> ${consulta.medico.nome}</p>
                <p><label>Data:</label> ${consulta.data.split(" ")[0]}</p>
                <p><label>Hora:</label> ${consulta.data.split(" ")[1]}</p>
                <p><label>Motivo:</label> ${consulta.motivo}</p>
            `;
        } else if (response.status == 401) {
            alert('Login expirado, faça o login noavamente');
            window.location.href = './login.html';
            return;
        }
    } catch (error) {
        alert('Erro ao carregar detalhes da consulta.');
    }
}

async function deletarConsulta(consultaId) {
    const token = localStorage.getItem('access_token');

    if (!token) {
        alert('Você precisa estar logado para acessar!');
        window.location.href = './login.html';
        return;
    }

    const confirmDelete = confirm('Tem certeza que deseja excluir esta consulta?');
    if (!confirmDelete) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/consultas/${consultaId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert('Consulta excluída com sucesso!');
            window.location.href = './lista_consultas.html';
        } else if (response.status == 401) {
            alert('Login expirado, faça o login noavamente');
            window.location.href = './login.html';
            return;
        }
    } catch (error) {
        alert('Erro ao deletar consulta.');
    }
}
