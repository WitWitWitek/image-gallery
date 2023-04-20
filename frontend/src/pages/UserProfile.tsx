import { useParams, Navigate } from 'react-router-dom';
import useToken from '../hooks/useToken';
import ChangePasswordForm from '../features/users/ChangePasswordForm';

function UserProfile() {
  const params = useParams();
  const user = useToken();
  if (params.userId !== user) return <Navigate to="/dashboard" replace />;
  // this page is resctrited to logged in user, only user can watch this
  return (
    <div>
      <ChangePasswordForm />
    </div>
  );
}

export default UserProfile;
