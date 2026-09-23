import { apiClient } from '@/api/apiClient';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import type { ApiResponse } from '@/types/api.types';
import type { PagedResponse } from '@/types/pagination.types';
import type {
  AcceptUserInviteRequest,
  InviteUserRequest,
  UpdateUserRequest,
  UserSummary,
} from '../types/user.types';

export const userService = {
  list: (page = 0, size = 20) =>
    apiClient.get<ApiResponse<PagedResponse<UserSummary>>>(API_ENDPOINTS.users.list, {
      params: { page, size },
    }),

  getById: (id: number) => apiClient.get<ApiResponse<UserSummary>>(API_ENDPOINTS.users.byId(id)),

  invite: (payload: InviteUserRequest) =>
    apiClient.post<ApiResponse<UserSummary>>(API_ENDPOINTS.users.invite, payload),

  update: (id: number, payload: UpdateUserRequest) =>
    apiClient.put<ApiResponse<UserSummary>>(API_ENDPOINTS.users.byId(id), payload),

  deactivate: (id: number) => apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.users.byId(id)),

  reactivate: (id: number) =>
    apiClient.put<ApiResponse<UserSummary>>(API_ENDPOINTS.users.byId(id), { status: 'ACTIVE' }),

  acceptInvite: (payload: AcceptUserInviteRequest, portalId: string) =>
    apiClient.post<ApiResponse<void>>(API_ENDPOINTS.users.acceptInvite, payload, {
      headers: { 'X-Tenant-ID': portalId },
    }),
};
