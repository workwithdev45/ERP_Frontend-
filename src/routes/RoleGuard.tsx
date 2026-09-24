import { Navigate, Outlet } from 'react-router-dom';
import { usePermission } from '@/hooks/usePermission';
import { ROUTE_PATHS } from './routePaths';

interface RoleGuardProps {
  permission: string;
}

export function RoleGuard({ permission }: RoleGuardProps) {
  const { canAccess } = usePermission();

  if (!canAccess(permission)) {
    return <Navigate to={ROUTE_PATHS.dashboard} replace />;
  }

  return <Outlet />;
}
