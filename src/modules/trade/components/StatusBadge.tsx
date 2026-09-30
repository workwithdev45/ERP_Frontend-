import { BadgeText } from '@/components/common/Badge/Badge';
import type { DocStatus } from '../types/trade.types';
import { statusLabel, statusTone } from '../utils/format';

export function StatusBadge({ status }: { status: DocStatus }) {
  return <BadgeText tone={statusTone(status)}>{statusLabel(status)}</BadgeText>;
}
