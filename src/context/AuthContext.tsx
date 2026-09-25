import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { SESSION_EXPIRED_EVENT } from '@/api/axiosInterceptor';
import type { LoginResponse } from '@/modules/auth/types/auth.types';
import { authStorage, type StoredSession } from '@/utils/authStorage';

interface AuthContextValue {
  session: StoredSession | null;
  isAuthenticated: boolean;
  login: (portalId: string, response: LoginResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<StoredSession | null>(() => authStorage.getSession());

  // G18: a refresh failure (expired/invalid session) clears storage from the axios interceptor,
  // outside React — without this, ProtectedRoute's isAuthenticated check would stay stale and
  // never redirect to /login.
  useEffect(() => {
    function handleSessionExpired() {
      setSession(null);
    }
    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: !!session && !!authStorage.getAccessToken(),
      login: (portalId, response) => {
        authStorage.saveLoginResponse(portalId, response);
        setSession(authStorage.getSession());
      },
      logout: () => {
        authStorage.clear();
        setSession(null);
      },
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
