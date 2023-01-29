import '../styles/Navbar.scss'
import { Link } from 'react-router-dom'
import useWindowSize from '../hooks/useWindowSize'
import { useState } from 'react'
import Dashboard from './Dashboard'

const Navbar = () => {
  const { windowSize } = useWindowSize()
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

  const menuToggleHandler = () => setIsMenuOpen(prev => !prev)

  
  return (
    <nav className="navbar">
        <div className='navbar__logo'>
          <Link to="/">
            Image-gallery
          </Link>
        </div>
        
        {(windowSize.width && windowSize.width < 768) ? (
          <>
            <Dashboard isMenuOpen={isMenuOpen} />
            <button className='navbar__toggle-btn' onClick={menuToggleHandler}>MENU</button>
          </>
        ) : null}
    </nav>
  )
}

export default Navbar