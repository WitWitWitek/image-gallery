import { Outlet, Navigate } from "react-router-dom"
import useToken from "../../hooks/useToken"

const RequireAuth = () => {
    const user = useToken()
    return (
        user !== '' ? <Outlet /> : <Navigate to='/login' replace={true} />
    )
}

export default RequireAuth