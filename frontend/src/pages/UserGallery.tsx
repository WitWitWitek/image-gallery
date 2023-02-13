import { useParams } from 'react-router-dom'

const UserGallery = () => {
    const params = useParams()
    console.log(params);
    // this page is not resctrited to logged in user
    return (
        <div>{params.userId}</div>
    )
}

export default UserGallery