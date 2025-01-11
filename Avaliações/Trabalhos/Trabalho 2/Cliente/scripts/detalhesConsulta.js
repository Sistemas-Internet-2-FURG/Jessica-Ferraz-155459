document.addEventListener('DOMContentLoaded', () => {
    const consultaId = new URLSearchParams(window.location.search).get('id');
    const token = localStorage.getItem('access_token');

    if (!token) {
        alert('Você precisa estar logado para acessar os detalhes.');
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
    if (deletarButton) {
        deletarButton.addEventListener('click', () => {
            deletarConsulta(consultaId);
        });
    } else {
        console.error('Botão de deletar não encontrado!');
    }
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
        } else {
            const errorData = await response.json();
            alert(`Erro ao carregar detalhes: ${errorData.error || 'Erro desconhecido'}`);
        }
    } catch (error) {
        console.error('Erro ao carregar detalhes da consulta:', error);
        alert('Erro ao carregar detalhes da consulta.');
    }
}

async function deletarConsulta(consultaId) {
    const token = localStorage.getItem('access_token');

    if (!token) {
        alert('Você precisa estar logado para deletar a consulta.');
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
        } else {
            const errorData = await response.json();
            alert(`Erro ao deletar consulta: ${errorData.error || 'Erro desconhecido'}`);
        }
    } catch (error) {
        console.error('Erro ao deletar consulta:', error);
        alert('Erro ao deletar consulta.');
    }
}
