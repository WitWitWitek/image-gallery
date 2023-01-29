import '../styles/Dashboard.scss'

interface DashboardProps {
    isMenuOpen?: boolean;
}

const Dashboard = ({ isMenuOpen }: DashboardProps) => {
  return (
    <ul className={`dashboard ${isMenuOpen ? 'isMenuActive' : ''}`}>
          <li className='dashboard__item'>Your profile</li>
          <li className='dashboard__item'>Your gallery</li>
          <li className='dashboard__item'>Add New</li>
          <li className='dashboard__user'>
            <div>User: Witold</div>
            <button>Logout</button>
          </li>
    </ul>
  )
}

export default Dashboard