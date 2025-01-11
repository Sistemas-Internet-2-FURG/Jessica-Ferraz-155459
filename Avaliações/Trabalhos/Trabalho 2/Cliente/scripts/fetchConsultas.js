async function fetchConsultas() {
    try {
        const token = localStorage.getItem('access_token'); // Recupera o token do localStorage

        if (!token) {
            // Se não tiver token, direciona para a página de login
            window.location.href = './login.html';
            alert('Você precisa estar logado para acessar!');
            return;
        }

        // Envia a requisição GET para verificar se o token é válido
        const response = await fetch('http://localhost:5000/consultas', {
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
        const listaConsultas = document.querySelector('.lista');
        listaConsultas.innerHTML = ''; // Limpa a lista antes de adicionar os itens

        // Verifica se há consultas para listar
        if (data.consultas.length === 0) {
            listaConsultas.innerHTML = '<p>Nenhuma consulta encontrada.</p>';
            return;
        }

        // Adiciona consultas na lista
        data.consultas.forEach(consulta => {  // Corrigido para 'data.consultas'
            const li = document.createElement('li');
            li.className = 'item';
            const link = document.createElement('a');
            link.href = `detalhes_consulta.html?id=${consulta.id}`;
            link.textContent = `${consulta.paciente} - ${consulta.medico}`;  // Exibindo o nome do paciente e médico
            li.appendChild(link);
            listaConsultas.appendChild(li);
        });
    } catch (error) {
        console.error(error);
        document.querySelector('.lista').innerHTML = '<p>Erro ao carregar consultas.</p>';
    }
}

window.onload = fetchConsultas;

