import Form from "../components/Form";

function MedicoForm() {

    async function adicionarMedico(formData) {
        const token = localStorage.getItem("access_token");

        if (!token) {
            alert("Você precisa estar logado para acessar.");
            window.location.href = "/login";
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/medicos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nome: formData.nome,
                    especialidade: formData.especialidade,
                    crm: formData.crm,
                }),
            });

            if (response.ok) {
                alert("Médico adicionado com sucesso!");
                window.location.href = "/medicos";
            } else if (response.status === 401) {
                alert("Login expirado, faça o login novamente");
                window.location.href = "/login";
            } else {
                alert("Erro ao adicionar médico.");
            }
        } catch {
            alert("Erro de conexão. Por favor, tente novamente.");
            window.location.reload();
        }
    }

    const fields = [
        { name: "nome", label: "Nome", type: "text", required: true },
        { name: "especialidade", label: "Especialidade", type: "text", required: true },
        { name: "crm", label: "CRM", type: "text", required: true },
    ];

    return <Form onSubmit={adicionarMedico} fields={fields} buttonText="Adicionar" />;
}

export default MedicoForm;