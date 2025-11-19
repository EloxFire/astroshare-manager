import { useMemo, useState } from 'react';
import type { Category } from '../../helpers/types/Category';
import { useToast } from '../../hooks/useToast';
import '../../styles/components/forms/addCategoryForm.scss';

interface AddCategoryProps {
  onCategoryAdded: () => void;
}

export const AddCategory = ({ onCategoryAdded }: AddCategoryProps) => {
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visible, setVisible] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const previewCategory = useMemo(() => {
    return {
      title: title.trim() || 'Nom de la catégorie',
      description:
        description.trim() || 'Ajoutez une description pour voir un aperçu de la catégorie.',
      visible,
    };
  }, [description, title, visible]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      showToast('Le titre de la catégorie est requis.', { type: 'error' });
      return;
    }

    const payload: Pick<Category, 'title' | 'description' | 'visible'> = {
      title: title.trim(),
      description: description.trim(),
      visible,
    };

    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la catégorie');
      }

      showToast('Catégorie ajoutée.', { type: 'neutral' });
      setTitle('');
      setDescription('');
      setVisible(true);
      onCategoryAdded();
    } catch (error) {
      console.error('[AddCategory] Erreur lors de la création de la catégorie :', error);
      showToast("Impossible d'ajouter la catégorie.", { type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="category-add">
      <form className="category-add-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Titre de la catégorie"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
        <textarea
          placeholder="Description de la catégorie"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
        />
        <label className="visibility-toggle">
          <input
            type="checkbox"
            checked={visible}
            onChange={(event) => setVisible(event.target.checked)}
          />
          Visible immédiatement
        </label>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Ajout en cours…' : 'Ajouter la catégorie'}
        </button>
      </form>
      <div className="category-add-preview">
        <p>Prévisualisation :</p>
        <div className="category-preview-card">
          <header>
            <span className="category-title">{previewCategory.title}</span>
            <span className={`visibility-badge ${previewCategory.visible ? 'is-visible' : 'is-hidden'}`}>
              {previewCategory.visible ? 'Visible' : 'Masquée'}
            </span>
          </header>
          <p className="category-description">{previewCategory.description}</p>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
