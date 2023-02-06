import { Routes, Route } from 'react-router-dom'
import Layout from "./components/Layout"
import Login from './features/auth/Login'
import Home from './pages/Home'
import PersistLogin from './features/auth/PersistLogin'
import Public from './pages/Public'
import SignUp from './pages/SignUp'
const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Public />} />
                <Route path="/login" element={<Login />} />
                <Route path='/signup' element={<SignUp />} />
                
                <Route element={<PersistLogin />}>
                    <Route path="dashboard" element={<Home />}/>
                </Route>
            </Route>
        </Routes>
    )
}

export default App
