import { apiClient } from '@/api/apiClient';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import type { ApiResponse } from '@/types/api.types';
import type {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  ResetPasswordRequest,
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

  forgotPassword: ({ email, portalId }: ForgotPasswordRequest) =>
    apiClient.post<ApiResponse<null>>(
      API_ENDPOINTS.auth.forgotPassword,
      { email },
      { headers: { 'X-Tenant-ID': portalId } },
    ),

  resetPassword: (payload: ResetPasswordRequest, portalId: string) =>
    apiClient.post<ApiResponse<null>>(API_ENDPOINTS.auth.resetPassword, payload, {
      headers: portalId ? { 'X-Tenant-ID': portalId } : undefined,
    }),

  changePassword: (payload: ChangePasswordRequest) =>
    apiClient.post<ApiResponse<null>>(API_ENDPOINTS.auth.changePassword, payload),
};
