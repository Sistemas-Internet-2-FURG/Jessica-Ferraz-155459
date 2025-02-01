
import PropTypes from "prop-types";
import "../styles/Detalhes.css"; // Importando o CSS

function Detalhes({ titulo, detalhes, onEdit, onDelete }) {
  return (
    <div className="detalhes-container">
      <h2 className="detalhes-titulo">{titulo}</h2>
      <div className="detalhes-lista">
        {detalhes.map((detalhe, index) => (
          <p className="detalhe" key={index}>
            <strong>{detalhe.label}:</strong> {detalhe.valor}
          </p>
        ))}
      </div>
      <div className="detalhes-botoes">
        <button className="detalhes-editar" onClick={onEdit}>Editar</button>
        <button className="detalhes-excluir" onClick={onDelete}>Excluir</button>
      </div>
    </div>
  );
}

Detalhes.propTypes = {
  titulo: PropTypes.string.isRequired,
  detalhes: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      valor: PropTypes.string.isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default Detalhes;
