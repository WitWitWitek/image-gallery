import ImagesList from "../features/images/ImagesList"
import NewImageForm from "../features/images/NewImageForm"

const Home = () => {
  return (
    <>
      <h2>What's new?</h2>
      <NewImageForm />
      <ImagesList />
    </>
  )
}

export default Home