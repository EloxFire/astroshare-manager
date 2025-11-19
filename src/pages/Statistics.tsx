import { Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { DashboardCard } from '../components/cards/DashboardCard'
import '../styles/pages/users.scss'


export const StatisticsPage = () => {
  const [events, setEvents] = useState<TrackEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
  }, [])

  return (
    <main className="main-pane statistics-page">
      <div>
        <h1>Tableau de bord statistique</h1>
        <p>Profitez d'un aperçu des tendences statistiques de de l'application</p>
      </div>
      <div className='cards-container'>
        <DashboardCard icon={Users} title="Total" value={events.length} small />
      </div>
    </main>
  )
}
