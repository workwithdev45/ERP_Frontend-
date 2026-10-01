import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { StopOutlined } from '@ant-design/icons';
import { ModulePlaceholder } from '@/components/common/ModulePlaceholder/ModulePlaceholder';
import { usePermission } from '@/hooks/usePermission';
import { rbacService } from '@/modules/accesscontrol/services/rbacService';
import type { ModuleCode } from '@/modules/accesscontrol/types/rbac.types';
import { ROUTE_PATHS } from './routePaths';

interface RoleGuardProps {
  permission: string;
}

const TOGGLEABLE: ModuleCode[] = ['SALES', 'PURCHASE', 'INVENTORY', 'PRODUCTION', 'ACCOUNTS', 'CRM', 'HR'];

function moduleOf(permission: string): ModuleCode | null {
  const code = permission.split('_')[0] as ModuleCode;
  return TOGGLEABLE.includes(code) ? code : null;
}

/**
 * Routes reachable only with `permission` (ADMIN always passes). G14: a module the company has
 * switched off shows a "turned off" page instead — its API refuses requests anyway.
 */
export function RoleGuard({ permission }: RoleGuardProps) {
  const { canAccess } = usePermission();
  const module = moduleOf(permission);
  const [moduleState, setModuleState] = useState<'checking' | 'on' | 'off'>(module ? 'checking' : 'on');

  useEffect(() => {
    if (!module) return;
    let cancelled = false;
    rbacService
      .getEnabledModules()
      .then(({ data }) => {
        if (!cancelled) setModuleState(data.data.some((m) => m.moduleCode === module && !m.enabled) ? 'off' : 'on');
      })
      // If the check fails, fall through to the page — the API still enforces the switch.
      .catch(() => !cancelled && setModuleState('on'));
    return () => {
      cancelled = true;
    };
  }, [module]);

  if (!canAccess(permission)) {
    return <Navigate to={ROUTE_PATHS.dashboard} replace />;
  }
  if (moduleState === 'checking') {
    return null;
  }
  if (moduleState === 'off' && module) {
    const name = module.charAt(0) + module.slice(1).toLowerCase();
    return (
      <ModulePlaceholder
        icon={<StopOutlined />}
        title={`${name} is turned off`}
        description={`Your company has switched the ${name} module off. Data is kept — an admin can switch it back on in Settings → Modules.`}
      />
    );
  }
  return <Outlet />;
}
