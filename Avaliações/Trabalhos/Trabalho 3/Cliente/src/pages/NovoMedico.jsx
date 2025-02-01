import Menu from "../components/Menu";
import Titulo from "../components/Titulo";
import { checkAuth } from "../utils/auth";
import { useEffect, useState } from "react";
import MedicoForm from "../components/MedicoForm";

function NovoMedico() {
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

    return (
        <>
            <Menu />
            {isAuthenticated && (
                <div className="container">
                    <Titulo texto="Adicionar Médico" />
                    <MedicoForm />
                </div>
            )}
        </>
    );
}

export default NovoMedico;