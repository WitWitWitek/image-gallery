import ImagesList from '../features/images/ImagesList';
import NewImageForm from '../features/images/NewImageForm';

function Home() {
  return (
    <>
      <div className="form-section__mobile-form-container">
        <NewImageForm />
      </div>
      <ImagesList />
    </>
  );
}

export default Home;
