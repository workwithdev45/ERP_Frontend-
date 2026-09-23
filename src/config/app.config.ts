export const APP_CONFIG = {
  appName: 'MSME ERP',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1',
  portalDomain: import.meta.env.VITE_PORTAL_DOMAIN ?? 'msmeerp.com',
  otpLength: 4,
  otpExpirySeconds: 600,
  otpResendCooldownSeconds: 30,
} as const;
