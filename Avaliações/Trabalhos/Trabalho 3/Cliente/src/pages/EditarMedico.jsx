import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import Titulo from "../components/Titulo";
import Form from "../components/Form";

function EditarMedico() {
  const medicoId = new URLSearchParams(window.location.search).get("id");
  const [medico, setMedico] = useState(null);
  const navigate = useNavigate();

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
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setMedico({
            nome: data.medico.nome,
            especialidade: data.medico.especialidade,
            crm: data.medico.crm,
          });
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

  async function editarMedico(formData) {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`http://localhost:5000/medicos/${medicoId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Médico atualizado com sucesso!");
        navigate("/medicos");
      } else if (response.status === 401) {
        alert("Login expirado, faça o login novamente");
        navigate("/login");
      } else {
        alert("Erro ao editar médico.");
      }
    } catch {
      alert("Erro ao editar médico.");
    }
  }

  return (
    <>
      <Menu />
      <Titulo texto="Editar Médico" />
      {
        medico && (
            <Form
        onSubmit={editarMedico}
        fields={[
          { name: "nome", label: "Nome", type: "text", required: true },
          { name: "especialidade", label: "Especialidade", type: "text", required: true },
          { name: "crm", label: "CRM", type: "text", required: true },
        ]}
        initialValues={medico}
        buttonText="Salvar Alterações"
      />
        )
      }
    </>
  );
}

export default EditarMedico;
