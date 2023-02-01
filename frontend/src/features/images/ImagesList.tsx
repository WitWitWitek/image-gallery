import ImageItem from "./ImageItem"
import { useGetImagesQuery } from "./imagesApiSlice"
import { imageProps } from "./imageTypes"
import '../../styles/ImageList.scss'

const ImagesList = () => {

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
  if (isError) return <p>Error occured...</p>

  return (
    <div className="image-list">
      <h2>Images: </h2>
      <ul>
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