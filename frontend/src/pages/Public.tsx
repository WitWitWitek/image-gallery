import { Link } from 'react-router-dom';
import useWindowSize from '../hooks/useWindowSize';
import '../styles/Public.scss';

function Public() {
  const windowSize = useWindowSize();

  const authButtons = (
    <p>
      <Link to="/login">
        <button className="public__btn-login" type="button">Login</button>
      </Link>
      <Link to="/signup">
        <button className="public__btn-signup" type="button">Sign up</button>
      </Link>
    </p>
  );

  return (
    <main className="public">
      <header className="public__header">
        <img className="public__header-image" src="/home_cover.png" alt="home cover" />
        <h1 className="public__header-title">Welcome on Image Gallery!</h1>
      </header>
      <section className="public__welcome">
        <p className="public__desc">
          Share images via our platform with friends. Enjoy images collections of all users.
        </p>
        {windowSize < 768 && authButtons}
      </section>
    </main>
  );
}

export default Public;
