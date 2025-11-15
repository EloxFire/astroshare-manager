import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import type { User } from '../helpers/types/User';

const AuthContext = createContext<any>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const logoutUser = useCallback(() => {
    setCurrentUser(null);
  }, []);

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

  const value = {
    currentUser,
    loginUser,
    logoutUser,
    refreshToken,
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
