import { Users } from 'lucide-react'
import { DashboardCard } from '../components/cards/DashboardCard'
import '../styles/pages/contents.scss'

export const Contents = () => {
  return (
    <main className="main-pane contents-page">
      <div>
        <h1>Gestionnaire de contenus</h1>
        <p>Bienvenue dans l'interface de gestion des contenus d'Astroshare</p>
      </div>
      <div className='cards-container'>
        <DashboardCard button icon={Users} title="Ressources" value="Ajouter une nouvelle ressource pédagogique" />
        <DashboardCard button icon={Users} title="Changelog" value="Présenter les derniers changements" />
        <DashboardCard button icon={Users} title="News Banner" value="Ajouter une nouvelle actualité" />
      </div>
    </main>
  )
}