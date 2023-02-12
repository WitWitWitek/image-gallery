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
interface DashboardProps {
    isMenuOpen?: boolean;
    setIsMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}
const Dashboard = ({ isMenuOpen, setIsMenuOpen }: DashboardProps) => {
  const { windowSize } = useWindowSize()
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
      <ul>
        <li className='dashboard__item'>Your profile</li>
        <li className='dashboard__item'>Your gallery</li>
        <li className='dashboard__item' onClick={() => setIsAddingNew(true)}>Add New</li>
        <li className='dashboard__user'>
        {user ? <div>User: {user}</div> : null}
        <button className='dashboard__button' onClick={logoutHandler}>{isLoading ? 'Logging Out...' : 'Logout' }</button>
        </li>
      </ul>
  )

  const addingNewImage = (
    <>
      <button onClick={() => setIsAddingNew(false)}>go back</button>
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
      {!user && windowSize.width && windowSize.width > 768 && (
        <Routes>
          <Route path='/' element={<Welcome />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<NewUserForm />} />
        </Routes>
      )}
    </ul>
  )
}

export default Dashboard