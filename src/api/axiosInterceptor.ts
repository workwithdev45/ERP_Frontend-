import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { APP_CONFIG } from '@/config/app.config';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import { authStorage } from '@/utils/authStorage';
import type { ApiResponse } from '@/types/api.types';
import type { LoginResponse } from '@/modules/auth/types/auth.types';

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

let refreshPromise: Promise<string | null> | null = null;

/** G18: fired whenever the session is invalidated so AuthContext can react and redirect to /login. */
export const SESSION_EXPIRED_EVENT = 'auth:session-expired';

function endSession() {
  authStorage.clear();
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = authStorage.getRefreshToken();
  if (!refreshToken) return null;

  try {
    const { data } = await axios.post<ApiResponse<LoginResponse>>(
      `${APP_CONFIG.apiBaseUrl}${API_ENDPOINTS.auth.refreshToken}`,
      { refreshToken },
    );
    authStorage.saveRefreshedTokens(data.data);
    return data.data.accessToken;
  } catch {
    return null;
  }
}

export function installAuthInterceptor(client: AxiosInstance) {
  client.interceptors.request.use((config) => {
    const accessToken = authStorage.getAccessToken();
    if (accessToken) {
      config.headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error.config as RetriableConfig | undefined;
      const isAuthEndpoint =
        config?.url === API_ENDPOINTS.auth.login || config?.url === API_ENDPOINTS.auth.refreshToken;

      if (error.response?.status !== 401 || !config || config._retried || isAuthEndpoint) {
        return Promise.reject(error);
      }

      config._retried = true;
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });

      const newAccessToken = await refreshPromise;
      if (!newAccessToken) {
        // The session can no longer be renewed — clear it and let every open tab/component
        // react (ProtectedRoute redirects once AuthContext's session state clears).
        endSession();
        return Promise.reject(error);
      }

      config.headers.set('Authorization', `Bearer ${newAccessToken}`);
      return client(config);
    },
  );
}
