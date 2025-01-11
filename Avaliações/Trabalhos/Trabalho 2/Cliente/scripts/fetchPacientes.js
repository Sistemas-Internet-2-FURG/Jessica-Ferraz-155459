async function fetchPacientes() {
    try {
        const token = localStorage.getItem('access_token'); // Recupera o token do localStorage

        if (!token) {
            // Se não tiver token, direciona para a página de login
            window.location.href = './login.html';
            return;
        }

        // Envia a requisição GET para verificar se o token é válido
        const response = await fetch('http://localhost:5000/pacientes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,  // Envia o token no cabeçalho da requisição
            }
        });

        if (!response.ok) {
            // Se o token for inválido ou expirado
            alert('Token inválido ou expirado, redirecionando para o login...');
            window.location.href = './login.html';
            return;
        }

        const data = await response.json();
        const listaPacientes = document.querySelector('.lista');
        listaPacientes.innerHTML = ''; // Limpa a lista antes de adicionar os itens

        // Verifica se há pacientes para listar
        if (data.pacientes.length === 0) {
            listaPacientes.innerHTML = '<p>Nenhum paciente encontrado.</p>';
            return;
        }

        // Adiciona pacientes na lista
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
