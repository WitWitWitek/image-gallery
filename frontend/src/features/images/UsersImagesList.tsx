import { Navigate, useParams } from 'react-router-dom'
import { ImageItemMemoized } from './ImageItem'
import { useGetImagesQuery } from './imagesApiSlice'
import { imageProps } from './imageTypes'
import { useLocation } from 'react-router-dom'
import { SkeletonImageItem } from './SkeletonImageItem'
import useObserver from '../../hooks/useObserver'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'

const UsersImagesList = () => {
    const location = useLocation()
    const params = useParams()
    const [page, setPage] = useState<number>(1)
    const elementRef = useObserver<HTMLButtonElement>(setPage)
    
    const { 
        data: images,
         isLoading,
         isSuccess,
         isError
    } = useGetImagesQuery(page , {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    })

    let userImages = null
    if (isError) return <Navigate to='/login' state={{ from: location }} replace={true} />

    if (isSuccess && images) {
        const filteredUserImages = images.listOfImgs.filter((image: imageProps) => image.user === params.userId)
        userImages = filteredUserImages.map((imageData: imageProps) => (
            <ImageItemMemoized 
                key={imageData._id}
                imageProps={imageData} 
            />
            ))
    }

    if (isLoading) {
        userImages = (
            <>
                <SkeletonImageItem />
                <SkeletonImageItem />
            </>
        )
    }

    return (
        <div className="image-list">
            <h2>Your images: </h2>
            <ul className="image-list__ul">
                {userImages}
            </ul>
            {
                isSuccess && images.listOfImgs.length !== images.imgsCount ?
                <button ref={elementRef} className='image-list__refetch-btn' onClick={() => setPage(prev => prev +1)}><FontAwesomeIcon icon={faArrowDown} /></button> :
                <p style={{textAlign: 'center'}}>This is the end of list... Scroll up.</p>
            }
        </div>
    )
}

export default UsersImagesList