import '../styles/Dashboard.scss'
import { useLogoutMutation } from '../features/auth/authApiSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useToken from '../hooks/useToken';
import NewImageForm from '../features/images/NewImageForm';
import { Routes, Route } from 'react-router-dom';
import Login from '../features/auth/Login';
import NewUserForm from '../features/users/NewUserForm';
import useWindowSize from '../hooks/useWindowSize';
import Welcome from './Welcome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightToFile, faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import ResendEmailForm from '../features/users/ResendEmailForm';
import UserConfirmation from '../features/users/UserConfirmation';

interface DashboardProps {
    isMenuOpen?: boolean;
    setIsMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Dashboard = ({ isMenuOpen, setIsMenuOpen }: DashboardProps) => {
  const windowSize = useWindowSize()
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)
  const user = useToken()
  const navigate = useNavigate()
  const [logout, {
    isLoading,
    isSuccess,
    // isError,
    // error
  }] = useLogoutMutation()

  const logoutHandler = () => {
    logout('')
    if (setIsMenuOpen) {
      setIsMenuOpen(false)
    }
  }

  useEffect(() => {
      if (isSuccess) {
        navigate('/login')
      }
  }, [isSuccess, navigate])

  const basicLayout = (
      <>
        <li className='dashboard__user'>
          {user ? <p>User: {user}</p> : null}
        </li>
        <li><Link className='dashboard__item' to={`/user/${user}/user-gallery`}>Your gallery </Link></li>
        <li><Link className='dashboard__item' to={`/user/${user}/user-profile`}>Your profile </Link></li>
        <li className='dashboard__item' onClick={() => setIsAddingNew(true)}>Add New <FontAwesomeIcon icon={faArrowRightToFile} /></li>
        <button className='dashboard__button' onClick={logoutHandler}>{isLoading ? 'Logging Out...' : 'Logout' }</button>
      </>
  )

  const addingNewImage = (
    <>
      <button className='dashboard__button' onClick={() => setIsAddingNew(false)}><FontAwesomeIcon icon={faArrowLeftLong}/> go back</button>
      <NewImageForm />
    </>
  )

  return (
    <ul className={`dashboard ${isMenuOpen ? 'isMenuActive' : ''}`}>
      {user && (
        <>
          {!isAddingNew && basicLayout}
          {isAddingNew && addingNewImage}
        </>
      )}
      {!user && windowSize > 768 && (
        <Routes>
          <Route path='/' element={<Welcome />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<NewUserForm />} />
          <Route path='confirmation/:emailToken' element={<UserConfirmation />} />
          <Route path='resend-email' element={<ResendEmailForm />} />
        </Routes>
      )}
    </ul>
  )
}

export default Dashboard