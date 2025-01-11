document.addEventListener('DOMContentLoaded', () => {
    const consultaId = new URLSearchParams(window.location.search).get('id');
    const token = localStorage.getItem('access_token');

    if (!token) {
        alert('Você precisa estar logado para editar a consulta.');
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

            // Converte a data do formato DD/MM/YYYY HH:MM para o formato ISO 8601
            const dataFormatada = formatarData(consulta.data);

            // Preenche o campo de data com o valor formatado
            dataInput.value = dataFormatada;

            motivoInput.value = consulta.motivo;

            // Preenche as opções de paciente e médico
            carregarPacientes(pacienteSelect);
            carregarMedicos(medicoSelect);

            // Seleciona o paciente e médico corretos
            pacienteSelect.value = consulta.paciente_id;
            medicoSelect.value = consulta.medico_id;
        } else {
            const errorData = await response.json();
            alert(`Erro ao carregar detalhes: ${errorData.error || 'Erro desconhecido'}`);
        }
    } catch (error) {
        console.error('Erro ao carregar detalhes da consulta:', error);
        alert('Erro ao carregar detalhes da consulta.');
    }
}

// Função para converter a data de DD/MM/YYYY HH:MM para o formato ISO 8601
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
        } else {
            alert('Erro ao carregar pacientes.');
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
        } else {
            alert('Erro ao carregar médicos.');
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
        } else {
            const errorData = await response.json();
            alert(`Erro ao atualizar consulta: ${errorData.error || 'Erro desconhecido'}`);
        }
    } catch (error) {
        console.error('Erro ao editar consulta:', error);
        alert('Erro ao editar consulta.');
    }
}
