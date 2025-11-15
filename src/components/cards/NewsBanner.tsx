import type { AppNews } from '../../helpers/types/AppNews';
import '../../styles/components/cards/newsBanner.scss';

interface NewsBannerProps extends AppNews {}

export const NewsBanner = ({ title, description, icon }: NewsBannerProps) => {
  return (
    <div className="news-banner-preview">
      <img className='news-banner-image' src={icon} alt={title} />
      <div className="news-banner-details">
        <h3 className="news-banner-title">{title || 'No Title'}</h3>
        <p className="news-banner-description">{description || 'No Content'}</p>
      </div>
    </div>
  )
}
