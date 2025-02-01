import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import Titulo from "../components/Titulo";
import Form from "../components/Form";

function EditarPaciente() {
  const pacienteId = new URLSearchParams(window.location.search).get("id");
  const [paciente, setPaciente] = useState(null);
  const navigate = useNavigate();

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
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setPaciente({
            nome: data.paciente.nome,
            telefone: data.paciente.telefone,
            endereco: data.paciente.endereco,
            data_nascimento: formatDate(data.paciente.data_nascimento),
          });
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

  function formatDate(date) {
    const parts = date.split("/");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  async function editarPaciente(formData) {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`http://localhost:5000/pacientes/${pacienteId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Paciente atualizado com sucesso!");
        navigate("/pacientes");
      } else if (response.status === 401) {
        alert("Login expirado, faça o login novamente");
        navigate("/login");
      } else {
        alert("Erro ao editar paciente.");
      }
    } catch {
      alert("Erro ao editar paciente.");
    }
  }

  return (
    <>
      <Menu />
      <Titulo texto="Editar Paciente" />
      {
        paciente &&(
            <Form
                onSubmit={editarPaciente}
                fields={[
                    { name: "nome", label: "Nome", type: "text", required: true },
                    { name: "telefone", label: "Telefone", type: "tel", required: true },
                    { name: "endereco", label: "Endereço", type: "text", required: true },
                    { name: "data_nascimento", label: "Data de Nascimento", type: "date", required: true },
                    ]}
                    initialValues={paciente}
                    buttonText="Salvar Alterações"
      />
        )
      }
    </>
  );
}

export default EditarPaciente;
