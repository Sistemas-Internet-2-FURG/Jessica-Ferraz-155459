import PropTypes from 'prop-types';
import "../styles/Titulo.css"

function Titulo({texto}) {
    return <h2 className='titulo'>{texto}</h2>
};

Titulo.propTypes = {
    texto: PropTypes.string,
};

export default Titulo;
