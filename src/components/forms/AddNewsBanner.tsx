import { useState } from 'react';
import { NewsBanner } from '../cards/NewsBanner';
import '../../styles/components/forms/addNewsBannerForm.scss';
import { useToast } from '../../hooks/useToast';

interface AddNewsBannerProps {
  onBannerAdded: () => void;
}

const AddNewsBanner = ({ onBannerAdded }: AddNewsBannerProps) => {

  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkType, setLinkType] = useState('none');
  const [link, setLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!imageUrl){
      showToast("Une icône est requise pour ajouter une actualité.", { type: 'error' });
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
          externalLink: linkType === 'external' ? link : '',
          internalRoute: linkType === 'internal' ? link : '',
          colors: "#000000;#000000",
          visible: true,
          order: 0,
        }),
      });

      setTitle('');
      setContent('');
      setImageUrl('');
      setLink('');
      setLinkType('internal');
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
        <select value={linkType} onChange={(e) => setLinkType(e.target.value)}>
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
          colors=''
          type={linkType}
          externalLink=''
          internalRoute=''
          visible={true}
          order={0}
          createdAt={new Date().toISOString()}
        />
      </div>
    </div>
  )
}

export default AddNewsBanner;
