import type { User } from './types/User';

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user?: User;
  [key: string]: unknown;
};

const env = import.meta.env as Record<string, string | undefined>;

export const API_BASE_URL =
  env?.VITE_API_URL ??
  env?.API_URL ??
  'http://localhost:3001';

const ABSOLUTE_URL_REGEX = /^https?:\/\//i;

const resolvePath = (pathOrUrl: string) => {
  if (ABSOLUTE_URL_REGEX.test(pathOrUrl)) {
    return pathOrUrl;
  }

  const trimmedBase = API_BASE_URL.replace(/\/$/, '');
  const normalisedPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;

  return `${trimmedBase}${normalisedPath}`;
};

export const resolveApiUrl = resolvePath;

export async function parseJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const message =
      (data && (data.message as string | undefined)) ??
      (data && (data.error as string | undefined)) ??
      `Requête échouée (${response.status})`;
    throw new Error(message);
  }

  return data as T;
}

export async function fetchWithAuth(
  pathOrUrl: string,
  accessToken: string,
  init: RequestInit = {},
): Promise<Response> {
  if (!accessToken) {
    throw new Error("Jeton d'accès manquant.");
  }

  const headers = new Headers(init.headers ?? undefined);
  headers.set('Authorization', `Bearer ${accessToken}`);

  return fetch(resolvePath(pathOrUrl), {
    ...init,
    headers,
  });
}

export async function fetchJsonWithAuth<T>(
  pathOrUrl: string,
  accessToken: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetchWithAuth(pathOrUrl, accessToken, init);
  return parseJsonResponse<T>(response);
}

export async function loginRequest(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await parseJsonResponse<AuthResponse>(response);

  if (!data?.accessToken) {
    throw new Error("Jeton d'authentification manquant dans la réponse.");
  }

  return data;
}

export async function refreshTokenRequest(refreshToken: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await parseJsonResponse<AuthResponse>(response);

  if (!data?.accessToken) {
    throw new Error("Impossible de rafraîchir le jeton d'authentification.");
  }

  return data;
}
