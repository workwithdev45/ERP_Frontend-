export interface NavItem {
  key: string;
  label: string;
  icon: string;
  path: string;
}

export const PRIMARY_NAV: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: '▦', path: '/dashboard' },
  { key: 'sales', label: 'Sales', icon: '💰', path: '/sales' },
  { key: 'purchase', label: 'Purchase', icon: '🛒', path: '/purchase' },
  { key: 'inventory', label: 'Inventory', icon: '📦', path: '/inventory' },
  { key: 'production', label: 'Production', icon: '🏭', path: '/production' },
  { key: 'accounts', label: 'Accounts', icon: '📒', path: '/accounts' },
  { key: 'crm', label: 'CRM', icon: '🤝', path: '/crm' },
  { key: 'hr', label: 'HR & Payroll', icon: '🧑‍💼', path: '/hr' },
  { key: 'reports', label: 'Reports', icon: '📊', path: '/reports' },
  { key: 'settings', label: 'Settings', icon: '⚙', path: '/settings/users' },
];

export const SECONDARY_NAV: NavItem[] = [{ key: 'help', label: 'Help', icon: '❓', path: '/help' }];
