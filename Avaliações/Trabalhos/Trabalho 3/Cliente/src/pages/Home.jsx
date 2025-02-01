import Menu from '../components/Menu';
import { checkAuth } from "../utils/auth";
import { useEffect } from 'react';

function Home() {

    useEffect(() => {
        async function authenticate() {
            const auth = await checkAuth();
            if (auth.status == 401) {
                alert('Você precisa estar logado para acessar.')
                window.location.href = '/login';
            }
        }
        authenticate();
    }, []);
    return (
        <Menu />
    );
}

export default Home;
