import { useState, useEffect } from "react";
import { checkAuth } from "../utils/auth";
import Menu from "../components/Menu";
import Titulo from "../components/Titulo";
import ConsultaForm from "../components/ConsultaForm";

function NovaConsulta() {
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
          <Titulo texto="Nova Consulta" />
          <ConsultaForm />
        </div>
      )}
    </>
  );
}

export default NovaConsulta;
