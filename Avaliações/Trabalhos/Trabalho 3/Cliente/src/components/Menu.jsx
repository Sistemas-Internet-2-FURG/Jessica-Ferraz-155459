import "../styles/Menu.css";
import PropTypes from 'prop-types';
import logo from '../assets/logo.png'; 

function Menu({ showLinks = true }) {
  return (
    <nav>
      <a href="/home"><img src={logo} alt="Logo" className="logo" /></a>
      {showLinks ? (
        <ul>
          <li><a href="/pacientes">Pacientes</a></li>
          <li><a href="/medicos">Médicos</a></li>
          <li><a href="/consultas">Consultas</a></li>
        </ul>
      ) : null}
    </nav>
  );
}

Menu.propTypes = {
  showLinks: PropTypes.bool,
};

export default Menu;
