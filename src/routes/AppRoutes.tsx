import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoginPage } from '@/modules/auth/pages/LoginPage';
import { AdminDashboardPage } from '@/modules/dashboard/pages/AdminDashboardPage';
import { OnboardingProvider } from '@/modules/hospital/context/OnboardingContext';
import { GetStartedPage } from '@/modules/hospital/pages/onboarding/GetStartedPage';
import { RegisterHospitalPage } from '@/modules/hospital/pages/onboarding/RegisterHospitalPage';
import { VerifyOtpPage } from '@/modules/hospital/pages/onboarding/VerifyOtpPage';
import { ClaimPortalPage } from '@/modules/hospital/pages/onboarding/ClaimPortalPage';
import { SetPasswordPage } from '@/modules/hospital/pages/onboarding/SetPasswordPage';
import { OnboardingSuccessPage } from '@/modules/hospital/pages/onboarding/OnboardingSuccessPage';
import { FindHospitalPage } from '@/modules/hospital/pages/onboarding/FindHospitalPage';
import { ProtectedRoute } from './ProtectedRoute';
import { ROUTE_PATHS } from './routePaths';

function OnboardingLayoutRoute() {
  return (
    <OnboardingProvider>
      <Outlet />
    </OnboardingProvider>
  );
}

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={ROUTE_PATHS.onboarding.getStarted} replace />,
  },
  {
    path: ROUTE_PATHS.onboarding.root,
    element: <OnboardingLayoutRoute />,
    children: [
      { index: true, element: <GetStartedPage /> },
      { path: 'find-hospital', element: <FindHospitalPage /> },
      { path: 'register', element: <RegisterHospitalPage /> },
      { path: 'verify-otp', element: <VerifyOtpPage /> },
      { path: 'claim-portal', element: <ClaimPortalPage /> },
      { path: 'set-password', element: <SetPasswordPage /> },
      { path: 'success', element: <OnboardingSuccessPage /> },
    ],
  },
  {
    path: ROUTE_PATHS.auth.login,
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [{ path: ROUTE_PATHS.dashboard, element: <AdminDashboardPage /> }],
      },
    ],
  },
]);
