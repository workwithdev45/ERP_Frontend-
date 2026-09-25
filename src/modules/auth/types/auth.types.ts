export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
  portalId: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  tenantId: string;
  tenantName: string;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface UserProfileResponse {
  id: number;
  tenantId: string;
  tenantName: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  status: string;
  roles: string[];
  permissions: string[];
}

export interface ApiErrorResponse {
  error: boolean;
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
  portalId: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
