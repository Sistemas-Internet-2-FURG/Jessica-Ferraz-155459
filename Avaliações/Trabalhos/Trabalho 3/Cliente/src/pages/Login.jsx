import Menu from "../components/Menu";
import Titulo from "../components/Titulo";
import LoginForm from "../components/LoginForm";
import { checkAuth } from "../utils/auth";
import { useEffect, useState } from 'react';

function Login() {
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
                    <Titulo texto="Login" />
                    <LoginForm />
                    <p>Não possui conta? <a href="/registro">Faça o seu cadastro aqui</a></p>
                </div>
            )
        } 
    </> 
  );
}

export default Login;

