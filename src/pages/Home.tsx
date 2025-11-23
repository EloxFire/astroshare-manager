import { DashboardCard } from '../components/cards/DashboardCard';
import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/home.scss';

const Home = () => {
  const { currentUser } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [resourcesCount, setResourcesCount] = useState<number>(0);
  const [categoriesCount, setCategoriesCount] = useState<number>(0);
  const [usersCount, setUsersCount] = useState<number>(0);
  const [changelogsCount, setChangelogsCount] = useState<number>(0);
  const [eventsCount, setEventsCount] = useState<number>(0);

  useEffect(() => {
    (async () => {
      if (!currentUser) return;
      console.log('Fetching dashboard data...');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      };

      try {
        const resources = await fetch(`${import.meta.env.VITE_API_URL}/stats/count/resources`, {headers});
        const resourcesData = await resources.json();
        setResourcesCount(resourcesData.count);

        const categories = await fetch(`${import.meta.env.VITE_API_URL}/stats/count/categories`, {headers});
        const categoriesData = await categories.json();
        setCategoriesCount(categoriesData.count);

        const users = await fetch(`${import.meta.env.VITE_API_URL}/stats/count/users`, {headers});
        const usersData = await users.json();
        setUsersCount(usersData.count);

        const changelogs = await fetch(`${import.meta.env.VITE_API_URL}/stats/count/changelogs`, {headers});
        const changelogsData = await changelogs.json();
        setChangelogsCount(changelogsData.count);

        const events = await fetch(`${import.meta.env.VITE_API_URL}/stats/count/trackingEvents`, {headers});
        const eventsData = await events.json();
        setEventsCount(eventsData.count);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
      
    })()
  }, []);

  return (
    <main className="main-pane home">
      <div>
        <h1>Tableau de bord</h1>
        <p>Bienvenue dans l'interface d'aperçu global des outils Astroshare</p>
      </div>

      <div className='cards-container'>
        <DashboardCard small icon={Users} title="Ressources" loading={loading} value={resourcesCount} />
        <DashboardCard small icon={Users} title="Catégories" loading={loading} value={categoriesCount} />
        <DashboardCard small icon={Users} title="Inscrits" loading={loading} value={usersCount} />
        <DashboardCard small icon={Users} title="Changelogs" loading={loading} value={changelogsCount} />
        <DashboardCard small icon={Users} title="Events" loading={loading} value={eventsCount} />
      </div>
    </main>
  );
};

export default Home;
