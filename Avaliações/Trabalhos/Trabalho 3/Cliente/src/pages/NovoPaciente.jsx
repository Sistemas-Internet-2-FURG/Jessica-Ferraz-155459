import Menu from "../components/Menu";
import Titulo from "../components/Titulo";
import { checkAuth } from "../utils/auth";
import { useEffect, useState } from "react";
import PacienteForm from "../components/PacienteForm";

function NovoPaciente() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        async function authenticate() {
            const auth = await checkAuth();
            if (auth.success) {
                setIsAuthenticated(true);
            } else if (auth.status === 401) {
                alert("Você precisa estar logado para acessar.");
                window.location.href = "/login";
            } else {
                alert("Erro ao carregar.");
                window.location.reload();
            }
        }
        authenticate();
    }, []);

    async function adicionarPaciente(formData) {
        const token = localStorage.getItem("access_token");

        if (!token) {
            alert("Você precisa estar logado para acessar.");
            window.location.href = "/login";
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/pacientes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nome: formData.nome,
                    data_nascimento: formData.dataNascimento,
                    endereco: formData.endereco,
                    telefone: formData.telefone,
                }),
            });

            if (response.ok) {
                alert("Paciente adicionado com sucesso!");
                window.location.href = "/pacientes";
            } else if (response.status === 401) {
                alert("Login expirado, faça o login novamente");
                window.location.href = "/login";
            } else {
                alert("Erro ao adicionar paciente.");
            }
        } catch {
            alert("Erro de conexão. Por favor, tente novamente.");
            window.location.reload();
        }
    }

    return (
        <>
            <Menu />
            {isAuthenticated && (
                <div className="container">
                    <Titulo texto="Adicionar Paciente" />
                    <PacienteForm onSubmit={adicionarPaciente} buttonText="Adicionar"/>
                </div>
            )}
        </>
    );
}

export default NovoPaciente;