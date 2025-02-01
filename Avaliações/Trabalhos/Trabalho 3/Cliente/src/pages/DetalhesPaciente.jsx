import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import { checkAuth } from "../utils/auth";
import Titulo from "../components/Titulo";
import Detalhes from "../components/Detalhes";

function DetalhesPaciente() {
  const pacienteId = new URLSearchParams(window.location.search).get("id");
  const [paciente, setPaciente] = useState(null);
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
    async function carregarDetalhesPaciente() {
      const token = localStorage.getItem("access_token");

      if (!token) {
        alert("Você precisa estar logado para acessar!");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/pacientes/${pacienteId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPaciente(data.paciente);
        } else if (response.status === 401) {
          alert("Login expirado, faça o login novamente");
          navigate("/login");
        } else {
          alert("Erro ao carregar detalhes do paciente.");
        }
      } catch {
        alert("Erro ao carregar detalhes do paciente.");
      }
    }
    carregarDetalhesPaciente();
  }, [pacienteId, navigate]);

  function handleEdit() {
    window.location.href = `./editar?id=${pacienteId}`;
  }

  async function handleDelete() {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Você precisa estar logado para acessar!");
      navigate("/login");
      return;
    }

    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir este paciente? Se existirem consultas com esse paciente, elas também serão excluídas."
    );

    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:5000/pacientes/${pacienteId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          alert("Paciente excluído com sucesso!");
          navigate("/pacientes");
        } else if (response.status === 401) {
          alert("Login expirado, faça o login novamente");
          navigate("/login");
        } else {
          alert("Erro ao deletar paciente.");
        }
      } catch {
        alert("Erro ao deletar paciente.");
      }
    }
  }

  const detalhes = paciente ? [
    { label: "Data de nascimento", valor: paciente.data_nascimento },
    { label: "Endereço", valor: paciente.endereco },
    { label: "Telefone", valor: paciente.telefone },
  ] : [];

  return (
    <>
      <Menu />
      <Titulo texto="Detalhes do Paciente" />
      {paciente && (
        <Detalhes
          titulo={paciente.nome}
          detalhes={detalhes}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}

export default DetalhesPaciente;
