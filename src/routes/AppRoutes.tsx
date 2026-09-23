import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoginPage } from '@/modules/auth/pages/LoginPage';
import { AdminDashboardPage } from '@/modules/dashboard/pages/AdminDashboardPage';
import { OnboardingProvider } from '@/modules/onboarding/context/OnboardingContext';
import { GetStartedPage } from '@/modules/onboarding/pages/GetStartedPage';
import { RegisterCompanyPage } from '@/modules/onboarding/pages/RegisterCompanyPage';
import { VerifyOtpPage } from '@/modules/onboarding/pages/VerifyOtpPage';
import { ClaimPortalPage } from '@/modules/onboarding/pages/ClaimPortalPage';
import { SetPasswordPage } from '@/modules/onboarding/pages/SetPasswordPage';
import { OnboardingSuccessPage } from '@/modules/onboarding/pages/OnboardingSuccessPage';
import { FindCompanyPage } from '@/modules/onboarding/pages/FindCompanyPage';
import { AcceptInvitePage } from '@/modules/user/pages/AcceptInvitePage';
import { UsersPage } from '@/modules/user/pages/UsersPage';
import { UserDetailPage } from '@/modules/user/pages/UserDetailPage';
import { RolesPage } from '@/modules/accesscontrol/pages/RolesPage';
import { PermissionsPage } from '@/modules/accesscontrol/pages/PermissionsPage';
import { SalesPage } from '@/modules/sales/pages/SalesPage';
import { PurchasePage } from '@/modules/purchase/pages/PurchasePage';
import { InventoryPage } from '@/modules/inventory/pages/InventoryPage';
import { ProductionPage } from '@/modules/production/pages/ProductionPage';
import { AccountsPage } from '@/modules/accounts/pages/AccountsPage';
import { CrmPage } from '@/modules/crm/pages/CrmPage';
import { HrPage } from '@/modules/hr/pages/HrPage';
import { ReportsPage } from '@/modules/reports/pages/ReportsPage';
import { HelpPage } from '@/modules/dashboard/pages/HelpPage';
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
      { path: 'find-company', element: <FindCompanyPage /> },
      { path: 'register', element: <RegisterCompanyPage /> },
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
    path: ROUTE_PATHS.acceptInvite,
    element: <AcceptInvitePage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: ROUTE_PATHS.dashboard, element: <AdminDashboardPage /> },
          { path: ROUTE_PATHS.sales, element: <SalesPage /> },
          { path: ROUTE_PATHS.purchase, element: <PurchasePage /> },
          { path: ROUTE_PATHS.inventory, element: <InventoryPage /> },
          { path: ROUTE_PATHS.production, element: <ProductionPage /> },
          { path: ROUTE_PATHS.accounts, element: <AccountsPage /> },
          { path: ROUTE_PATHS.crm, element: <CrmPage /> },
          { path: ROUTE_PATHS.hr, element: <HrPage /> },
          { path: ROUTE_PATHS.reports, element: <ReportsPage /> },
          { path: ROUTE_PATHS.help, element: <HelpPage /> },
          { path: ROUTE_PATHS.settings.users, element: <UsersPage /> },
          { path: ROUTE_PATHS.settings.userDetail(':id'), element: <UserDetailPage /> },
          { path: ROUTE_PATHS.settings.roles, element: <RolesPage /> },
          { path: ROUTE_PATHS.settings.permissions, element: <PermissionsPage /> },
        ],
      },
    ],
  },
]);
