import { useState } from "react";

function LoginForm() {

    async function logarUsuario(event) {

        event.preventDefault();

        const formData = {
            username: username,
            password: password
        };

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.access_token) {
                    localStorage.setItem('access_token', data.access_token);
                }
                window.location.href = '/home';
            } else if (response.status === 401) {
                alert('Usuário ou senha incorretos. Por favor, tente novamente.');
                setUsername('');
                setPassword('');
            }
        } catch {
            alert('Erro ao realizar o login. Por favor, tente novamente.');
            window.location.reload();
        }
    };
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <form onSubmit={logarUsuario}>
            <div>
                <label htmlFor="username">Nome de Usuário</label>
                <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div>
                <label htmlFor="password">Senha</label>
                <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
            </div>
            <button type="submit">Entrar</button>
        </form>
    )
}

export default LoginForm;