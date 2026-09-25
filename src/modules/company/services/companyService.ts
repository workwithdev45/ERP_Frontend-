import { apiClient } from '@/api/apiClient';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import type { ApiResponse } from '@/types/api.types';
import type { CompanyDetails, CompanyDetailsUpdateRequest } from '../types/company.types';

export const companyService = {
  get: () => apiClient.get<ApiResponse<CompanyDetails>>(API_ENDPOINTS.company.get),

  update: (payload: CompanyDetailsUpdateRequest) =>
    apiClient.put<ApiResponse<CompanyDetails>>(API_ENDPOINTS.company.update, payload),
};
