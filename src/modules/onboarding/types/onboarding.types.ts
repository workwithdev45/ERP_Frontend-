export type OnboardingStatus =
  | 'PENDING'
  | 'EMAIL_VERIFIED'
  | 'PORTAL_RESERVED'
  | 'ACTIVE'
  | 'FAILED';

export interface RegisterCompanyRequest {
  adminEmail: string;
  adminPhone?: string;
}

export interface RegisterCompanyResponse {
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

export interface FindCompanyRequest {
  userEmail: string;
}

export interface WorkspaceSummary {
  portalId: string;
  name: string;
}

export interface FindCompanyResponse {
  error: boolean;
  message: string;
  data?: WorkspaceSummary[];
}

export interface ApiErrorResponse {
  error: true;
  message: string;
}
