import '../styles/Navbar.scss'
import { Link } from 'react-router-dom'
import useWindowSize from '../hooks/useWindowSize'
import { useState } from 'react'
import Dashboard from './Dashboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import useToken from '../hooks/useToken'

const Navbar = () => {
  const windowSize = useWindowSize()
  const user = useToken()
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

  const menuToggleHandler = () => setIsMenuOpen(prev => !prev)

  
  return (
    <nav className="navbar">
        <div className='navbar__logo'>
          <Link to="/">
            <span><FontAwesomeIcon icon={faImage}/></span>
            Image-gallery
          </Link>
        </div>
        
        {(user && windowSize < 768) ? (
          <>
            <Dashboard isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            {user && <button className='navbar__toggle-btn' onClick={menuToggleHandler}>MENU</button>}
          </>
        ) : null}
    </nav>
  )
}

export default Navbar