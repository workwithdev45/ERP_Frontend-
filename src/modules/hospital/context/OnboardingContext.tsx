import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

interface OnboardingState {
  adminEmail: string;
  adminPhone: string;
  registrationToken: string;
  portalId: string;
  startBlank: boolean;
  portalUrl: string;
}

interface OnboardingContextValue extends OnboardingState {
  setAdminContact: (email: string, phone: string) => void;
  setRegistrationToken: (token: string) => void;
  setPortal: (portalId: string, startBlank: boolean) => void;
  setPortalUrl: (portalUrl: string) => void;
  reset: () => void;
}

const initialState: OnboardingState = {
  adminEmail: '',
  adminPhone: '',
  registrationToken: '',
  portalId: '',
  startBlank: false,
  portalUrl: '',
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(initialState);

  const value = useMemo<OnboardingContextValue>(
    () => ({
      ...state,
      setAdminContact: (adminEmail, adminPhone) =>
        setState((prev) => ({ ...prev, adminEmail, adminPhone })),
      setRegistrationToken: (registrationToken) =>
        setState((prev) => ({ ...prev, registrationToken })),
      setPortal: (portalId, startBlank) =>
        setState((prev) => ({ ...prev, portalId, startBlank })),
      setPortalUrl: (portalUrl) => setState((prev) => ({ ...prev, portalUrl })),
      reset: () => setState(initialState),
    }),
    [state],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return ctx;
}
