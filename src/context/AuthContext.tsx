import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { loginRequest, refreshTokenRequest } from '../helpers/api';
import { UserRoles } from '../helpers/types/User';
import type { User } from '../helpers/types/User';

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

type SessionPayload = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

type AuthContextValue = {
  status: AuthStatus;
  accessToken: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: (refreshTokenOverride?: string) => Promise<string>;
};

const SESSION_STORAGE_KEY = 'astroshare_manager_session';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const readStoredSession = (): SessionPayload | null => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SessionPayload) : null;
  } catch (error) {
    console.warn('Impossible de lire la session locale.', error);
    return null;
  }
};

const writeStoredSession = (session: SessionPayload | null) => {
  if (typeof window === 'undefined') return;

  try {
    if (session) {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch (error) {
    console.warn('Impossible de persister la session.', error);
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<AuthStatus>('checking');
  const [session, setSession] = useState<SessionPayload | null>(null);

  const persistSession = useCallback((value: SessionPayload | null) => {
    setSession(value);
    writeStoredSession(value);
  }, []);

  const logout = useCallback(() => {
    persistSession(null);
    setStatus('unauthenticated');
  }, [persistSession]);

  const refreshToken = useCallback(
    async (refreshTokenOverride?: string) => {
      const storedSession = session ?? readStoredSession();
      const refreshTokenValue = refreshTokenOverride ?? storedSession?.refreshToken;

      if (!refreshTokenValue) {
        throw new Error('Aucun jeton disponible pour le rafraîchissement.');
      }

      const existingUser = storedSession?.user;

      if (!existingUser) {
        logout();
        throw new Error('Utilisateur introuvable pour cette session.');
      }

      try {
        const {
          accessToken,
          refreshToken: nextRefreshToken,
          user: refreshedUser,
        } = await refreshTokenRequest(refreshTokenValue);

        const nextUser = refreshedUser ?? existingUser;

        if (!nextUser || nextUser.role !== UserRoles.ADMIN) {
          logout();
          throw new Error('Accès réservé aux administrateurs.');
        }

        persistSession({
          accessToken,
          refreshToken: nextRefreshToken ?? refreshTokenValue,
          user: nextUser,
        });

        setStatus('authenticated');
        return accessToken;
      } catch (error) {
        logout();
        throw error;
      }
    },
    [logout, persistSession, session],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const { accessToken, refreshToken, user } = await loginRequest(email, password);

      if (!user || user.role !== UserRoles.ADMIN) {
        persistSession(null);
        setStatus('unauthenticated');
        throw new Error('Accès réservé aux administrateurs.');
      }

      persistSession({
        accessToken,
        refreshToken,
        user,
      });

      setStatus('authenticated');
    },
    [persistSession],
  );

  useEffect(() => {
    let cancelled = false;

    const bootstrapSession = async () => {
      const storedSession = readStoredSession();

      if (!storedSession) {
        setStatus('unauthenticated');
        return;
      }

      if (!storedSession.user || storedSession.user.role !== UserRoles.ADMIN) {
        persistSession(null);
        setStatus('unauthenticated');
        return;
      }

      persistSession(storedSession);

      try {
        const {
          accessToken,
          refreshToken: nextRefreshToken,
          user: refreshedUser,
        } = await refreshTokenRequest(storedSession.refreshToken);

        if (cancelled) return;

        const nextUser = refreshedUser ?? storedSession.user;

        if (!nextUser || nextUser.role !== UserRoles.ADMIN) {
          throw new Error('Accès réservé aux administrateurs.');
        }

        persistSession({
          accessToken,
          refreshToken: nextRefreshToken ?? storedSession.refreshToken,
          user: nextUser,
        });
        setStatus('authenticated');
      } catch {
        if (cancelled) return;
        persistSession(null);
        setStatus('unauthenticated');
      }
    };

    bootstrapSession();

    return () => {
      cancelled = true;
    };
  }, [persistSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      accessToken: session?.accessToken ?? null,
      user: session?.user ?? null,
      login,
      logout,
      refreshToken,
    }),
    [login, logout, refreshToken, session, status],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider.');
  }

  return context;
};
