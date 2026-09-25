import { createBrowserRouter, Navigate, Outlet, type RouteObject } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ForgotPasswordPage } from '@/modules/auth/pages/ForgotPasswordPage';
import { LoginPage } from '@/modules/auth/pages/LoginPage';
import { ResetPasswordPage } from '@/modules/auth/pages/ResetPasswordPage';
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
import { LegalPage } from '@/modules/legal/pages/LegalPage';
import { UsersPage } from '@/modules/user/pages/UsersPage';
import { UserDetailPage } from '@/modules/user/pages/UserDetailPage';
import { RolesPage } from '@/modules/accesscontrol/pages/RolesPage';
import { PermissionsPage } from '@/modules/accesscontrol/pages/PermissionsPage';
import { ModulesSettingsPage } from '@/modules/accesscontrol/pages/ModulesSettingsPage';
import { CompanySettingsPage } from '@/modules/company/pages/CompanySettingsPage';
import { ProfilePage } from '@/modules/user/pages/ProfilePage';
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
import { RoleGuard } from './RoleGuard';
import { ROUTE_PATHS } from './routePaths';

/** Routes reachable only with `permission` (ADMIN always passes); others are sent to the dashboard. */
function guarded(permission: string, ...children: RouteObject[]): RouteObject {
  return { element: <RoleGuard permission={permission} />, children };
}

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
      { path: 'claim-workspace', element: <ClaimPortalPage /> },
      { path: 'set-password', element: <SetPasswordPage /> },
      { path: 'success', element: <OnboardingSuccessPage /> },
    ],
  },
  {
    path: ROUTE_PATHS.auth.login,
    element: <LoginPage />,
  },
  {
    path: ROUTE_PATHS.auth.forgotPassword,
    element: <ForgotPasswordPage />,
  },
  {
    path: ROUTE_PATHS.auth.resetPassword,
    element: <ResetPasswordPage />,
  },
  {
    path: ROUTE_PATHS.acceptInvite,
    element: <AcceptInvitePage />,
  },
  {
    path: ROUTE_PATHS.legal.terms,
    element: <LegalPage title="Terms of Service" />,
  },
  {
    path: ROUTE_PATHS.legal.privacy,
    element: <LegalPage title="Privacy Policy" />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: ROUTE_PATHS.dashboard, element: <AdminDashboardPage /> },
          { path: ROUTE_PATHS.help, element: <HelpPage /> },
          { path: ROUTE_PATHS.settings.profile, element: <ProfilePage /> },
          guarded('SALES_VIEW', { path: ROUTE_PATHS.sales, element: <SalesPage /> }),
          guarded('PURCHASE_VIEW', { path: ROUTE_PATHS.purchase, element: <PurchasePage /> }),
          guarded('INVENTORY_VIEW', { path: ROUTE_PATHS.inventory, element: <InventoryPage /> }),
          guarded('PRODUCTION_VIEW', { path: ROUTE_PATHS.production, element: <ProductionPage /> }),
          guarded('ACCOUNTS_VIEW', { path: ROUTE_PATHS.accounts, element: <AccountsPage /> }),
          guarded('CRM_VIEW', { path: ROUTE_PATHS.crm, element: <CrmPage /> }),
          guarded('HR_VIEW', { path: ROUTE_PATHS.hr, element: <HrPage /> }),
          guarded('REPORTS_VIEW', { path: ROUTE_PATHS.reports, element: <ReportsPage /> }),
          guarded(
            'USER_MANAGE',
            { path: ROUTE_PATHS.settings.users, element: <UsersPage /> },
            { path: ROUTE_PATHS.settings.userDetail(':id'), element: <UserDetailPage /> },
          ),
          guarded(
            'ROLE_MANAGE',
            { path: ROUTE_PATHS.settings.roles, element: <RolesPage /> },
            { path: ROUTE_PATHS.settings.permissions, element: <PermissionsPage /> },
          ),
          guarded(
            'SETTINGS_MANAGE',
            { path: ROUTE_PATHS.settings.company, element: <CompanySettingsPage /> },
            { path: ROUTE_PATHS.settings.modules, element: <ModulesSettingsPage /> },
          ),
        ],
      },
    ],
  },
]);
