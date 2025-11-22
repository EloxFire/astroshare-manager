import { useEffect, useState } from 'react';
import { Loader } from '../Loader';
import type { Resource } from '../../helpers/types/Resource';
import type { Category } from '../../helpers/types/Category';
import MDEditor from '@uiw/react-md-editor/nohighlight';
import dayjs from 'dayjs';
import { useToast } from '../../hooks/useToast';
import '../../styles/components/forms/addResource.scss';

interface AddResourceProps {
  onResourceAdded: () => void;
}

export const AddResource = ({onResourceAdded}: AddResourceProps) => {

  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visible, setVisible] = useState(true);
  const [level, setLevel] = useState<number | ''>('');
  const [value, setValue] = useState("## Contenu de votre ressource\n\nVous pouvez utiliser le markdown pour formater le contenu de votre ressource.");
  const [pdfUrl, setPdfUrl] = useState('');
  const [memoUrl, setMemoUrl] = useState('');
  const [illustration, setIllustration] = useState('');
  const [fileType, setFileType] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des catégories');
        }
        const data: Category[] = await response.json();
        if (isMounted) {
          setCategories(data);
        }
      } catch (error) {
        if (isMounted) {
          console.error('[AddResource] Erreur lors du chargement des catégories :', error);
          showToast("Impossible de charger les catégories.", { type: 'error' });
        }
      } finally {
        if (isMounted) {
          setIsLoadingCategories(false);
        }
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, [showToast]);

  const handleAddTag = () => {
    const nextTag = tagInput.trim();
    if (!nextTag || tags.includes(nextTag)) return;
    setTags((prev) => [...prev, nextTag]);
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();
    setLoading(true);
    const payload: Partial<Resource> = {
      slug: title.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
      title: title.trim(),
      description: description.trim(),
      visible,
      level: typeof level === 'number' ? level : 1,
      pdfUrl: pdfUrl.trim() !== '' ? pdfUrl.trim() : undefined,
      memoUrl: memoUrl.trim() !== '' ? memoUrl.trim() : undefined,
      illustrationUrl: illustration.trim() !== '' ? illustration.trim() : undefined,
      content: value,
      fileType: fileType.trim() !== '' ? fileType.trim() : undefined,
      category: category,
      subcategory: subcategory.trim() || undefined,
      tags,
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().toISOString(),
    };

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/resources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
        },
        body: JSON.stringify(payload),
      });

      setTitle('');
      setDescription('');
      setVisible(true);
      setLevel('');
      setPdfUrl('');
      setFileType('');
      setCategory('');
      setSubcategory('');
      setIllustration('');
      setMemoUrl('');
      setTags([]);
      setValue("## Contenu de votre ressource\n\nVous pouvez utiliser le markdown pour formater le contenu de votre ressource.");
      setLoading(false);

      onResourceAdded();
      showToast('Ressource ajoutée.', { type: 'neutral' });
    } catch (error) {
      console.log('[AddResource] Erreur lors de l\'ajout de la ressource :', error);
      setLoading(false);
      showToast("Impossible d'ajouter la ressource.", { type: 'error' });
    }
    console.log('[AddResource] Payload à envoyer :', payload, 'Contenu markdown :', value);
  };

  return (
    <div className="resource-add">
      <form className="resource-add-form" onSubmit={handleSubmit}>
        <div className="form-field full-width">
          <label htmlFor="resource-title">Titre</label>
          <input
            type="text"
            id="resource-title"
            placeholder="Entrez le titre de la ressource"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>
        <div className="form-field full-width">
          <label htmlFor="resource-description">Description</label>
          <textarea
            id="resource-description"
            placeholder="Entrez la description de la ressource"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
            rows={3}
          />
        </div>
        <div className="form-field">
          <label htmlFor="resource-download-link">Lien PDF</label>
          <input
            type="url"
            id="resource-download-link"
            placeholder="https://…"
            value={pdfUrl}
            onChange={(event) => setPdfUrl(event.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="resource-memo-link">Lien memo</label>
          <input
            type="url"
            id="resource-memo-link"
            placeholder="https://…"
            value={memoUrl}
            onChange={(event) => setMemoUrl(event.target.value)}
          />
        </div>
        <div className="form-field full-width">
          <label htmlFor="resource-illustration">Illustration</label>
          <input
            type="url"
            id="resource-illustration"
            placeholder="https://…"
            value={illustration}
            onChange={(event) => setIllustration(event.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="resource-file-type">Type de fichier</label>
          <input
            type="text"
            id="resource-file-type"
            placeholder="PDF, ZIP, etc."
            value={fileType}
            onChange={(event) => setFileType(event.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="resource-level">Niveau</label>
          <input
            type="number"
            name="resource-level"
            id="resource-level"
            min="1"
            max="5"
            step="0.5"
            placeholder="1 à 5"
            value={level}
            onChange={(event) => {
              const nextValue = event.target.value;
              setLevel(nextValue === '' ? '' : Number(nextValue));
            }}
          />
        </div>
        <div className="form-field">
          <label htmlFor="resource-category">Catégorie</label>
          <select
            id="resource-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            required
            disabled={isLoadingCategories || categories.length === 0}
          >
            <option value="" disabled>
              {isLoadingCategories
                ? 'Chargement des catégories…'
                : categories.length === 0
                  ? 'Aucune catégorie disponible'
                  : 'Sélectionnez une catégorie'}
            </option>
            {categories.map((categoryItem) => (
              <option key={categoryItem._id} value={categoryItem._id}>
                {categoryItem.title}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="resource-subcategory">Sous-catégorie</label>
          <input
            disabled
            type="text"
            id="resource-subcategory"
            placeholder="(optionnel)"
            value={subcategory}
            onChange={(event) => setSubcategory(event.target.value)}
          />
        </div>
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={visible}
              onChange={(event) => setVisible(event.target.checked)}
            />
            Visible immédiatement
          </label>
        </div>
        <div className="tags-field full-width">
          <label htmlFor="tag-input">Tags</label>
          <div className="tags-input">
            <input
              id="tag-input"
              type="text"
              placeholder="Ajouter un tag"
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <button type="button" onClick={handleAddTag}>
              Ajouter
            </button>
          </div>
          <div className="tags-list">
            {tags.length ? tags.map((tag) => (
              <span key={tag} className="tag-chip">
                {tag}
                <button
                  type="button"
                  className="remove-tag"
                  onClick={() => handleRemoveTag(tag)}
                  aria-label={`Supprimer le tag ${tag}`}
                >
                  ×
                </button>
              </span>
            )) : (
              <span className="tags-placeholder">Aucun tag ajouté pour le moment.</span>
            )}
          </div>
        </div>
        <div className="editor-field full-width">
          <label>Contenu détaillé</label>
          <MDEditor
            value={value}
            onChange={(val) => setValue(val || '')}
            height={400}
          />
        </div>
        <button type="submit" className="full-width submit-button" disabled={loading}>
          {loading ? <Loader size='small'/> : 'Ajouter la ressource'}
        </button>
      </form>
    </div>
  );
};

export default AddResource;
