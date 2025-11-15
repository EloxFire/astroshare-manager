import { useLocation } from 'react-router'
import { useEffect, useState } from 'react';
import { routes } from '../helpers/routes';
import '../styles/components/navbar.scss'


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
      <p className="navbar__current-route">{currentRouteLabel}</p>
      {/* Small badge indicating current environment from .env */}
      <span className="navbar__env-badge">{import.meta.env.MODE}</span>
    </header>
  )
}
