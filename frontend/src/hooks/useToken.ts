import jwtDecode from 'jwt-decode';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../features/auth/authSlice';

interface DecodedJwt {
  UserInfo: {
    username: string
  }
}

const useToken = () => {
  const token = useSelector(selectCurrentToken);
  let loggedUser: string = '';
  if (token) {
    const decodedToken = jwtDecode<DecodedJwt>(token);
    const { username } = decodedToken.UserInfo;
    loggedUser = username;
  }
  return loggedUser;
};

export default useToken;
