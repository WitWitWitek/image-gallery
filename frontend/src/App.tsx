import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from "./components/Layout"
import Login from './features/auth/Login'
import Home from './pages/Home'
import PersistLogin from './features/auth/PersistLogin'
import Public from './pages/Public'
import useWindowSize from './hooks/useWindowSize'
import RequireAuth from './features/auth/RequireAuth'
import NewUserForm from './features/users/NewUserForm'
import UserGallery from './pages/UserGallery'
import UserProfile from './pages/UserProfile'

const App = () => {
    const { windowSize } = useWindowSize()
    let publicRoutesToRender;
    if (windowSize.width && windowSize.width > 768) {
        publicRoutesToRender = (
            <>
                <Route index element={<Public />} />
                <Route path="login" element={<Public />} />
                <Route path='signup' element={<Public />} />
            </>
        )
    } else {
        publicRoutesToRender = (
            <>
                <Route index element={<Public />} />
                <Route path="login" element={<Login />} />
                <Route path='signup' element={<NewUserForm />} />
            </>
        )
    }
    return (
        <Routes>
            <Route path="/*" element={<Layout />}>
                {publicRoutesToRender}
                
                <Route element={<PersistLogin />}>
                    <Route element={<RequireAuth />}>
                        <Route path="dashboard" element={<Home />}/>
                        <Route path="user">
                            <Route index element={<Navigate to='/dashboard' />} />
                            <Route path=':userId'>
                                <Route index element={<Navigate to='/dashboard' />} />
                                <Route path='user-gallery' element={<UserGallery />}/>
                                <Route path='user-profile' element={<UserProfile />}/>
                            </Route>
                        </Route>
                    </Route>
                </Route>
            </Route>
        </Routes>
    )
}

export default App
