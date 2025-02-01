import PropTypes from "prop-types";
import "../styles/NovoLink.css"; // Importa o CSS

function NovoLink({ referencia, texto }) {
    return (
        <a href={referencia} className="novo-link">
            {texto}
        </a>
    );
}

NovoLink.propTypes = {
    referencia: PropTypes.string.isRequired,
    texto: PropTypes.string.isRequired,
};

export default NovoLink;

