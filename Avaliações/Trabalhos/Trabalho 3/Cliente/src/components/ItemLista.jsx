import PropTypes from "prop-types";
import "../styles/ItemLista.css"

function ItemLista({ nome, referencia }) {
    return (
        <li className="lista">
            <a className="item" href={referencia}>{nome}</a>
        </li>
    );
}

ItemLista.propTypes = {
    referencia: PropTypes.string.isRequired,
    nome: PropTypes.string.isRequired,
};

export default ItemLista;
