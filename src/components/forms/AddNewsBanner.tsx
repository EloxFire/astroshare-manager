import { useState } from 'react';
import '../../styles/components/forms/addNewsBannerForm.scss';
import { NewsBanner } from '../cards/NewsBanner';

const AddNewsBanner = () => {

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkType, setLinkType] = useState('internal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ title, content, imageUrl, linkType });
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
        <button type="submit">Ajouter</button>
      </form>
      <div className="news-banner-add-preview">
        <NewsBanner title={title} content={content} imageUrl={imageUrl} />
      </div>
    </div>
  )
}

export default AddNewsBanner;