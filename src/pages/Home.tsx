import { DashboardCard } from '../components/cards/DashboardCard';
import { Users } from 'lucide-react';
import '../styles/pages/home.scss';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchJsonWithAuth } from '../helpers/api';

const Home = () => {

  const [, setLoading] = useState(true);
  const { accessToken, status } = useAuth();

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

        if (!isMounted) return;
        console.log(resourcesData);
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
        <DashboardCard small icon={Users} title="Ressources" value="6" />
        <DashboardCard small icon={Users} title="Inscrits" value="12" />
        <DashboardCard small icon={Users} title="Changelogs" value="8" />
        <DashboardCard small icon={Users} title="Events" value="8" />
      </div>
    </main>
  );
};

export default Home;
