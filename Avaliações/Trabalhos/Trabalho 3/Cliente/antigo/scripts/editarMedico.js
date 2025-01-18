document.addEventListener('DOMContentLoaded', () => {
    const medicoId = new URLSearchParams(window.location.search).get('id');
    const token = localStorage.getItem('access_token');

    if (!token) {
        alert('Você precisa estar logado para acessar!');
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
        const response = await fetch(`http://localhost:5000/medicos/${medicoId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const medico = data.medico;

            nomeInput.value = medico.nome;

            especialidadeInput.value = medico.especialidade;

            crmInput.value = medico.crm;

        } else if (response.status == 401) {
            alert('Login expirado, faça o login noavamente');
            window.location.href = './login.html';
            return;
        }
    } catch (error) {
        alert('Erro ao carregar detalhes do médico.');
        window.location.reload();
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
        } else if (response.status == 401) {
            alert('Login expirado, faça o login noavamente');
            window.location.href = './login.html';
            return;
        }
    } catch (error) {
        alert('Erro ao editar médico.');
    }
}