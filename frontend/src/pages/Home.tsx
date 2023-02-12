import ImagesList from "../features/images/ImagesList"
import NewImageForm from "../features/images/NewImageForm"
import useWindowSize from "../hooks/useWindowSize"

const Home = () => {
  const { windowSize } = useWindowSize()
  return (
    <>
      <h2>What's new?</h2>
      {(windowSize.width && windowSize.width < 768) && <NewImageForm />}
      <ImagesList />
    </>
  )
}

export default Home