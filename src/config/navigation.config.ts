export interface NavItem {
  key: string;
  label: string;
  icon: string;
  path: string;
}

export const PRIMARY_NAV: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: '▦', path: '/dashboard' },
  { key: 'patients', label: 'Patients', icon: '◍', path: '/patients' },
  { key: 'appointments', label: 'Appointments', icon: '▤', path: '/appointments' },
  { key: 'opd', label: 'OPD', icon: '⚕', path: '/opd' },
  { key: 'ipd', label: 'IPD', icon: '🛏', path: '/ipd' },
  { key: 'emergency', label: 'Emergency', icon: '✳', path: '/emergency' },
  { key: 'bed-management', label: 'Bed Management', icon: '⬒', path: '/bed-management' },
  { key: 'clinical', label: 'Clinical', icon: '🩺', path: '/clinical' },
  { key: 'diagnostics', label: 'Diagnostics', icon: '🔬', path: '/diagnostics' },
  { key: 'pharmacy', label: 'Pharmacy', icon: '💊', path: '/pharmacy' },
  { key: 'billing', label: 'Billing', icon: '💳', path: '/billing' },
  { key: 'insurance', label: 'Insurance', icon: '🛡', path: '/insurance' },
  { key: 'administration', label: 'Administration', icon: '⚙', path: '/administration' },
  { key: 'reports', label: 'Reports', icon: '📊', path: '/reports' },
  { key: 'settings', label: 'Settings', icon: '⚙', path: '/settings' },
];

export const SECONDARY_NAV: NavItem[] = [{ key: 'help', label: 'Help', icon: '❓', path: '/help' }];
