import { Link } from "react-router-dom"

const Welcome = () => {
  return (
    <>
        <h2>To start please sign in or sign up:</h2>
        <p>
          <Link to='/login'>
            <button className="public__btn-login">Login</button>
            </Link>
          <Link to='/signup'>
            <button className="public__btn-signup">Sign up</button>
          </Link>
    </p>
    </>
  )
}

export default Welcome