import { DashboardCard } from '../components/cards/DashboardCard';
import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/home.scss';

const Home = () => {
  const { currentUser } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [resourcesCount, setResourcesCount] = useState<number | null>(null);
  const [usersCount, setUsersCount] = useState<number | null>(null);
  const [changelogsCount, setChangelogsCount] = useState<number | null>(null);
  const [eventsCount, setEventsCount] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      if (!currentUser) return;
      console.log('Fetching dashboard data...');
      
    })()
  }, []);

  return (
    <main className="main-pane home">
      <div>
        <h1>Tableau de bord</h1>
        <p>Bienvenue dans l'interface d'aperçu global des outils Astroshare</p>
      </div>

      <div className='cards-container'>
        <DashboardCard small icon={Users} title="Ressources" value={0} />
        <DashboardCard small icon={Users} title="Inscrits" value={0} />
        <DashboardCard small icon={Users} title="Changelogs" value={0} />
        <DashboardCard small icon={Users} title="Events" value={0} />
      </div>
    </main>
  );
};

export default Home;
