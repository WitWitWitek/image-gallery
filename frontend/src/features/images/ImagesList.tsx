import ImageItem from "./ImageItem"
import { useGetImagesQuery } from "./imagesApiSlice"
import { imageProps } from "./imageTypes"
import '../../styles/ImageList.scss'
import { Navigate, useLocation } from "react-router-dom"
import { useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'
import useObserver from "../../hooks/useObserver"

const ImagesList = () => {
  const location = useLocation()
  const [page, setPage] = useState<number>(1)
  const [elementRef] = useObserver<HTMLButtonElement>(setPage)

  const {
    data: images,
    isLoading,
    // isSuccess,
    isError,
    // error
  } = useGetImagesQuery(page, {
      pollingInterval: 15000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true
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
      {isLoading && <p>Loading...</p>}
      {
        images.listOfImgs.length !== images.imgsCount ?
        <button ref={elementRef} className='image-list__refetch-btn' onClick={() => setPage(prev => prev +1)}><FontAwesomeIcon icon={faArrowDown} /></button> :
        <p style={{textAlign: 'center'}}>This is the end of list... Scroll up.</p>
      }
    </div>
  )
}

export default ImagesList