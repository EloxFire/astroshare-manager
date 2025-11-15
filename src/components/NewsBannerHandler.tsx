import { useEffect, useState } from 'react';
import '../styles/components/newsBannerHandler.scss';
import type { AppNews } from '../helpers/types/AppNews';
import { NewsBanner } from './cards/NewsBanner';
import { useAuth } from '../context/AuthContext';
import { fetchJsonWithAuth } from '../helpers/api';

export const NewsBannerHandler = () => {

  const [newsData, setNewsData] = useState<AppNews[]>([]);
  const { accessToken, status } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const loadNews = async () => {
      if (status !== 'authenticated' || !accessToken) {
        if (status !== 'checking') {
          setNewsData([]);
        }
        return;
      }

      try {
        const response = await fetchJsonWithAuth<{ data?: AppNews[] }>('/news', accessToken);

        if (!isMounted) return;
        setNewsData(response?.data ?? []);
      } catch (error) {
        if (!isMounted) return;
        console.error('[NewsBannerHandler] Impossible de récupérer les actualités', error);
        setNewsData([]);
      }
    };

    loadNews();

    return () => {
      isMounted = false;
    };
  }, [accessToken, status]);


  return (
    <>
      <p>{newsData.length} actualités disponibles</p>
      <div className="news-banner-handler">
        <p>{newsData.length} actualités disponibles</p>
        {
          newsData.map((newsItem, index) => {
            return (
              <NewsBanner
                key={index}
                title={newsItem.title}
                description={newsItem.description}
                icon={newsItem.icon}
                colors={newsItem.colors}
                type={newsItem.type}
                externalLink={newsItem.externalLink}
                internalRoute={newsItem.internalRoute}
                visible={newsItem.visible}
                order={newsItem.order}
                createdAt={newsItem.createdAt}
              />
            )
          })
        }
      </div>
    </>
  )
}

export default NewsBannerHandler;
