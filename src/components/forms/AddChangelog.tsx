import { useMemo, useState } from 'react';
import type { Changelog } from '../../helpers/types/Changelog';
import '../../styles/components/forms/addChangelogForm.scss';
import dayjs from 'dayjs';

interface AddChangelogProps {
  onChangelogAdded: () => void;
}

export const AddChangelog = ({ onChangelogAdded }: AddChangelogProps) => {
  const [version, setVersion] = useState('');
  const [versionName, setVersionName] = useState('');
  const [date, setDate] = useState(() => {
    const now = new Date();
    now.setSeconds(0, 0);
    return now.toISOString().slice(0, 16);
  });
  const [breaking, setBreaking] = useState(false);
  const [visible, setVisible] = useState(true);
  const [changes, setChanges] = useState<string[]>(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsSubmitting(true);
    const payload: Partial<Changelog> = {
      version: version.trim(),
      version_name: versionName.trim(),
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
      breaking,
      changes: changes
        .map((change) => change.trim())
        .filter((change) => change.length > 0),
      visible,
    };

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/changelog/app/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error('Error submitting changelog:', error);
    }finally {
      setIsSubmitting(false);
      onChangelogAdded();
    }
  };

  const handleChangeUpdate = (index: number, value: string) => {
    setChanges((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleAddChange = () => {
    setChanges((prev) => [...prev, '']);
  };

  const handleRemoveChange = (index: number) => {
    setChanges((prev) => {
      if (prev.length === 1) {
        return [''];
      }

      return prev.filter((_, changeIndex) => changeIndex !== index);
    });
  };

  const previewChangelog = useMemo<Partial<Changelog>>(() => {
    const safeDate = date ? new Date(date).toISOString() : new Date().toISOString();

    return {
      version: version || '1.0.0',
      version_name: versionName || 'Nom de la version',
      date: safeDate,
      breaking,
      changes: changes.filter((change) => change.trim().length > 0),
      visible,
    };
  }, [breaking, changes, date, version, versionName, visible]);

  return (
    <div className="changelog-add">
      <form className="changelog-add-form" onSubmit={handleSubmit}>
        <input
          required
          type="text"
          placeholder="Version (ex: 1.2.3)"
          value={version}
          onChange={(event) => setVersion(event.target.value)}
        />
        <input
          type="text"
          placeholder="Nom de la version"
          value={versionName}
          onChange={(event) => setVersionName(event.target.value)}
        />
        <input
          required
          type="datetime-local"
          placeholder="Date de publication"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={breaking}
              onChange={(event) => setBreaking(event.target.checked)}
            />
            Contient des changements majeurs (breaking)
          </label>
          <label>
            <input
              type="checkbox"
              checked={visible}
              onChange={(event) => setVisible(event.target.checked)}
            />
            Visible immédiatement
          </label>
        </div>
        <div className="changes-group">
          <p>Changements</p>
          {changes.map((change, index) => (
            <div key={`change-${index}`} className="change-item">
              <textarea
                placeholder="Décrivez un changement"
                value={change}
                onChange={(event) => handleChangeUpdate(index, event.target.value)}
                rows={2}
              />
              <button
                type="button"
                className="remove-change"
                onClick={() => handleRemoveChange(index)}
                aria-label={`Remove change ${index + 1}`}
              >
                &times;
              </button>
            </div>
          ))}
          <button type="button" className="add-change" onClick={handleAddChange}>
            + Ajouter un changement
          </button>
        </div>
        <button disabled={isSubmitting} type="submit">{isSubmitting ? 'En cours...' : 'Ajouter'}</button>
      </form>
      <div className="changelog-add-preview">
        <p>Prévisualisation :</p>
        <div className="changelog-preview-card">
          <header>
            <span className="version">{previewChangelog.version}</span>
            <span className="version-name">{previewChangelog.version_name}</span>
            {previewChangelog.breaking && <span className="breaking-badge">Breaking</span>}
          </header>
          <time dateTime={previewChangelog.date}>
            {dayjs(previewChangelog.date).format('DD/MM/YYYY HH:mm')}
          </time>
          <ul>
            {previewChangelog.changes && previewChangelog.changes.length > 0 ? (
              previewChangelog.changes.map((change, index) => (
                <li key={`preview-change-${index}`}>{change}</li>
              ))
            ) : (
              <li>Ajoutez vos changements pour voir un aperçu</li>
            )}
          </ul>
          <footer>
            <span>Visible : {previewChangelog.visible ? 'Oui' : 'Non'}</span>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AddChangelog;
