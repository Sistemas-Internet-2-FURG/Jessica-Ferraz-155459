import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function VoltarLink({ nome }) {
    const navigate = useNavigate();

    function handleClick() {
        const pathArray = window.location.pathname.split("/").filter(Boolean);
        if (pathArray.length > 1) {
            pathArray.pop();
            navigate("/" + pathArray.join("/"));
        } else {
            navigate("/");
        }
    }

    return (
        <button 
            onClick={handleClick} 
            style={{ background: "none", border: "none", color: "blue", cursor: "pointer", textDecoration: "underline" }}
        >
            Voltar para {nome}
        </button>
    );
}

VoltarLink.propTypes = {
    nome: PropTypes.string.isRequired
};

export default VoltarLink;
