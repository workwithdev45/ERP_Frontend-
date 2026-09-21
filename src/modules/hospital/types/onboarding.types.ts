export type OnboardingStatus =
  | 'PENDING'
  | 'EMAIL_VERIFIED'
  | 'PORTAL_RESERVED'
  | 'ACTIVE'
  | 'FAILED';

export interface RegisterHospitalRequest {
  adminEmail: string;
  adminPhone?: string;
}

export interface RegisterHospitalResponse {
  error: boolean;
  message: string;
  portalId?: string;
}

export interface VerifyOtpRequest {
  adminEmail: string;
  otp: string;
}

export interface VerifyOtpResponse {
  error: boolean;
  message: string;
  registrationToken?: string;
}

export interface CheckPortalIdResponse {
  error: boolean;
  message: string;
  available: boolean;
}

export interface ReservePortalRequest {
  adminEmail: string;
  registrationToken: string;
  portalId: string;
  startBlank: boolean;
}

export interface ReservePortalResponse {
  error: boolean;
  message: string;
}

export interface SetAdminPasswordRequest {
  adminEmail: string;
  portalId: string;
  registrationToken: string;
  adminPassword: string;
}

export interface SetAdminPasswordResponse {
  error: boolean;
  message: string;
  portalUrl?: string;
}

export interface FindHospitalRequest {
  userEmail: string;
}

export interface FindHospitalResponse {
  error: boolean;
  message: string;
}

export interface ApiErrorResponse {
  error: true;
  message: string;
}
