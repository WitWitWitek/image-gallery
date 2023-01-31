import '../styles/Dashboard.scss'
import { useLogoutMutation } from '../features/auth/authApiSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface DashboardProps {
    isMenuOpen?: boolean;
}

const Dashboard = ({ isMenuOpen }: DashboardProps) => {
  const navigate = useNavigate()
  const [logout, {
    isLoading,
    isSuccess,
    // isError,
    // error
  }] = useLogoutMutation()

  useEffect(() => {
      if (isSuccess) {
        navigate('/login')
      }
  }, [isSuccess, navigate])
  
  return (
    <ul className={`dashboard ${isMenuOpen ? 'isMenuActive' : ''}`}>
          <li className='dashboard__item'>Your profile</li>
          <li className='dashboard__item'>Your gallery</li>
          <li className='dashboard__item'>Add New</li>
          <li className='dashboard__user'>
            <div>User: Witold</div>
            <button className='dashboard__button' onClick={logout}>{isLoading ? 'Logging Out...' : 'Logout' }</button>
          </li>
    </ul>
  )
}

export default Dashboard