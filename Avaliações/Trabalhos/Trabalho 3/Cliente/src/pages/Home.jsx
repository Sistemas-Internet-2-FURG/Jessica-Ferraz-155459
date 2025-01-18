import Menu from '../components/Menu';
import { checkAuth } from "../utils/auth";
import { useEffect, useState } from 'react';

function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        async function authenticate() {
            const auth = await checkAuth();
            if (auth.success) {
                setIsAuthenticated(true);
            } else {
                window.location.href = '/login';
            }
        }
        authenticate();
    }, []);
    return (
        <>
            {!isAuthenticated && <Menu showLinks={false}/>}
            {isAuthenticated && <Menu />}
        </>
    );
}

export default Home;
