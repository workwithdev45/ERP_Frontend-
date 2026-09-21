import { apiClient } from '@/api/apiClient';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import type {
  CheckPortalIdResponse,
  FindHospitalRequest,
  FindHospitalResponse,
  RegisterHospitalRequest,
  RegisterHospitalResponse,
  ReservePortalRequest,
  ReservePortalResponse,
  SetAdminPasswordRequest,
  SetAdminPasswordResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from '../types/onboarding.types';

export const onboardingService = {
  register: (payload: RegisterHospitalRequest) =>
    apiClient.post<RegisterHospitalResponse>(API_ENDPOINTS.hospitals.register, payload),

  verifyOtp: (payload: VerifyOtpRequest) =>
    apiClient.post<VerifyOtpResponse>(API_ENDPOINTS.hospitals.verifyOtp, payload),

  checkPortalId: (portalId: string) =>
    apiClient.get<CheckPortalIdResponse>(API_ENDPOINTS.hospitals.checkPortalId(portalId)),

  reservePortal: (payload: ReservePortalRequest) =>
    apiClient.post<ReservePortalResponse>(API_ENDPOINTS.hospitals.reservePortal, payload),

  setAdminPassword: (payload: SetAdminPasswordRequest) =>
    apiClient.post<SetAdminPasswordResponse>(API_ENDPOINTS.hospitals.setAdminPassword, payload),

  find: (payload: FindHospitalRequest) =>
    apiClient.post<FindHospitalResponse>(API_ENDPOINTS.hospitals.find, payload),
};
