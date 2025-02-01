async function fetchMedicos() {
    try {
        const token = localStorage.getItem('access_token'); 

        if (!token) {
            alert('Você precisa estar logado para acessar!');
            window.location.href = './login.html';
            return;
        }

        const response = await fetch('http://localhost:5000/medicos', {
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
        const listaMedicos = document.querySelector('.lista');
        listaMedicos.innerHTML = '';

        if (data.medicos.length === 0) {
            listaMedicos.innerHTML = '<p>Nenhum médico encontrado.</p>';
            return;
        }

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
