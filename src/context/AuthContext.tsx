import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { User } from '../helpers/types/User';

const AuthContext = createContext<any>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthReady(true);
  };

  const refreshToken = async () => {
    const refreshToken = await localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error("Aucun jeton de rafraîchissement trouvé.");
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!data?.accessToken) {
      throw new Error("Impossible de rafraîchir le jeton d'authentification.");
    }

    setCurrentUser(data.user);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setIsAuthReady(true);
    return data;
  }

  const loginUser = async (email: string, password: string) => {
    const loginResponse = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await loginResponse.json();

    if (!data?.accessToken) {
      throw new Error("Jeton d'authentification manquant dans la réponse.");
    }

    setCurrentUser(data.user);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  }

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('Checking authentication state...');
      
      const at = localStorage.getItem('accessToken');
      const rt = localStorage.getItem('refreshToken');

      if (!at || !rt) {
        setCurrentUser(null);
        setIsAuthReady(true);
        return;
      }

      try {
        await refreshToken();
        console.log('Token refreshed successfully');
      } catch (error) {
        console.error('Error refreshing token on init:', error);
        logoutUser();
      } finally {
        setIsAuthReady(true);
      }
    };

    initializeAuth();
  }, []);

  const value = {
    currentUser,
    loginUser,
    logoutUser,
    refreshToken,
    isAuthReady,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider.');
  }

  return context;
};
