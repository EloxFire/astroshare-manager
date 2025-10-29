import { DashboardCard } from '../components/cards/DashboardCard';
import { Users } from 'lucide-react';
import '../styles/pages/home.scss';
import { useEffect, useState } from 'react';

const Home = () => {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const BASE_URL = 'http://dev-api.astroshare.fr/stats';

      const resources = await fetch(`${BASE_URL}/count/resources`);
      const resourcesData = await resources.json();
      console.log(resourcesData);
      setLoading(false);
    })()
  }, []);

  return (
    <main className="main-pane home">
      <div>
        <h1>Tableau de bord</h1>
        <p>Bienvenue dans l'interface d'aperçu global des outils Astroshare</p>
      </div>

      <div className='cards-container'>
        <DashboardCard small icon={Users} title="Ressources" value="6" />
        <DashboardCard small icon={Users} title="Inscrits" value="12" />
        <DashboardCard small icon={Users} title="Changelogs" value="8" />
        <DashboardCard small icon={Users} title="Events" value="8" />
      </div>
    </main>
  );
};

export default Home;
