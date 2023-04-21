import { Outlet } from 'react-router-dom';
import Dashboard from './Dashboard';
import Navbar from './Navbar';

function Layout() {
  return (
    <main className="app-container">
      <Navbar />
      <Dashboard />
      <div className="content-container">
        <Outlet />
      </div>
    </main>

  );
}

export default Layout;
