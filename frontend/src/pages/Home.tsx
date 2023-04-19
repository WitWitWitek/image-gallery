import ImagesList from '../features/images/ImagesList';
import NewImageForm from '../features/images/NewImageForm';
import useWindowSize from '../hooks/useWindowSize';

function Home() {
  const windowSize = useWindowSize();
  return (
    <>
      {windowSize < 768 && <NewImageForm />}
      <ImagesList />
    </>
  );
}

export default Home;
