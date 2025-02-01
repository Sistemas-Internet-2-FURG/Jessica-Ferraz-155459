import PropTypes from "prop-types";
import Form from "../components/Form";

function PacienteForm({ onSubmit, initialValues = {}, buttonText }) {
    const fields = [
        { name: "nome", label: "Nome", type: "text", required: true },
        { name: "dataNascimento", label: "Data de nascimento", type: "date", required: true },
        { name: "endereco", label: "Endereço", type: "text", required: true },
        { name: "telefone", label: "Telefone", type: "tel", required: true },
    ];

    return <Form onSubmit={onSubmit} fields={fields} initialValues={initialValues} buttonText={buttonText} />;
}

PacienteForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    initialValues: PropTypes.shape({
        nome: PropTypes.string,
        dataNascimento: PropTypes.string,
        endereco: PropTypes.string,
        telefone: PropTypes.string,
    }),
    buttonText: PropTypes.string.isRequired,
};

export default PacienteForm;

