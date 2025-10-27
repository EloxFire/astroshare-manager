import {Link, NavLink} from 'react-router'
import '../styles/components/navbar.scss'
import { routes } from '../helpers/routes'


export const Navbar = () => {


  // Get router route title for current path
  const getCurrentRouteTitle = () => {
    const currentPath = window.location.pathname;
    const currentRoute = Object.values(routes).find(route => route.path === currentPath);
    return currentRoute ? currentRoute.label : '';
  };

  const currentRouteTitle = getCurrentRouteTitle();

  return (
    <header className="navbar">
      <Link to="/" className="navbar__logo" aria-label="Retour à l'accueil">
        <img src="/images/logos/logo_white.png" alt="Logo d'Astroshare" />
      </Link>
      <p className="navbar__current-route">{currentRouteTitle}</p>
    </header>
  )
}
