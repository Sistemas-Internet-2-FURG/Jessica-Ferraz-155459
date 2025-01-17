document.addEventListener('DOMContentLoaded', () => {
    const consultaId = new URLSearchParams(window.location.search).get('id');
    const token = localStorage.getItem('access_token');

    if (!token) {
        alert('Você precisa estar logado para acessar!');
        window.location.href = './login.html';
        return;
    }

    carregarDetalhesConsulta(consultaId);

    const form = document.querySelector('#editarConsultaForm');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        editarConsulta(consultaId);
    });
});

async function carregarDetalhesConsulta(consultaId) {
    const pacienteSelect = document.querySelector('#paciente_id');
    const medicoSelect = document.querySelector('#medico_id');
    const dataInput = document.querySelector('#data');
    const motivoInput = document.querySelector('#motivo');
    const token = localStorage.getItem('access_token');

    try {
        // Carrega os detalhes da consulta
        const response = await fetch(`http://localhost:5000/consultas/${consultaId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const consulta = data.consulta;

            const dataFormatada = formatarData(consulta.data);

            dataInput.value = dataFormatada;

            motivoInput.value = consulta.motivo;

            carregarPacientes(pacienteSelect);
            carregarMedicos(medicoSelect);

            pacienteSelect.value = consulta.paciente_id;
            medicoSelect.value = consulta.medico_id;
        } else if (response.status == 401) {
            alert('Login expirado, faça o login noavamente');
            window.location.href = './login.html';
            return;
        }
    } catch (error) {
        alert('Erro ao carregar detalhes da consulta.');
        window.location.reload();
    }
}

function formatarData(data) {
    const [dataParte, horaParte] = data.split(' ');
    const [dia, mes, ano] = dataParte.split('/');
    return `${ano}-${mes}-${dia}T${horaParte}`;
}


async function carregarPacientes(pacienteSelect) {
    const token = localStorage.getItem('access_token');
    try {
        const response = await fetch('http://localhost:5000/pacientes', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            data.pacientes.forEach(paciente => {
                const option = document.createElement('option');
                option.value = paciente.id;
                option.textContent = paciente.nome;
                pacienteSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar pacientes:', error);
    }
}

async function carregarMedicos(medicoSelect) {
    const token = localStorage.getItem('access_token');
    try {
        const response = await fetch('http://localhost:5000/medicos', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            data.medicos.forEach(medico => {
                const option = document.createElement('option');
                option.value = medico.id;
                option.textContent = medico.nome;
                medicoSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar médicos:', error);
    }
}

async function editarConsulta(consultaId) {
    const pacienteId = document.querySelector('#paciente_id').value;
    const medicoId = document.querySelector('#medico_id').value;
    const data = document.querySelector('#data').value;
    const motivo = document.querySelector('#motivo').value;

    const token = localStorage.getItem('access_token');

    try {
        const response = await fetch(`http://localhost:5000/consultas/${consultaId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                paciente_id: pacienteId,
                medico_id: medicoId,
                data: data,
                motivo: motivo
            })
        });

        if (response.ok) {
            alert('Consulta atualizada com sucesso!');
            window.location.href = './lista_consultas.html';
        } else if (response.status == 401) {
            alert('Login expirado, faça o login noavamente');
            window.location.href = './login.html';
            return;
        }
    } catch (error) {
        alert('Erro ao editar consulta.');
    }
}
