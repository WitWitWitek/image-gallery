import { useParams } from 'react-router-dom'
import ImageItem from './ImageItem'
import { useGetImagesQuery } from './imagesApiSlice'
import { imageProps } from './imageTypes'

const UsersImagesList = () => {
    const params = useParams()
    const { 
        data: images,
         isLoading,
         isSuccess,
         isError
    } = useGetImagesQuery('imagesList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    })

    let userImages = null
    if (isLoading) return <p>Loading...</p>
    if (isError) return <p>Error occured...</p>

    if (isSuccess && images) {
        const filteredUserImages = images.listOfImgs.filter((image: imageProps) => image.user === params.userId)
        userImages = filteredUserImages.map((imageData: imageProps) => (
            <ImageItem 
                key={imageData._id}
                imageProps={imageData} 
            />
            ))
    }
    return (
        <div className="image-list">
            <h2>Your images: </h2>
            <ul className="image-list__ul">
                {userImages}
            </ul>
        </div>
    )
}

export default UsersImagesList