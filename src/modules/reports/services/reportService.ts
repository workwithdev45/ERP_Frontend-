import { apiClient } from '@/api/apiClient';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import type { ApiResponse } from '@/types/api.types';
import type { DashboardSummary, Register, StockValuation } from '../types/report.types';

const E = API_ENDPOINTS.reports;

export const reportService = {
  dashboard: () => apiClient.get<ApiResponse<DashboardSummary>>(E.dashboard),
  salesRegister: (from: string, to: string) => apiClient.get<ApiResponse<Register>>(E.salesRegister, { params: { from, to } }),
  purchaseRegister: (from: string, to: string) => apiClient.get<ApiResponse<Register>>(E.purchaseRegister, { params: { from, to } }),
  stockValuation: () => apiClient.get<ApiResponse<StockValuation>>(E.stockValuation),
};
