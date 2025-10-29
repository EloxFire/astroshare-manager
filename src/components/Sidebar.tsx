import { Link, useLocation, useNavigate } from 'react-router'
import { type CSSProperties, useMemo } from 'react'
import { routes } from '../helpers/routes'
import '../styles/components/sidebar.scss'
import { colors } from '../helpers/colors'

export const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname

  type RouteEntry = [string, (typeof routes)[keyof typeof routes]]

  const groupedRoutes = useMemo(() => {
    const entries = Object.entries(routes) as RouteEntry[]
    const childrenByParent = entries.reduce<Record<string, RouteEntry[]>>((acc, entry) => {
      const [, route] = entry

      if (!route.parent) return acc

      if (!acc[route.parent]) {
        acc[route.parent] = []
      }

      acc[route.parent].push(entry)
      return acc
    }, {})

    return entries
      .filter(([, route]) => !route.parent)
      .map((entry) => {
        const [key, route] = entry

        return {
          key,
          route,
          children: childrenByParent[key] ?? []
        }
      })
  }, [])

  const isPathActive = (path: string) => {
    if (path === '/') return pathname === path
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <div className="sidebar">
      <div className='header'>
        <Link to="/" className="navbar__logo" aria-label="Retour à l'accueil">
          <img src="/images/logos/logo_white.svg" alt="Logo d'Astroshare" />
        </Link>
      </div>
      <nav className="sidebar-nav">
        {groupedRoutes.map(({ key, route, children }) => {
          const Icon = route.Icon
          const isActive = isPathActive(route.path) || children.some(([, childRoute]) => isPathActive(childRoute.path))
          const parentStyle = { '--item-color': colors.accent } as CSSProperties

          return (
            <div className="sidebar-group" key={key}>
              <button
                className={`sidebar-item sidebar-item--parent ${isActive ? 'active' : ''}`}
                data-color={colors.accent}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => navigate(route.path)}
                style={parentStyle}
              >
                <Icon className='sidebar-icon' aria-hidden size={20} color={isActive ? colors.accent : "#FFFFFF"} />
                {route.label}
              </button>

              {children.length ? (
                <div className="sidebar-children">
                  {children.map(([childKey, childRoute]) => {
                    const ChildIcon = childRoute.Icon
                    const isChildActive = isPathActive(childRoute.path)
                    const childStyle = { '--item-color': colors.accent } as CSSProperties

                    return (
                      <button
                        key={childKey}
                        className={`sidebar-item sidebar-item--child ${isChildActive ? 'active' : ''}`}
                        data-color={colors.accent}
                        aria-current={isChildActive ? 'page' : undefined}
                        onClick={() => navigate(childRoute.path)}
                        style={childStyle}
                      >
                        <ChildIcon className='sidebar-icon' aria-hidden size={16} color={isChildActive ? colors.accent : "#FFFFFF"} />
                        {childRoute.label}
                      </button>
                    )
                  })}
                </div>
              ) : null}
            </div>
          )
        })}
      </nav>
    </div>
  )
}
