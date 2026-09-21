export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    me: '/auth/me',
    refreshToken: '/auth/refresh-token',
  },
  hospitals: {
    register: '/hospitals/register',
    verifyOtp: '/hospitals/verify-otp',
    checkPortalId: (portalId: string) => `/hospitals/check-portal-id/${portalId}`,
    reservePortal: '/hospitals/reserve-portal',
    setAdminPassword: '/hospitals/set-admin-password',
    find: '/hospitals/find',
  },
} as const;
