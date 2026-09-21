import type { LoginResponse } from '@/modules/auth/types/auth.types';

const ACCESS_TOKEN_KEY = 'hms.auth.accessToken';
const REFRESH_TOKEN_KEY = 'hms.auth.refreshToken';
const PORTAL_ID_KEY = 'hms.auth.portalId';
const SESSION_KEY = 'hms.auth.session';

export interface StoredSession {
  tenantId: string;
  tenantName: string;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export const authStorage = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  getPortalId: () => localStorage.getItem(PORTAL_ID_KEY),

  getSession(): StoredSession | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as StoredSession) : null;
    } catch {
      return null;
    }
  },

  saveLoginResponse(portalId: string, response: LoginResponse) {
    localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(PORTAL_ID_KEY, portalId);
    const session: StoredSession = {
      tenantId: response.tenantId,
      tenantName: response.tenantName,
      username: response.username,
      email: response.email,
      roles: response.roles,
      permissions: response.permissions,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },

  saveRefreshedTokens(response: LoginResponse) {
    localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
  },

  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(PORTAL_ID_KEY);
    localStorage.removeItem(SESSION_KEY);
  },
};
