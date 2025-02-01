async function fetchPacientes() {
    try {
        const token = localStorage.getItem('access_token');

        if (!token) {
            alert('Você precisa estar logado para acessar.')
            window.location.href = './login.html';
            return;
        }

        const response = await fetch('http://localhost:5000/pacientes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        if (response.status == 401) {
            alert('Login expirado, faça o login noavamente');
            window.location.href = './login.html';
            return;
        }
        const data = await response.json();
        const listaPacientes = document.querySelector('.lista');
        listaPacientes.innerHTML = '';

        if (data.pacientes.length === 0) {
            listaPacientes.innerHTML = '<p>Nenhum paciente encontrado.</p>';
            return;
        }

        data.pacientes.forEach(paciente => {
            const li = document.createElement('li');
            li.className = 'item';
            const link = document.createElement('a');
            link.href = `detalhes_paciente.html?id=${paciente.id}`;
            link.textContent = paciente.nome;
            li.appendChild(link);
            listaPacientes.appendChild(li);
        });
    } catch (error) {
        console.error(error);
        document.querySelector('.lista').innerHTML = '<p>Erro ao carregar pacientes.</p>';
    }
}

window.onload = fetchPacientes;
