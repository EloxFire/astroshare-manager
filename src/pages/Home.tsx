import { DashboardCard } from '../components/cards/DashboardCard';
import { Users } from 'lucide-react';
import '../styles/pages/home.scss';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchJsonWithAuth } from '../helpers/api';

const Home = () => {

  const [, setLoading] = useState(true);
  const { accessToken, status } = useAuth();

  const [resourcesCount, setResourcesCount] = useState<number | null>(null);
  const [usersCount, setUsersCount] = useState<number | null>(null);
  const [changelogsCount, setChangelogsCount] = useState<number | null>(null);
  const [eventsCount, setEventsCount] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      if (status !== 'authenticated' || !accessToken) {
        if (status !== 'checking' && isMounted) {
          setLoading(false);
        }
        return;
      }

      try {
        const resourcesData = await fetchJsonWithAuth('/stats/count/resources', accessToken);
        const usersData = await fetchJsonWithAuth('/stats/count/users', accessToken);
        const changelogsData = await fetchJsonWithAuth('/stats/count/changelogs', accessToken);
        const eventsData = await fetchJsonWithAuth('/stats/count/trackingEvents', accessToken);

        if (!isMounted) return;
        console.log({ resourcesData, usersData, changelogsData, eventsData });
        
        setResourcesCount(resourcesData.totalResources);
        setUsersCount(usersData.userCount);
        setChangelogsCount(changelogsData.totalChangelogs);
        setEventsCount(eventsData.totalEvents);
      } catch (error) {
        if (!isMounted) return;
        console.error('[HomePage] Impossible de récupérer les statistiques', error);
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, [accessToken, status]);

  return (
    <main className="main-pane home">
      <div>
        <h1>Tableau de bord</h1>
        <p>Bienvenue dans l'interface d'aperçu global des outils Astroshare</p>
      </div>

      <div className='cards-container'>
        <DashboardCard small icon={Users} title="Ressources" value={resourcesCount} />
        <DashboardCard small icon={Users} title="Inscrits" value={usersCount} />
        <DashboardCard small icon={Users} title="Changelogs" value={changelogsCount} />
        <DashboardCard small icon={Users} title="Events" value={eventsCount} />
      </div>
    </main>
  );
};

export default Home;
