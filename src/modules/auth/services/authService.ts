import { apiClient } from '@/api/apiClient';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import type { ApiResponse } from '@/types/api.types';
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  UserProfileResponse,
} from '../types/auth.types';

export const authService = {
  login: (payload: LoginRequest) =>
    apiClient.post<ApiResponse<LoginResponse>>(API_ENDPOINTS.auth.login, payload, {
      headers: { 'X-Tenant-ID': payload.portalId },
    }),

  me: () => apiClient.get<ApiResponse<UserProfileResponse>>(API_ENDPOINTS.auth.me),

  refreshToken: (payload: RefreshTokenRequest) =>
    apiClient.post<ApiResponse<LoginResponse>>(API_ENDPOINTS.auth.refreshToken, payload),
};
