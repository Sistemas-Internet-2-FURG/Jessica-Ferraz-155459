import { useState, useEffect } from "react";
import Form from "../components/Form";

function ConsultaForm() {
    const [pacientes, setPacientes] = useState([]);
    const [medicos, setMedicos] = useState([]);

    useEffect(() => {
        carregarPacientes();
        carregarMedicos();
    }, []);

    async function carregarPacientes() {
        const token = localStorage.getItem('access_token');
    
        try {
            const response = await fetch('http://localhost:5000/pacientes', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            setPacientes(data.pacientes);
        } catch {
            alert("Erro de conexão. Por favor, tente novamente.")
            window.location.reload();
        }
    }

  async function carregarMedicos() {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch("http://localhost:5000/medicos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setMedicos(data.medicos);
    } catch {
        alert("Erro de conexão. Por favor, tente novamente.")
        window.location.reload();
    }
  }

  async function adicionarConsulta(formData) {
    const { paciente_id, medico_id, data, motivo } = formData;
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Você precisa estar logado para acessar.");
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/consultas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paciente_id, medico_id, data, motivo }),
      });

      if (response.ok) {
        alert("Consulta criada com sucesso!");
        window.location.href = "/consultas";
      } else if (response.status === 401) {
        alert("Login expirado, faça o login novamente");
        window.location.href = "/login";
      } else {
        alert("Erro ao adicionar consulta.");
      }
    } catch {
      alert("Erro ao criar consulta.");
    }
  }

  const fields = [
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
    { name: "data", label: "Data", type: "datetime-local", required: true },
    { name: "motivo", label: "Motivo", type: "text", required: true },
  ];

  return <Form onSubmit={adicionarConsulta} fields={fields} buttonText="Adicionar" />;
}

export default ConsultaForm;