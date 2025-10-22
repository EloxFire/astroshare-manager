import { useEffect, useState } from 'react';
import '../styles/components/newsBannerHandler.scss';
import type { AppNews } from '../helpers/types/AppNews';
import { NewsBanner } from './cards/NewsBanner';

export const NewsBannerHandler = () => {

  const [newsData, setNewsData] = useState<AppNews[]>([]);

  useEffect(() => {
    (async () => {
      const news = await fetch('https://dev-api.astroshare.fr/news')
      const newsData = await news.json();
      console.log("News day", newsData);
      
      setNewsData(newsData);
    })()
  }, [])

  return (
    <div className="news-banner-handler">
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
  )
}

export default NewsBannerHandler;