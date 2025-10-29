import type { LucideIcon } from 'lucide-react'
import '../../styles/components/cards/dashboardCard.scss'
import { colors } from '../../helpers/colors'
import { useNavigate } from 'react-router'

interface DashboardCardProps {
  icon: LucideIcon
  title: string
  value: string | number
  route?: string
  small?: boolean
  button?: boolean
}

export const DashboardCard = ({ icon, title, value, route, small, button }: DashboardCardProps) => {

  const Icon = icon
  const navigate = useNavigate()

  const handleClick = () => {
    if(!route) return;
    navigate(route)

    console.log(`${title} card clicked`)
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
        <p className={valueClassNames}>{value}</p>
      </div>
    </button>
  )
}
