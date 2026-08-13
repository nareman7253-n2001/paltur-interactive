import { useCallback, useEffect, useState } from 'react';

export interface AuthUser {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials?: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AUTH_STORAGE_KEY = 'paltur-auth-user';
const TOKEN_STORAGE_KEY = 'paltur-auth-token';
const AUTH_CHANGED_EVENT = 'paltur-auth-changed';

function getEnv() {
  return (import.meta as unknown as {
    env?: { BASE_URL?: string; VITE_API_BASE_URL?: string };
  }).env;
}

function getBasePath() {
  return (getEnv()?.BASE_URL ?? '/').replace(/\/+$/, '') || '/';
}

function getApiBase() {
  return (getEnv()?.VITE_API_BASE_URL ?? getBasePath()).replace(/\/+$/, '');
}

function getStoredUser(): AuthUser | null {
  try {
    const value = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return value ? (JSON.parse(value) as AuthUser) : null;
  } catch {
    return null;
  }
}

function publishAuthChange() {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const syncStoredAuth = () => setUser(getStoredUser());
    window.addEventListener(AUTH_CHANGED_EVENT, syncStoredAuth);
    setIsLoading(false);
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, syncStoredAuth);
  }, []);

  const login = useCallback(async (credentials?: LoginCredentials) => {
    if (!credentials) {
      window.location.assign(`${getBasePath()}/login`);
      return;
    }

    const response = await fetch(`${getApiBase()}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const payload = await response.json() as {
      id?: string | number;
      Id?: string | number;
      email?: string;
      Email?: string;
      fullName?: string;
      FullName?: string;
      token?: string;
      Token?: string;
    };

    const fullName = payload.fullName ?? payload.FullName ?? credentials.email.split('@')[0];
    const nextUser: AuthUser = {
      id: String(payload.id ?? payload.Id ?? credentials.email),
      email: payload.email ?? payload.Email ?? credentials.email,
      firstName: fullName,
      lastName: null,
      profileImageUrl: null,
    };

    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
    const token = payload.token ?? payload.Token;
    if (token) window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    setUser(nextUser);
    publishAuthChange();
  }, []);

  const logout = useCallback(async () => {
    const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      fetch(`${getApiBase()}/api/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => undefined);
    }
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
    publishAuthChange();
  }, []);

  return { user, isLoading, isAuthenticated: !!user, login, logout };
}
