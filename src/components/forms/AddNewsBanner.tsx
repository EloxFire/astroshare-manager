import { useState } from 'react';
import { NewsBanner } from '../cards/NewsBanner';
import '../../styles/components/forms/addNewsBannerForm.scss';
import { useAuth } from '../../context/AuthContext';
import { fetchJsonWithAuth } from '../../helpers/api';

const AddNewsBanner = () => {

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkType, setLinkType] = useState('internal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { accessToken, status } = useAuth();

  const isAuthenticated = status === 'authenticated' && Boolean(accessToken);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !accessToken) {
      console.warn('[AddNewsBanner] Tentative de soumission sans session valide.');
      return;
    }

    try {
      setIsSubmitting(true);

      await fetchJsonWithAuth('/news', accessToken, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description: content,
          icon: imageUrl,
          type: linkType,
          externalLink: linkType === 'external' ? '' : undefined,
          internalRoute: linkType === 'internal' ? '' : undefined,
          visible: true,
          order: 0,
        })
      });

      setTitle('');
      setContent('');
      setImageUrl('');
      setLinkType('internal');
    } catch (error) {
      console.error('Error adding news banner:', error);
    } finally {
      setIsSubmitting(false);
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
          placeholder="URL de l'image"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <select value={linkType} onChange={(e) => setLinkType(e.target.value)}>
          <option value="internal">Internal link</option>
          <option value="external">External link</option>
        </select>
        <button type="submit" disabled={!isAuthenticated || isSubmitting}>
          {isSubmitting ? 'Ajout en cours…' : 'Ajouter'}
        </button>
        {!isAuthenticated ? (
          <p className="form-hint">Connectez-vous pour ajouter une actualité.</p>
        ) : null}
      </form>
      <div className="news-banner-add-preview">
        <p>Prévisualisation :</p>
        <NewsBanner
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
