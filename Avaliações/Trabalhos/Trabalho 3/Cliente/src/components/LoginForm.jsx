import Form from "./Form";

function LoginForm() {

    async function logarUsuario(formData) {

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
            }
        } catch {
            alert('Erro de conexão. Por favor, tente novamente.');
            window.location.reload();
        }
    };
    
    const fields = [
        { name: "username", label: "Nome de Usuário", type: "text", required: true },
        { name: "password", label: "Senha", type: "password", required: true }
    ];

    const initialValues = {}

    return <Form onSubmit={logarUsuario} fields={fields} buttonText="Entrar" initialValues={initialValues}/>;
}

export default LoginForm;