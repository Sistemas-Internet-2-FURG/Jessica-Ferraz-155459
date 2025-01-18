import PropTypes from "prop-types";

function ItemLista({ nome, referencia }) {
    return (
        <li>
            <a href={referencia}>{nome}</a>
        </li>
    );
}

ItemLista.propTypes = {
    referencia: PropTypes.string.isRequired,
    nome: PropTypes.string.isRequired,
};

export default ItemLista;
