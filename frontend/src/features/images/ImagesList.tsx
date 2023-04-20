import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { Navigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { ImageItemMemoized } from './ImageItem';
import { useGetImagesQuery } from './imagesApiSlice';
import ImageProps from './imageTypes';
import '../../styles/ImageList.scss';
import useObserver from '../../hooks/useObserver';
import SkeletonImageItem from './SkeletonImageItem';

function ImagesList() {
  const location = useLocation();
  const [page, setPage] = useState<number>(1);
  const elementRef = useObserver<HTMLButtonElement>(setPage);

  const {
    data: images,
    isLoading,
    isError,
  } = useGetImagesQuery(page, {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  if (isError) return <Navigate to="/login" state={{ from: location }} replace />;

  const isRefetchDisabled = images?.listOfImgs.length === images?.imgsCount;

  return (
    <div className="image-list">
      <h2>Images: </h2>
      <ul className="image-list__ul">
        {images && images.listOfImgs.map((imageData: ImageProps) => (
          <ImageItemMemoized
            key={imageData._id}
            imageProps={imageData}
          />
        ))}
        {isLoading && (
          <>
            <SkeletonImageItem />
            <SkeletonImageItem />
            <SkeletonImageItem />
            <SkeletonImageItem />
          </>
        )}
      </ul>
      <button
        ref={elementRef}
        className="image-list__refetch-btn"
        onClick={() => setPage((prev) => prev + 1)}
        type="button"
        disabled={isRefetchDisabled}
      >
        {
          !isRefetchDisabled
            ? <FontAwesomeIcon icon={faArrowDown} />
            : 'No new images left'
        }
      </button>
    </div>
  );
}

export default ImagesList;
