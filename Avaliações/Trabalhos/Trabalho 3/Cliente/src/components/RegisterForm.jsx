import Form from "./Form";

function RegisterForm() {

    async function cadastrarUsuario(formData) {

        try {
            const response = await fetch('http://localhost:5000/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            if (response.ok) {
                window.location.href = './login';
            } else if (response.status == 400) {
                alert('Nome de usuário já existe. Por favor, escolha outro nome.');
            } else if (response.status == 500) {
                alert('Erro ao registrar o usuário');
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
    return <Form onSubmit={cadastrarUsuario} fields={fields} buttonText="Cadastrar" initialValues={initialValues}/>;
}

export default RegisterForm;