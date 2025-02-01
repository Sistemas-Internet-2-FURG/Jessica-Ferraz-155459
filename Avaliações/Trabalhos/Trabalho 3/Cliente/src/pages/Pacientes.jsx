import { useEffect, useState } from "react";
import Menu from "../components/Menu";
import { checkAuth } from "../utils/auth";
import Titulo from "../components/Titulo";
import NovoLink from "../components/NovoLink";
import ItemLista from "../components/ItemLista";

function Pacientes() {
    const [pacientes, setPacientes] = useState([]);

    useEffect(() => {
        async function authenticate() {
            const auth = await checkAuth();
            if (auth.success) {
                fetchPacientes();
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

    async function fetchPacientes() {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                alert('Você precisa estar logado para acessar.');
                window.location.href = '/login';
                return;
            }

            const response = await fetch('http://localhost:5000/pacientes', {
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
            if (data.pacientes && data.pacientes.length > 0) {
                setPacientes(data.pacientes);
            }
        } catch {
            alert('Erro ao carregar.');
            window.location.reload();
        }
    }

    return (
        <>
            <Menu />
            <Titulo texto='Pacientes' />
            <NovoLink referencia="/pacientes/novo" texto="Novo Paciente" />
            <ul>
                {pacientes.map(paciente => (
                    <ItemLista key={paciente.id} referencia={`pacientes/detalhes?id=${paciente.id}`} nome={paciente.nome} />
                ))}
            </ul>
        </>
    );
}

export default Pacientes;