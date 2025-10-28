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
      <p className="navbar__current-route">{currentRouteLabel}</p>
    </header>
  )
}
