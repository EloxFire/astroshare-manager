import { Users } from 'lucide-react'
import { DashboardCard } from '../components/cards/DashboardCard'
import '../styles/pages/contents.scss'
import { routes } from '../helpers/routes'

export const Contents = () => {

  return (
    <main className="main-pane contents-page">
      <div>
        <h1>Gestionnaire de contenus</h1>
        <p>Bienvenue dans l'interface de gestion des contenus d'Astroshare</p>
      </div>
      <div className='cards-container'>
        <DashboardCard small button route={routes.resources.path} icon={Users} title="Ressources" value="Ajouter une nouvelle ressource pédagogique" />
        <DashboardCard small button route={routes.changelogs.path} icon={Users} title="Changelog" value="Présenter les derniers changements" />
        <DashboardCard small button route={routes.newsBanners.path} icon={Users} title="News Banner" value="Ajouter une nouvelle actualité" />
      </div>
    </main>
  )
}