import type { LucideIcon } from 'lucide-react'
import '../../styles/components/cards/dashboardCard.scss'
import { colors } from '../../helpers/colors'

interface DashboardCardProps {
  icon: LucideIcon
  title: string
  value: string | number
  button?: boolean
}

export const DashboardCard = ({ icon, title, value, button }: DashboardCardProps) => {

  const Icon = icon

  const handleClick = () => {
    if(!button) return;
    
    console.log(`${title} card clicked`)
  }

  return (
    <button onClick={handleClick} className="dashboard-card">
      <div className="icon">
        <Icon size={32} color={colors.accent} />
      </div>
      <div>
        <h2>{title}</h2>
        <p>{value}</p>
      </div>
    </button>
  )
}