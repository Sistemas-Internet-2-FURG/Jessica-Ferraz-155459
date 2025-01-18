import { useEffect, useState } from "react";
import Menu from "../components/Menu";
import { checkAuth } from "../utils/auth";
import Titulo from "../components/Titulo";
import NovoLink from "../components/NovoLink";
import ItemLista from "../components/ItemLista";

function Consultas() {
    const [consultas, setConsultas] = useState([]);

    useEffect(() => {
        async function authenticate() {
            const auth = await checkAuth();
            if (auth.success) {
                fetchConsultas();
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

    async function fetchConsultas() {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                alert('Você precisa estar logado para acessar.');
                window.location.href = '/login';
                return;
            }

            const response = await fetch('http://localhost:5000/consultas', {
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
            if (data.consultas && data.consultas.length > 0) {
                setConsultas(data.consultas);
            }
        } catch {
            alert('Erro ao carregar.');
            window.location.reload();
        }
    }

    return (
        <>
            <Menu />
            <Titulo texto='Consultas' />
            <NovoLink referencia="/consultas/nova" texto="Nova Consulta" />
            <ul>
                {consultas.map(consulta => (
                    <ItemLista key={consulta.id} referencia={`/detalhes_consulta?id=${consulta.id}`} nome={`${consulta.medico} | ${consulta.paciente}`} />
                ))}
            </ul>
        </>
    );
}

export default Consultas;