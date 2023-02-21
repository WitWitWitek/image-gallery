import ImageItem from "./ImageItem"
import { useGetImagesQuery } from "./imagesApiSlice"
import { imageProps } from "./imageTypes"
import '../../styles/ImageList.scss'
import { Navigate, useLocation } from "react-router-dom"

const ImagesList = () => {
  const location = useLocation()
  const {
    data: images,
    isLoading,
    // isSuccess,
    isError,
    // error
  } = useGetImagesQuery('imagesList', {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  })
  
  if (isLoading) return <p>Loading...</p>
  if (isError) return <Navigate to='/login' state={{ from: location }} replace={true} />

  return (
    <div className="image-list">
      <h2>Images: </h2>
      <ul className="image-list__ul">
        {images && images.listOfImgs.map((imageData: imageProps) => (
          <ImageItem 
            key={imageData._id}
            imageProps={imageData} 
          />
        ))}
      </ul>
    </div>
  )
}

export default ImagesList