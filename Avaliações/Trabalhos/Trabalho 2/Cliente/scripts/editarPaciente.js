document.addEventListener('DOMContentLoaded', () => {
    const pacienteId = new URLSearchParams(window.location.search).get('id');
    const token = localStorage.getItem('access_token');

    if (!token) {
        alert('Você precisa estar logado para editar o paciente.');
        window.location.href = './login.html';
        return;
    }

    carregarDetalhesPaciente(pacienteId);

    const form = document.querySelector('#editarPacienteForm');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        editarPaciente(pacienteId);
    });
});

async function carregarDetalhesPaciente(pacienteId) {
    const nomeInput = document.querySelector('#nome');
    const telefoneInput = document.querySelector('#telefone');
    const enderecoInput = document.querySelector('#endereco');
    const dataNascimentoInput = document.querySelector('#dataNascimento');
    const token = localStorage.getItem('access_token');

    try {
        // Carrega os detalhes do paciente
        const response = await fetch(`http://localhost:5000/pacientes/${pacienteId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const paciente = data.paciente;

            // Converte a data de nascimento para o formato yyyy-mm-dd
            const dataNascimentoFormatada = formatDate(paciente.data_nascimento);

            // Preenche os campos do paciente com os dados
            nomeInput.value = paciente.nome;
            telefoneInput.value = paciente.telefone;
            enderecoInput.value = paciente.endereco;
            dataNascimentoInput.value = dataNascimentoFormatada; // Preenche o campo de data de nascimento

        } else {
            const errorData = await response.json();
            alert(`Erro ao carregar detalhes: ${errorData.error || 'Erro desconhecido'}`);
        }
    } catch (error) {
        console.error('Erro ao carregar detalhes do paciente:', error);
        alert('Erro ao carregar detalhes do paciente.');
    }
}

// Função para formatar a data de dd/mm/yyyy para yyyy-mm-dd
function formatDate(date) {
    const parts = date.split('/');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}


async function editarPaciente(pacienteId) {
    const nome = document.querySelector('#nome').value;
    const telefone = document.querySelector('#telefone').value;
    const endereco = document.querySelector('#endereco').value;
    const dataNascimento = document.querySelector('#dataNascimento').value; // Novo campo
    const token = localStorage.getItem('access_token');

    try {
        const response = await fetch(`http://localhost:5000/pacientes/${pacienteId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nome,
                telefone: telefone,
                endereco: endereco,
                data_nascimento: dataNascimento // Envia a data de nascimento
            })
        });

        if (response.ok) {
            alert('Paciente atualizado com sucesso!');
            window.location.href = './lista_pacientes.html';
        } else {
            const errorData = await response.json();
            alert(`Erro ao atualizar paciente: ${errorData.error || 'Erro desconhecido'}`);
        }
    } catch (error) {
        console.error('Erro ao editar paciente:', error);
        alert('Erro ao editar paciente.');
    }
}
