import Menu from "../components/Menu";
import Titulo from "../components/Titulo";
import RegisterForm from "../components/RegisterForm";
import { checkAuth } from "../utils/auth";
import { useEffect, useState } from 'react';
import "../styles/FormFooter.css"

function Registro() {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    
        useEffect(() => {
            async function authenticate() {
                const auth = await checkAuth();
                if (!auth.success) {
                    setIsAuthenticated(false);
                } else {
                    window.location.href = '/home';
                }
            }
            authenticate();
        }, []);
  return (
    <>
        <Menu showLinks={false} />
        {
            !isAuthenticated && (
                <div className="container">
                    <Titulo texto="Cadastro de Usuário" />
                    <RegisterForm />
                    <div className="form-footer">
                        <p>Já possui uma conta? <a href="/login">Faça o login aqui</a></p>
                    </div>
                </div>
            )
        } 
    </> 
  );
}

export default Registro;