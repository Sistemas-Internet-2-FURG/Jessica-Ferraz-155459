import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import Titulo from "../components/Titulo";
import Form from "../components/Form";

function EditarConsulta() {
  const consultaId = new URLSearchParams(window.location.search).get("id");
  const [consulta, setConsulta] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const navigate = useNavigate();

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
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setConsulta({
            paciente_id: data.consulta.paciente.id,
            medico_id: data.consulta.medico.id,
            data: formatarData(data.consulta.data),
            motivo: data.consulta.motivo,
          });

          carregarPacientes();
          carregarMedicos();
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

  async function carregarPacientes() {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch("http://localhost:5000/pacientes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setPacientes(data.pacientes);
      }
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
    }
  }

  async function carregarMedicos() {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch("http://localhost:5000/medicos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setMedicos(data.medicos);
      }
    } catch (error) {
      console.error("Erro ao carregar médicos:", error);
    }
  }

  function formatarData(data) {
    const [dataParte, horaParte] = data.split(" ");
    const [dia, mes, ano] = dataParte.split("/");
    return `${ano}-${mes}-${dia}T${horaParte}`;
  }

  async function editarConsulta(formData) {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`http://localhost:5000/consultas/${consultaId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Consulta atualizada com sucesso!");
        navigate("/consultas");
      } else if (response.status === 401) {
        alert("Login expirado, faça o login novamente");
        navigate("/login");
      } else {
        alert("Erro ao editar consulta.");
      }
    } catch {
      alert("Erro ao editar consulta.");
    }
  }

  return (
    <>
      <Menu />
      <Titulo texto="Editar Consulta" />
      {
        consulta &&(
            <Form
        onSubmit={editarConsulta}
        fields={[
          {
            name: "paciente_id",
            label: "Paciente",
            type: "select",
            options: pacientes.map((paciente) => ({
              value: paciente.id,
              label: paciente.nome,
            })),
            required: true,
          },
          {
            name: "medico_id",
            label: "Médico",
            type: "select",
            options: medicos.map((medico) => ({
              value: medico.id,
              label: medico.nome,
            })),
            required: true,
          },
          {
            name: "data",
            label: "Data",
            type: "datetime-local",
            required: true,
          },
          {
            name: "motivo",
            label: "Motivo",
            type: "text",
            required: true,
          },
        ]}
        initialValues={consulta}
        
        buttonText="Salvar Alterações"
      />
        )
      }
    </>
  );
}

export default EditarConsulta;
