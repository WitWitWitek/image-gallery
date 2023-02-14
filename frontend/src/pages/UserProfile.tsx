import { useParams } from 'react-router-dom'
import useToken from '../hooks/useToken'
import { Navigate } from 'react-router-dom'
import ChangePasswordForm from '../features/users/ChangePasswordForm'

const UserProfile = () => {
    const params = useParams()
    const user = useToken()
    if (params.userId !== user) return <Navigate to='/dashboard' replace={true} />
    // this page is resctrited to logged in user, only user can watch this
    return (
        <>
            {params.userId}
            <ChangePasswordForm />
        </>
    )
}

export default UserProfile