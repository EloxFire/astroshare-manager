import type { LucideIcon } from 'lucide-react'
import { colors } from '../../helpers/colors'
import { useNavigate } from 'react-router'
import { Loader } from '../Loader.tsx'
import '../../styles/components/cards/dashboardCard.scss'

interface DashboardCardProps {
  icon: LucideIcon
  title: string
  value: string | number | undefined
  loading?: boolean
  route?: string
  small?: boolean
  button?: boolean
}

export const DashboardCard = ({ icon, title, value, loading = false, route, small, button }: DashboardCardProps) => {

  const Icon = icon
  const navigate = useNavigate()

  const handleClick = () => {
    if(!route) return;
    navigate(route)
  }

  const classNames = [
    'dashboard-card',
    button ? 'clickable' : '',
    small ? 'dashboard-card--small' : ''
  ].filter(Boolean).join(' ')

  const titleClassNames = [
    'card-title',
    button ? 'button' : '',
    small ? 'small' : ''
  ].filter(Boolean).join(' ')

  const valueClassNames = [
    'card-value',
    button ? 'button' : '',
    small ? 'small' : ''
  ].filter(Boolean).join(' ')

  return (
    <button onClick={handleClick} className={classNames}>
      <div className="icon">
        <Icon size={small ? 24 : 32} color={colors.accent} />
      </div>
      <div>
        <h2 className={titleClassNames}>{title}</h2>
        {loading ? (
          <Loader size='small' />
        ) : (
          <p className={valueClassNames}>{value}</p>
        )}
      </div>
    </button>
  )
}
