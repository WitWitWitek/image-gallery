import { Outlet } from "react-router-dom"
import useWindowSize from "../hooks/useWindowSize"
import Dashboard from "./Dashboard"
import Navbar from "./Navbar"

const Layout = () => {
  const windowSize = useWindowSize()
  
  return (
    <main className="app-container">
      <Navbar />
      {(windowSize > 768) && <Dashboard />}
      <div className="content-container">
        <Outlet />
      </div>
    </main>
    
  )
}

export default Layout