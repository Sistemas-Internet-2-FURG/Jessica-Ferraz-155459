import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import { checkAuth } from "../utils/auth";
import Titulo from "../components/Titulo";
import Detalhes from "../components/Detalhes";

function DetalhesMedico() {
  const medicoId = new URLSearchParams(window.location.search).get("id");
  const [medico, setMedico] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function authenticate() {
      const auth = await checkAuth();
      if (auth.status === 401) {
        alert("Você precisa estar logado para acessar.");
        navigate("/login");
      } else if (!auth.success) {
        alert("Erro ao carregar.");
        window.location.reload();
      }
    }
    authenticate();
  }, [navigate]);

  useEffect(() => {
    async function carregarDetalhesMedico() {
      const token = localStorage.getItem("access_token");

      if (!token) {
        alert("Você precisa estar logado para acessar!");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/medicos/${medicoId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMedico(data.medico);
        } else if (response.status === 401) {
          alert("Login expirado, faça o login novamente");
          navigate("/login");
        } else {
          alert("Erro ao carregar detalhes do médico.");
        }
      } catch {
        alert("Erro ao carregar detalhes do médico.");
      }
    }
    carregarDetalhesMedico();
  }, [medicoId, navigate]);

  function handleEdit() {
    window.location.href = `./editar?id=${medicoId}`;
  }

  async function handleDelete() {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Você precisa estar logado para acessar!");
      navigate("/login");
      return;
    }

    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir este médico? Se existirem consultas com esse médico, elas também serão excluídas."
    );

    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:5000/medicos/${medicoId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          alert("Médico excluído com sucesso!");
          navigate("/medicos");
        } else if (response.status === 401) {
          alert("Login expirado, faça o login novamente");
          navigate("/login");
        } else {
          alert("Erro ao deletar médico.");
        }
      } catch {
        alert("Erro ao deletar médico.");
      }
    }
  }

  const detalhes = medico ? [
    { label: "Especialidade", valor: medico.especialidade },
    { label: "CRM", valor: medico.crm },
  ] : [];

  return (
    <>
      <Menu />
      <Titulo texto="Detalhes do Médico" />
      {medico && (
        <Detalhes
          titulo={medico.nome}
          detalhes={detalhes}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}

export default DetalhesMedico;
