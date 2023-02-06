import { Link } from "react-router-dom"

const Public = () => {
  return (
    <>
      <h1>Welcome on Image Gallery!</h1>
      <div>
        Have already account? Please <Link to='/login'>login</Link>
      </div>
      <div>
        Otherwise, please <Link to='/signup'>signup</Link>
      </div>
    </>
  )
}

export default Public