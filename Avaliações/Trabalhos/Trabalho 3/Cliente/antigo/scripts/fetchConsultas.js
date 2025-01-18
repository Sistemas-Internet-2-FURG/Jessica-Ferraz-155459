async function fetchConsultas() {
    try {
        const token = localStorage.getItem('access_token');

        if (!token) {
            alert('Você precisa estar logado para acessar!');
            window.location.href = './login.html';
            return;
        }

        const response = await fetch('http://localhost:5000/consultas', {
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
        const listaConsultas = document.querySelector('.lista');
        listaConsultas.innerHTML = '';

        if (data.consultas.length === 0) {
            listaConsultas.innerHTML = '<p>Nenhuma consulta encontrada.</p>';
            return;
        }

        data.consultas.forEach(consulta => {
            const li = document.createElement('li');
            li.className = 'item';
            const link = document.createElement('a');
            link.href = `detalhes_consulta.html?id=${consulta.id}`;
            link.textContent = `${consulta.paciente} - ${consulta.medico}`;
            li.appendChild(link);
            listaConsultas.appendChild(li);
        });
    } catch (error) {
        console.error(error);
        document.querySelector('.lista').innerHTML = '<p>Erro ao carregar consultas.</p>';
    }
}

window.onload = fetchConsultas;

