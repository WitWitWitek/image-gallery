import { Outlet, Navigate, useLocation } from 'react-router-dom';
import useToken from '../../hooks/useToken';

function RequireAuth() {
  const user = useToken();
  const location = useLocation();

  return (
    user ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default RequireAuth;
