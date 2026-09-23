import { BadgeText } from '@/components/common/Badge/Badge';
import type { PermissionAction } from '../types/rbac.types';

export function PermissionBadge({ action }: { action: PermissionAction }) {
  return <BadgeText tone={action === 'DELETE' ? 'danger' : 'neutral'}>{action}</BadgeText>;
}
