import type { NavIcon } from '@/config/navigation.config';

export type StatTone = 'default' | 'danger' | 'warning' | 'success';

export interface StatCardData {
  key: string;
  label: string;
  value: string;
  suffix?: string;
  trend?: string;
  trendDirection?: 'up' | 'down';
  hint?: string;
  icon?: NavIcon;
  tone?: StatTone;
}

export interface RecentOrderEntry {
  id: string;
  reference: string;
  customerName: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface TopSellingProduct {
  id: string;
  name: string;
  unitsSold: number;
  revenue: string;
}

export interface AdminTask {
  id: string;
  label: string;
  note: string;
  overdue?: boolean;
}

export interface SalesTrendPoint {
  day: string;
  value: number;
}
