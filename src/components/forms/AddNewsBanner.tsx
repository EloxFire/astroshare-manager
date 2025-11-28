import { useState } from 'react';
import { NewsBanner } from '../cards/NewsBanner';
import '../../styles/components/forms/addNewsBannerForm.scss';
import { useToast } from '../../hooks/useToast';

const DEFAULT_COLORS = '#000000;#000000';

interface AddNewsBannerProps {
  onBannerAdded: () => void;
}

const AddNewsBanner = ({ onBannerAdded }: AddNewsBannerProps) => {

  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [linkType, setLinkType] = useState<'none' | 'internal' | 'external'>('none');
  const [link, setLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!imageUrl){
      showToast("Une icône est requise pour ajouter une actualité.", { type: 'error' });
      return;
    }

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      showToast("La date de fin doit être postérieure à la date de début.", { type: 'error' });
      return;
    }

    setIsLoading(true);

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          title,
          description: content,
          icon: imageUrl,
          type: linkType,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          externalLink: linkType === 'external' ? link : '',
          internalRoute: linkType === 'internal' ? link : '',
          colors: DEFAULT_COLORS,
          visible: true,
          order: 0,
        }),
      });

      setTitle('');
      setContent('');
      setImageUrl('');
      setStartDate('');
      setEndDate('');
      setLink('');
      setLinkType('none');
      onBannerAdded();
    }catch (error) {
      console.error('Error adding news banner:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="news-banner-add">
      <form className="news-banner-add-form" onSubmit={handleSubmit}>
        <input required type="text" placeholder="Titre de l'actualité" value={title} onChange={(e) => setTitle(e.target.value)}/>

        <div className="field">
          <textarea
            placeholder="Contenu de l'actualité"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={85}
            style={{ resize: 'none', width: '100%' }}
          />
          <div className="char-count" aria-live="polite">{content.length}/85</div>
        </div>

        <input
          type="text"
          placeholder="URL de l'icone"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <input
          type="datetime-local"
          placeholder="Date de début (optionnel)"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="datetime-local"
          placeholder="Date de fin (optionnel)"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <select value={linkType} onChange={(e) => setLinkType(e.target.value as 'none' | 'internal' | 'external')}>
          <option value="none">Aucun</option>
          <option value="internal">Route interne</option>
          <option value="external">Lien externe</option>
        </select>
        <input
          type="text"
          placeholder="Lien externe ou route interne"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Chargement…' : 'Ajouter'}
        </button>
      </form>
      <div className="news-banner-add-preview">
        <p style={{marginBottom: '10px'}}>Prévisualisation :</p>
        <NewsBanner
          _id={'preview-id'}
          title={title}
          description={content}
          icon={imageUrl}
          colors={DEFAULT_COLORS}
          type={linkType}
          startDate={startDate ? new Date(startDate) : null}
          endDate={endDate ? new Date(endDate) : null}
          externalLink={linkType === 'external' ? link : ''}
          internalRoute={linkType === 'internal' ? link : ''}
          visible={true}
          order={0}
          createdAt={new Date().toISOString()}
        />
      </div>
    </div>
  )
}

export default AddNewsBanner;
