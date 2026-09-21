export const ROUTE_PATHS = {
  onboarding: {
    root: '/onboarding',
    getStarted: '/onboarding',
    register: '/onboarding/register',
    verifyOtp: '/onboarding/verify-otp',
    claimPortal: '/onboarding/claim-portal',
    setPassword: '/onboarding/set-password',
    success: '/onboarding/success',
    findHospital: '/onboarding/find-hospital',
  },
  auth: {
    login: '/login',
  },
  dashboard: '/dashboard',
} as const;
