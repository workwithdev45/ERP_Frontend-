import { apiClient } from '@/api/apiClient';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import type {
  CheckPortalIdResponse,
  FindCompanyRequest,
  FindCompanyResponse,
  RegisterCompanyRequest,
  RegisterCompanyResponse,
  ReservePortalRequest,
  ReservePortalResponse,
  SetAdminPasswordRequest,
  SetAdminPasswordResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from '../types/onboarding.types';

export const onboardingService = {
  register: (payload: RegisterCompanyRequest) =>
    apiClient.post<RegisterCompanyResponse>(API_ENDPOINTS.companies.register, payload),

  verifyOtp: (payload: VerifyOtpRequest) =>
    apiClient.post<VerifyOtpResponse>(API_ENDPOINTS.companies.verifyOtp, payload),

  checkPortalId: (portalId: string) =>
    apiClient.get<CheckPortalIdResponse>(API_ENDPOINTS.companies.checkPortalId(portalId)),

  reservePortal: (payload: ReservePortalRequest) =>
    apiClient.post<ReservePortalResponse>(API_ENDPOINTS.companies.reservePortal, payload),

  setAdminPassword: (payload: SetAdminPasswordRequest) =>
    apiClient.post<SetAdminPasswordResponse>(API_ENDPOINTS.companies.setAdminPassword, payload),

  find: (payload: FindCompanyRequest) =>
    apiClient.post<FindCompanyResponse>(API_ENDPOINTS.companies.find, payload),
};
