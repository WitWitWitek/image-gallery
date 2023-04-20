import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useRefreshMutation } from './authApiSlice';
import { selectCurrentToken } from './authSlice';

function PersistLogin() {
  const effectRan = useRef<boolean>(false);
  const token = useSelector(selectCurrentToken);

  const [trueSuccess, setTrueSuccess] = useState<boolean>(false);

  const [refresh, {
    isSuccess,
    isError,
  }] = useRefreshMutation();

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      const verifyRefreshToken = async () => {
        try {
          await refresh('');
          setTrueSuccess(true);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(err);
        }
      };
      if (!token) verifyRefreshToken();
    }
    return () => {
      effectRan.current = true;
    };
    // eslint-disable-next-line
    }, [])

  if (isError) return <Navigate to="/login" />;
  if (token) return <Outlet />;

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {isSuccess && trueSuccess && (<Outlet />)}
    </>
  );
}

export default PersistLogin;
