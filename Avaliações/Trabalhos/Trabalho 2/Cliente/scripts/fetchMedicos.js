async function fetchMedicos() {
    try {
        const token = localStorage.getItem('access_token'); // Recupera o token do localStorage

        if (!token) {
            // Se não tiver token, direciona para a página de login
            window.location.href = './login.html';
            alert('Você precisa estar logado para acessar!');
            return;
        }

        // Envia a requisição GET para verificar se o token é válido
        const response = await fetch('http://localhost:5000/medicos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,  // Envia o token no cabeçalho da requisição
            }
        });

        if (!response.ok) {
            // Se o token for inválido ou expirado
            alert('Você precisa estar logado para acessar!');
            window.location.href = './login.html';
            return;
        }

        const data = await response.json();
        const listaMedicos = document.querySelector('.lista');
        listaMedicos.innerHTML = ''; // Limpa a lista antes de adicionar os itens

        // Verifica se há pacientes para listar
        if (data.medicos.length === 0) {
            listaMedicos.innerHTML = '<p>Nenhum médico encontrado.</p>';
            return;
        }

        // Adiciona pacientes na lista
        data.medicos.forEach(medico => {
            const li = document.createElement('li');
            li.className = 'item';
            const link = document.createElement('a');
            link.href = `detalhes_medico.html?id=${medico.id}`;
            link.textContent =medico.nome;
            li.appendChild(link);
            listaMedicos.appendChild(li);
        });
    } catch (error) {
        console.error(error);
        document.querySelector('.lista').innerHTML = '<p>Erro ao carregar médicos.</p>';
    }
}

window.onload = fetchMedicos;
