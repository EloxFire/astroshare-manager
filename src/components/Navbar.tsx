import {Link, NavLink} from 'react-router'
import '../styles/components/navbar.scss'
import { routes } from '../helpers/routes'


export const Navbar = () => {
  return (
    <header className="navbar">
      <Link to="/" className="navbar__logo" aria-label="Retour à l'accueil">
        <img src="/images/logos/logo_white.png" alt="Logo d'Astroshare" />
      </Link>
      <nav className="navbar__menu" aria-label="Navigation principale">
        {Object.values(routes).map((item: { path: string; label: string }) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({isActive}) =>
              ['navbar__link', isActive ? 'navbar__link--active' : undefined]
                .filter(Boolean)
                .join(' ')
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
