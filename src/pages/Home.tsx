import { DashboardCard } from '../components/cards/DashboardCard';
import { Users } from 'lucide-react';
import '../styles/pages/home.scss';

const Home = () => {
  return (
    <main className="main-pane home">
      <div>
        <h1>Tableau de bord</h1>
        <p>Bienvenue dans l'interface d'aperçu global des outils Astroshare</p>
      </div>

      <div className='cards-container'>
        <DashboardCard icon={Users} title="Ressources" value="6" />
        <DashboardCard icon={Users} title="Inscrits" value="12" />
        <DashboardCard icon={Users} title="Changelogs" value="8" />
        <DashboardCard icon={Users} title="Events" value="8" />
      </div>
      {/* <section className="column">
        <p className="column-title">Ajouter une actualité</p>
        <AddNewsBanner />
        <hr />
        <p className="column-title">Liste des actualités</p>
        <NewsBannerHandler />
      </section>
      <section className="column">
        <p className="column-title">Ajouter un changelog</p>
        <AddChangelog />
      </section>
      <section className="column">
        <p className="column-title">Ajouter une ressource</p>
      </section> */}
    </main>
  );
};

export default Home;
