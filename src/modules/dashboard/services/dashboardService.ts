import type { AdminTask, RecentOrderEntry, StatCardData, TopSellingProduct } from '../types/dashboard.types';

export const DASHBOARD_STATS: StatCardData[] = [
  { key: 'total-sales', label: 'Total Sales (MTD)', value: '₹8,42,500', trend: '↗12.4%' },
  { key: 'open-orders', label: 'Open Sales Orders', value: '34' },
  { key: 'purchase-due', label: 'Purchase Bills Due', value: '9', tone: 'danger' },
  { key: 'low-stock', label: 'Low Stock Items', value: '17', tone: 'danger' },
  { key: 'inventory-value', label: 'Inventory Value', value: '₹21,60,000' },
  { key: 'receivables', label: 'Receivables', value: '₹3,12,400' },
];

export const RECENT_ORDERS: RecentOrderEntry[] = [
  { id: 'ord-1', reference: 'SO-1042', customerName: 'Sharma Traders', amount: '₹48,200', status: 'Paid' },
  { id: 'ord-2', reference: 'SO-1041', customerName: 'Verma Textiles', amount: '₹22,900', status: 'Pending' },
  { id: 'ord-3', reference: 'SO-1040', customerName: 'Gupta Hardware', amount: '₹67,500', status: 'Overdue' },
  { id: 'ord-4', reference: 'SO-1039', customerName: 'Patel Distributors', amount: '₹15,300', status: 'Paid' },
];

export const TOP_SELLING_PRODUCTS: TopSellingProduct[] = [
  { id: 'prod-1', name: 'Steel Rod 12mm', unitsSold: 480, revenue: '₹2,88,000' },
  { id: 'prod-2', name: 'Cement Bag 50kg', unitsSold: 320, revenue: '₹1,44,000' },
  { id: 'prod-3', name: 'Paint 20L', unitsSold: 120, revenue: '₹96,000' },
];

export const PENDING_TASKS: AdminTask[] = [
  { id: 'task-1', label: 'Approve pending purchase order PO-208', note: 'Due Today' },
  { id: 'task-2', label: 'Review low-stock reorder alerts', note: 'Overdue', overdue: true },
  { id: 'task-3', label: 'Reconcile last week’s bank statement', note: 'Due Tomorrow' },
];

export const SALES_TREND = [
  { day: 'Mon', value: 38 },
  { day: 'Tue', value: 46 },
  { day: 'Wed', value: 29 },
  { day: 'Thu', value: 58 },
  { day: 'Fri', value: 50 },
  { day: 'Sat', value: 68 },
  { day: 'Sun', value: 74 },
];
