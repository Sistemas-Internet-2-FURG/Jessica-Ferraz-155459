import { useEffect, useState } from "react";
import Menu from "../components/Menu";
import { checkAuth } from "../utils/auth";
import Titulo from "../components/Titulo";
import NovoLink from "../components/NovoLink";
import ItemLista from "../components/ItemLista";

function Medicos() {
    const [medicos, setMedicos] = useState([]);

    useEffect(() => {
        async function authenticate() {
            const auth = await checkAuth();
            if (auth.success) {
                fetchMedicos();
            } else if(auth.status === 401) {
                alert('Você precisa estar logado para acessar.')
                window.location.href = '/login';
            } else {
                alert('Erro ao carregar.');
                window.location.reload();
            }
        }
        authenticate();
    }, []);

    async function fetchMedicos() {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                alert('Você precisa estar logado para acessar.');
                window.location.href = '/login';
                return;
            }

            const response = await fetch('http://localhost:5000/medicos', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.status === 401) {
                alert('Você precisa estar logado para acessar.');
                window.location.href = '/login';
                return;
            }

            const data = await response.json();
            if (data.medicos && data.medicos.length > 0) {
                setMedicos(data.medicos);
            }
        } catch {
            alert('Erro ao carregar.');
            window.location.reload();
        }
    }

    return (
        <>
            <Menu />
            <Titulo texto='Medicos' />
            <NovoLink referencia="/medicos/novo" texto="Novo Médico" />
            <ul>
                {medicos.map(medico => (
                    <ItemLista key={medico.id} referencia={`medicos/detalhes?id=${medico.id}`} nome={medico.nome} />
                ))}
            </ul>
        </>
    );
}

export default Medicos;