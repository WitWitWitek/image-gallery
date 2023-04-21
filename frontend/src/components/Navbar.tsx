import '../styles/Navbar.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faCompass } from '@fortawesome/free-solid-svg-icons';
import Dashboard from './Dashboard';
import useToken from '../hooks/useToken';

function Navbar() {
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

      {user ? (
        <>
          <div className="navbar__dashboard-mobile-container"><Dashboard isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} /></div>
          <button className="navbar__toggle-btn" onClick={menuToggleHandler} aria-label="menu button" type="button"><FontAwesomeIcon icon={faCompass} /></button>
        </>
      ) : null}
    </nav>
  );
}

export default Navbar;
