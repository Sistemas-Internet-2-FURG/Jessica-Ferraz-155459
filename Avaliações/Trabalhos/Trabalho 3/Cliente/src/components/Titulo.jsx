import PropTypes from 'prop-types';

function Titulo({texto}) {
    return <h2 className='titulo'>{texto}</h2>
};

Titulo.propTypes = {
    texto: PropTypes.string,
};

export default Titulo;
