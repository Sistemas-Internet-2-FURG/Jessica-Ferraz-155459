document.addEventListener('DOMContentLoaded', () => {
    const formConsulta = document.querySelector('#formConsulta');
    formConsulta.addEventListener('submit', adicionarConsulta);
    
    carregarPacientes();
    carregarMedicos();
});

async function adicionarConsulta(event) {
    event.preventDefault();

    const paciente_id = document.querySelector('#paciente_id').value;
    const medico_id = document.querySelector('#medico_id').value;
    const data = document.querySelector('#data').value;
    const motivo = document.querySelector('#motivo').value;
    const token = localStorage.getItem('access_token');

    if (!token) {
        alert('Você precisa estar logado para realizar esta ação.');
        window.location.href = './login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/consultas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ paciente_id, medico_id, data, motivo })
        });

        if (response.ok) {
            alert('Consulta criada com sucesso!');
            window.location.href = './lista_consultas.html';
        } else {
            const errorData = await response.json();
            alert(`Erro ao criar consulta: ${errorData.error || 'Erro desconhecido'} \nDetalhes: ${errorData.details || ''}`);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao criar consulta.');
    }
}

async function carregarPacientes() {
    const pacienteSelect = document.querySelector('#paciente_id');
    const token = localStorage.getItem('access_token');

    if (!token) {
        alert('Você precisa estar logado para acessar os pacientes.');
        window.location.href = './login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/pacientes', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();

        data.pacientes.forEach(paciente => {
            const option = document.createElement('option');
            option.value = paciente.id;
            option.textContent = paciente.nome;
            pacienteSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar pacientes:', error);
        alert('Erro ao carregar pacientes.');
    }
}

async function carregarMedicos() {
    const medicoSelect = document.querySelector('#medico_id');
    const token = localStorage.getItem('access_token');

    if (!token) {
        alert('Você precisa estar logado para acessar os médicos.');
        window.location.href = './login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/medicos', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();

        data.medicos.forEach(medico => {
            const option = document.createElement('option');
            option.value = medico.id;
            option.textContent = medico.nome;
            medicoSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar médicos:', error);
        alert('Erro ao carregar médicos.');
    }
}
