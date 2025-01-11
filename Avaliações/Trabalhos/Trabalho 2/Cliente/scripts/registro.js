document.getElementById('register-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const formData = {
        username: username,
        password: password
    };

    try {
        const response = await fetch('http://localhost:5000/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            window.location.href = 'login.html';
        } else {
            alert('Erro ao registrar. Por favor, tente novamente.');
            window.location.reload();
        }
    } catch (error) {
        alert('Erro de conexão. Por favor, tente novamente.');
        window.location.reload();
    }
});