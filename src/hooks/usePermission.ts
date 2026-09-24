import { useAuth } from '@/context/AuthContext';
import { canAccess, hasAnyPermission, hasPermission, hasRole } from '@/utils/permissions';

export function usePermission() {
  const { session } = useAuth();

  return {
    hasRole: (role: string) => hasRole(session, role),
    hasPermission: (permission: string) => hasPermission(session, permission),
    hasAnyPermission: (permissions: string[]) => hasAnyPermission(session, permissions),
    canAccess: (permission: string) => canAccess(session, permission),
  };
}
