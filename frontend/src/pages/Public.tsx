import { Link, Navigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import useWindowSize from "../hooks/useWindowSize"
import '../styles/Public.scss'
import useToken from "../hooks/useToken"

const Public = () => {
  const { windowSize } = useWindowSize()
  const user = useToken()

  const authButtons = (
          
    <p>
          <Link to='/login'>
            <button className="public__btn-login">Login</button>
            </Link>
          <Link to='/signup'>
            <button className="public__btn-signup">Sign up</button>
          </Link>
    </p>
  )

  if (user) return <Navigate to={'/dashboard'} />
  
  return (
    <main className="public">
      <header className="public__header">
        <FontAwesomeIcon icon={faImage} className='public__header-icon animate-pulse' />
        <h1 className="public__header-title">Welcome on Image Gallery!</h1>
      </header>
      <section className="public__welcome">
        <p className="public__desc">
          Share images via our platform with friends. Enjoy images collections of all users.    
        </p>
        {windowSize.width && windowSize.width < 768 && authButtons}
      </section>
    </main>
  )
}

export default Public