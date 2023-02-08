import jwtDecode from "jwt-decode";
import { selectCurrentToken } from "../features/auth/authSlice";
import { useSelector } from "react-redux";

interface DecodedJwt {
    UserInfo: {
        username: string
    }
}

const useToken = () => {
  const token = useSelector(selectCurrentToken);
  let loggedUser: string = ''
  if (token) {
    const decodedToken = jwtDecode<DecodedJwt>(token)
    const { username } = decodedToken.UserInfo
    loggedUser = username
  }
  return loggedUser
}

export default useToken