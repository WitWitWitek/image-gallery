import '../styles/Navbar.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import Dashboard from './Dashboard';
import useWindowSize from '../hooks/useWindowSize';
import useToken from '../hooks/useToken';

function Navbar() {
  const windowSize = useWindowSize();
  const user = useToken();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const menuToggleHandler = () => setIsMenuOpen((prev) => !prev);

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <Link to={!user ? '/' : '/dashboard'}>
          <span><FontAwesomeIcon icon={faImage} /></span>
          Image-gallery
        </Link>
      </div>

      {(user && windowSize < 768) ? (
        <>
          <Dashboard isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          {user && <button className="navbar__toggle-btn" onClick={menuToggleHandler} type="button">MENU</button>}
        </>
      ) : null}
    </nav>
  );
}

export default Navbar;
