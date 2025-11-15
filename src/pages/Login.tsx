import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext.tsx';
import { routes } from '../helpers/routes.ts';
import '../styles/pages/login.scss';

export const LoginPage = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    try {
      await loginUser(email, password);
      navigate(routes.home.path, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Connexion impossible. Réessayez.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img
          src="/images/logos/logo_white.svg"
          alt="Logo Astroshare"
          className="login-logo"
        />

        <div className="login-card__header">
          <h1>Connexion</h1>
          <p>Identifiez-vous pour accéder au manager Astroshare.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              autoComplete="email"
              placeholder="admin@astroshare.fr"
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="login-field">
            <span>Mot de passe</span>
            <input
              type="password"
              value={password}
              autoComplete="current-password"
              placeholder="••••••••"
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error ? <p className="login-error">{error}</p> : null}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};
