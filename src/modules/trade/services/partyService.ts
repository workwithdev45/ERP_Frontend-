import { apiClient } from '@/api/apiClient';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import type { ApiResponse } from '@/types/api.types';
import type { Party, PartyRequest, PartyType } from '../types/trade.types';

export const partyService = {
  /** CUSTOMER/VENDOR also return parties marked BOTH. */
  list: (type?: PartyType) =>
    apiClient.get<ApiResponse<Party[]>>(API_ENDPOINTS.parties.list, { params: type ? { type } : undefined }),

  get: (id: number) => apiClient.get<ApiResponse<Party>>(API_ENDPOINTS.parties.byId(id)),

  create: (payload: PartyRequest) => apiClient.post<ApiResponse<Party>>(API_ENDPOINTS.parties.list, payload),

  update: (id: number, payload: PartyRequest) => apiClient.put<ApiResponse<Party>>(API_ENDPOINTS.parties.byId(id), payload),
};
