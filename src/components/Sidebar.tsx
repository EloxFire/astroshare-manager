import { useNavigate } from 'react-router'
import { routes } from '../helpers/routes'
import '../styles/components/sidebar.scss'

export const Sidebar = () => {
  const navigate = useNavigate()

  return (
    <div className="sidebar">
      <div className='header'/>
      <nav className="sidebar-nav">
        {
          Object.values(routes).map(route => {
            const pathname = typeof window !== 'undefined' ? window.location.pathname : ''
            const isActive = pathname === route.path || (route.path !== '/' && pathname.startsWith(route.path + '/'))
            const Icon = route.Icon

            return (
              <button
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                data-color={route.color}
                key={route.path}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => navigate(route.path)}
              >
                <Icon className='sidebar-icon' aria-hidden color={isActive ? "#F4C238" : "#FFFFFF"} />
                {route.label}
              </button>
            )
          })
        }
      </nav>
    </div>
  )
}
