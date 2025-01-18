import { checkAuth } from "../utils/auth";
import { useEffect } from 'react';
import Menu from '../components/Menu';

function Index() {

    useEffect(() => {
        async function authenticate() {
            const isAuthenticated = await checkAuth();
            if (isAuthenticated.success) {
                window.location.href = '/home';
            } else if(isAuthenticated.status === 500) {
                alert('Erro ao carregar.')
                window.location.reload();
            } else {
                window.location.href = '/login';
            }
        }
        authenticate();
    }, []);
    
    return <Menu showLinks={false} />;
}

export default Index;

