import { Link, useLocation } from 'react-router'
import '../styles/components/navbar.scss'
import { useEffect, useState } from 'react';
import { routes } from '../helpers/routes';


export const Navbar = () => {

  const location = useLocation();
  const [currentRouteLabel, setCurrentRouteLabel] = useState('')

  useEffect(() => {
    const matchedRoute = Object.values(routes).find(
      ({ path }) => path === location.pathname,
    );

    setCurrentRouteLabel(matchedRoute?.label ?? '');
  }, [location.pathname]);

  return (
    <header className="navbar">
      <Link to="/" className="navbar__logo" aria-label="Retour à l'accueil">
        <img src="/images/logos/logo_white.png" alt="Logo d'Astroshare" />
      </Link>
      <p className="navbar__current-route">{currentRouteLabel}</p>
    </header>
  )
}
