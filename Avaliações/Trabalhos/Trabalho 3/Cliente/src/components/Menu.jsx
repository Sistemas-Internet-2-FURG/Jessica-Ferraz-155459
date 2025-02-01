import PropTypes from 'prop-types';
import logo from '../assets/logo.png';
import "../styles/Menu.css"

function Menu({ showLinks = true }) {
  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  };
    
  return (
    <nav className="menu">
      <a href="/home" className="menu-logo"><img src={logo} alt="Logo" className="logo" /></a>
      {showLinks ? (
        <>
          <ul className="menu-links">
            <li className="menu-item"><a href="/pacientes" className="menu-link">Pacientes</a></li>
            <li className="menu-item"><a href="/medicos" className="menu-link">Médicos</a></li>
            <li className="menu-item"><a href="/consultas" className="menu-link">Consultas</a></li>
          </ul>
          <ul className="logout-link">
            <li className="logout-item"><a href="#" className="logout" onClick={handleLogout}>Sair</a></li>
          </ul>
        </>
      ) : null}
    </nav>
  );
}

Menu.propTypes = {
  showLinks: PropTypes.bool,
};

export default Menu;

