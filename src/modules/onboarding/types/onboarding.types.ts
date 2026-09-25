export type OnboardingStatus =
  | 'PENDING'
  | 'EMAIL_VERIFIED'
  | 'PORTAL_RESERVED'
  | 'ACTIVE'
  | 'FAILED';

export interface RegisterCompanyRequest {
  adminEmail: string;
  adminPhone?: string;
  /** G11: required the first time this email registers; a resend doesn't need to resend it. */
  termsAccepted?: boolean;
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
  /** Set when this email already reserved a workspace in an earlier, abandoned signup attempt (G1). */
  existingPortalId?: string;
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
  /** G10: Trader / Manufacturer / Services — presets which modules start enabled. */
  businessType?: string;
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
  /** Present so the client can sign the new admin straight in (G2) instead of sending them to /login. */
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  tenantId?: string;
  tenantName?: string;
  username?: string;
  email?: string;
  roles?: string[];
  permissions?: string[];
}

export interface FindCompanyRequest {
  userEmail: string;
}

/**
 * The backend never reveals whether a workspace matched (G4) — it always returns the same
 * generic message and emails any matches instead.
 */
export interface FindCompanyResponse {
  error: boolean;
  message: string;
}

export interface ApiErrorResponse {
  error: true;
  message: string;
}
