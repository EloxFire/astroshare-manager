import { useLocation } from 'react-router'
import { useEffect, useState } from 'react';
import { routes } from '../helpers/routes';
import '../styles/components/navbar.scss'
import { useAuth } from '../context/AuthContext';


export const Navbar = () => {

  const { currentUser, logoutUser } = useAuth();

  const location = useLocation();
  const [currentRouteLabel, setCurrentRouteLabel] = useState('')
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const matchedRoute = Object.values(routes).find(
      ({ path }) => path === location.pathname,
    );

    setCurrentRouteLabel(matchedRoute?.label ?? '');
  }, [location.pathname]);

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  }

  return (
    <header className="navbar">
      <div className='navbar__left-section'>
        <p className="navbar__current-route">{currentRouteLabel}</p>
        <span className="navbar__env-badge">{import.meta.env.MODE}</span>
      </div>
      <div className='navbar__right-section'>
        {
          currentUser && (
            <div>
              <div onClick={() => {toggleUserMenu()}} className="navbar__user-icon">
                {currentUser.email?.charAt(0).toUpperCase()}
                {
                  isUserMenuOpen && (
                    <div className="navbar__user-icon__user-menu">
                      <p className="navbar__user-icon__user-email">{currentUser.email}</p>
                      <button className="navbar__user-icon__logout-button" onClick={logoutUser}>Déconnexion</button>
                    </div>
                  )
                }
              </div>
            </div>
          )
        }
      </div>
    </header>
  )
}
