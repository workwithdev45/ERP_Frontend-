import { BadgeText } from '@/components/common/Badge/Badge';
import type { UserStatus } from '../types/user.types';

const TONE_BY_STATUS: Record<UserStatus, 'success' | 'danger' | 'neutral'> = {
  ACTIVE: 'success',
  PENDING_VERIFICATION: 'neutral',
  SUSPENDED: 'danger',
  INACTIVE: 'danger',
};

export const LABEL_BY_STATUS: Record<UserStatus, string> = {
  ACTIVE: 'Active',
  PENDING_VERIFICATION: 'Invite pending',
  SUSPENDED: 'Suspended',
  INACTIVE: 'Deactivated',
};

export function UserStatusBadge({ status }: { status: UserStatus }) {
  return <BadgeText tone={TONE_BY_STATUS[status]}>{LABEL_BY_STATUS[status]}</BadgeText>;
}
