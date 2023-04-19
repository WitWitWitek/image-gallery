/* eslint-disable react/require-default-props */
import '../styles/Dashboard.scss';
import {
  useNavigate, Routes, Route, Link,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToFile, faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { useLogoutMutation } from '../features/auth/authApiSlice';
import useToken from '../hooks/useToken';
import NewImageForm from '../features/images/NewImageForm';

import Login from '../features/auth/Login';
import NewUserForm from '../features/users/NewUserForm';
import useWindowSize from '../hooks/useWindowSize';
import Welcome from './Welcome';

import ResendEmailForm from '../features/users/ResendEmailForm';
import UserConfirmation from '../features/users/UserConfirmation';

interface DashboardProps {
  isMenuOpen?: boolean;
  setIsMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

function Dashboard({ isMenuOpen, setIsMenuOpen }: DashboardProps) {
  const windowSize = useWindowSize();
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const user = useToken();
  const navigate = useNavigate();
  const [logout, {
    isLoading,
    isSuccess,
    // isError,
    // error
  }] = useLogoutMutation();

  const logoutHandler = () => {
    logout('');
    if (setIsMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      navigate('/login');
    }
  }, [isSuccess, navigate]);

  const basicLayout = (
    <>
      <li className="dashboard__user">
        {user ? (
          <p>
            User:
            {user}
          </p>
        ) : null}
      </li>
      <li><Link className="dashboard__item" to={`/user/${user}/user-gallery`}>Your gallery </Link></li>
      <li><Link className="dashboard__item" to={`/user/${user}/user-profile`}>Your profile </Link></li>
      <button className="dashboard__item" onClick={() => setIsAddingNew(true)} type="button">
        Add New
        <FontAwesomeIcon icon={faArrowRightToFile} />
      </button>
      <button className="dashboard__button" onClick={logoutHandler} type="button">{isLoading ? 'Logging Out...' : 'Logout' }</button>
    </>
  );

  const addingNewImage = (
    <>
      <button className="dashboard__button" onClick={() => setIsAddingNew(false)} type="button">
        <FontAwesomeIcon icon={faArrowLeftLong} />
        {' '}
        go back
      </button>
      <NewImageForm />
    </>
  );

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
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<NewUserForm />} />
          <Route path="confirmation/:emailToken" element={<UserConfirmation />} />
          <Route path="resend-email" element={<ResendEmailForm />} />
        </Routes>
      )}
    </ul>
  );
}

export default Dashboard;
