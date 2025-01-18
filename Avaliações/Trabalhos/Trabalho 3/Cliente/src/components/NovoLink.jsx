import PropTypes from "prop-types";

function NovoLink({ referencia, texto }) {
    return (
        <a href={referencia}>{texto}</a>
    );
}

NovoLink.propTypes = {
    referencia: PropTypes.string.isRequired,
    texto: PropTypes.string.isRequired,
};

export default NovoLink;
