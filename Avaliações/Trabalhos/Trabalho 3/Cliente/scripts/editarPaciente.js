document.addEventListener('DOMContentLoaded', () => {
    const pacienteId = new URLSearchParams(window.location.search).get('id');
    const token = localStorage.getItem('access_token');

    if (!token) {
        alert('Você precisa estar logado para acessar!');
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
        const response = await fetch(`http://localhost:5000/pacientes/${pacienteId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const paciente = data.paciente;

            const dataNascimentoFormatada = formatDate(paciente.data_nascimento);

            nomeInput.value = paciente.nome;
            telefoneInput.value = paciente.telefone;
            enderecoInput.value = paciente.endereco;
            dataNascimentoInput.value = dataNascimentoFormatada;

        } else if (response.status == 401) {
            alert('Login expirado, faça o login noavamente');
            window.location.href = './login.html';
            return;
        }
    } catch (error) {
        alert('Erro ao carregar detalhes do paciente.');
        window.location.reload();
    }
}

function formatDate(date) {
    const parts = date.split('/');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}


async function editarPaciente(pacienteId) {
    const nome = document.querySelector('#nome').value;
    const telefone = document.querySelector('#telefone').value;
    const endereco = document.querySelector('#endereco').value;
    const dataNascimento = document.querySelector('#dataNascimento').value;
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
                data_nascimento: dataNascimento
            })
        });

        if (response.ok) {
            alert('Paciente atualizado com sucesso!');
            window.location.href = './lista_pacientes.html';
        } else if (response.status == 401) {
            alert('Login expirado, faça o login noavamente');
            window.location.href = './login.html';
            return;
        }
    } catch (error) {
        alert('Erro ao editar paciente.');
    }
}
