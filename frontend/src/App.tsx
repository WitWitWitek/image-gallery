import { Routes, Route } from 'react-router-dom'
import Layout from "./components/Layout"
import Home from './pages/Home'

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />}/>
                {/* <Route path='new' element={<NewImageForm />} /> */}
            </Route>
        </Routes>
    )
}

export default App
