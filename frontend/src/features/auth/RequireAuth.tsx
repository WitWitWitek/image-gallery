import { Outlet, Navigate, useLocation } from "react-router-dom"
import useToken from "../../hooks/useToken"

const RequireAuth = () => {
    const user = useToken()
    const location = useLocation()
    
    return (
        user ? <Outlet /> : <Navigate to='/login' state={{from: location}} replace={true} />
    )
}

export default RequireAuth