import { Link } from "react-router-dom"

const Welcome = () => {
  return (
    <>
        <p className="dashboard__greeting">Log in to Image-gallery to start sharing and connecting with friends, family and people you know. Don't you have account? Click sign up button.</p>
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