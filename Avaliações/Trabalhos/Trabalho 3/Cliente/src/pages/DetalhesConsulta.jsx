import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import { checkAuth } from "../utils/auth";
import Titulo from "../components/Titulo";
import Detalhes from "../components/Detalhes";

function DetalhesConsulta() {
  const consultaId = new URLSearchParams(window.location.search).get("id");
  const [consulta, setConsulta] = useState(null);
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
    async function carregarDetalhesConsulta() {
      const token = localStorage.getItem("access_token");

      if (!token) {
        alert("Você precisa estar logado para acessar!");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/consultas/${consultaId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setConsulta(data.consulta);
        } else if (response.status === 401) {
          alert("Login expirado, faça o login novamente");
          navigate("/login");
        } else {
          alert("Erro ao carregar detalhes da consulta.");
        }
      } catch {
        alert("Erro ao carregar detalhes da consulta.");
      }
    }
    carregarDetalhesConsulta();
  }, [consultaId, navigate]);

  function handleEdit() {
    window.location.href = `./editar?id=${consultaId}`;
  }

  async function handleDelete() {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Você precisa estar logado para acessar!");
      navigate("/login");
      return;
    }

    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir este consulta?"
    );

    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:5000/consultas/${consultaId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          alert("Consulta excluído com sucesso!");
          navigate("/consultas");
        } else if (response.status === 401) {
          alert("Login expirado, faça o login novamente");
          navigate("/login");
        } else {
          alert("Erro ao deletar consulta.");
        }
      } catch {
        alert("Erro ao deletar consulta.");
      }
    }
  }

  const detalhes = consulta ? [
    { label: "Paciente", valor: consulta.paciente.nome },
    { label: "Médico", valor: consulta.medico.nome },
    { label: "Data", valor: consulta.data.split(" ")[0] },
    { label: "Hora", valor: consulta.data.split(" ")[1] },
    { label: "Motivo", valor: consulta.motivo},
  ] : [];

  return (
    <>
      <Menu />
      <Titulo texto="Detalhes da Consulta" />
      {consulta && (
        <Detalhes
          titulo="Consulta"
          detalhes={detalhes}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}

export default DetalhesConsulta;