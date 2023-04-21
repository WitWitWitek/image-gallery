import { Navigate, useParams, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { ImageItemMemoized } from './ImageItem';
import { useGetUserImagesQuery } from './imagesApiSlice';
import ImageProps from './imageTypes';
import SkeletonImageItem from './SkeletonImageItem';
import useObserver from '../../hooks/useObserver';

function UsersImagesList() {
  const location = useLocation();
  const params = useParams();
  const username = params.userId as string;
  const [page, setPage] = useState<number>(1);
  const elementRef = useObserver<HTMLButtonElement>(setPage);
  const {
    data: images,
    isLoading,
    isSuccess,
    isError,
  } = useGetUserImagesQuery({ user: username, page }, {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let userImages = null;

  if (isError) return <Navigate to="/login" state={{ from: location }} replace />;

  if (isSuccess && images) {
    userImages = images.listOfImgs.map((imageData: ImageProps) => (
      <ImageItemMemoized
        key={imageData._id}
        imageProps={imageData}
      />
    ));
  }

  if (isLoading) {
    userImages = (
      <>
        <SkeletonImageItem />
        <SkeletonImageItem />
      </>
    );
  }

  const isRefetchDisabled = images?.listOfImgs.length === images?.imgsCount;

  return (
    <div className="image-list">
      <h2>{`${`${username}'s`} images:`}</h2>
      <ul className="image-list__ul">
        {userImages}
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

export default UsersImagesList;
