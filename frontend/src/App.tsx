import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './features/auth/Login';
import Home from './pages/Home';
import PersistLogin from './features/auth/PersistLogin';
import Public from './pages/Public';
import useWindowSize from './hooks/useWindowSize';
import RequireAuth from './features/auth/RequireAuth';
import NewUserForm from './features/users/NewUserForm';
import UserGallery from './pages/UserGallery';
import UserProfile from './pages/UserProfile';
import UserConfirmation from './features/users/UserConfirmation';
import ResendEmailForm from './features/users/ResendEmailForm';

function App() {
  const windowSize = useWindowSize();
  let publicRoutesToRender;
  if (windowSize > 768) {
    publicRoutesToRender = (
      <>
        <Route index element={<Public />} />
        <Route path="login" element={<Public />} />
        <Route path="signup" element={<Public />} />
        <Route path="confirmation/:emailToken" element={<Public />} />
        <Route path="resend-email" element={<Public />} />
        <Route path="*" element={<div>Error 404 - page not found!</div>} />
      </>
    );
  } else {
    publicRoutesToRender = (
      <>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<NewUserForm />} />
        <Route path="confirmation/:emailToken" element={<UserConfirmation />} />
        <Route path="resend-email" element={<ResendEmailForm />} />
        <Route path="*" element={<div>Error 404 - page not found!</div>} />
      </>
    );
  }
  return (
    <Routes>
      <Route path="/*" element={<Layout />}>
        {publicRoutesToRender}

        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route path="dashboard" element={<Home />} />
            <Route path="user">
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path=":userId">
                <Route index element={<Navigate to="/dashboard" />} />
                <Route path="user-gallery" element={<UserGallery />} />
                <Route path="user-profile" element={<UserProfile />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
