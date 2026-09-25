import {
  AppstoreOutlined,
  AccountBookOutlined,
  BankOutlined,
  BarChartOutlined,
  BuildOutlined,
  InboxOutlined,
  QuestionCircleOutlined,
  RiseOutlined,
  KeyOutlined,
  SafetyCertificateOutlined,
  ShoppingCartOutlined,
  SolutionOutlined,
  TeamOutlined,
  ToolOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ModuleCode } from '@/modules/accesscontrol/types/rbac.types';

/** Any Ant Design icon component (they all share one type). */
export type NavIcon = typeof AppstoreOutlined;

export interface NavItem {
  key: string;
  label: string;
  icon: NavIcon;
  path: string;
  /** Permission needed to see this item (ADMIN always can, matching the backend's @PreAuthorize). Omit for items every signed-in user sees. */
  permission?: string;
  /** G14: hidden when this tenant has switched the module off, regardless of permission. */
  module?: ModuleCode;
}

export interface NavSection {
  key: string;
  label: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    key: 'overview',
    label: 'Overview',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: AppstoreOutlined, path: '/dashboard' },
      { key: 'reports', label: 'Reports', icon: BarChartOutlined, path: '/reports', permission: 'REPORTS_VIEW', module: 'REPORTS' },
    ],
  },
  {
    key: 'operations',
    label: 'Operations',
    items: [
      { key: 'sales', label: 'Sales', icon: RiseOutlined, path: '/sales', permission: 'SALES_VIEW', module: 'SALES' },
      { key: 'purchase', label: 'Purchase', icon: ShoppingCartOutlined, path: '/purchase', permission: 'PURCHASE_VIEW', module: 'PURCHASE' },
      { key: 'inventory', label: 'Inventory', icon: InboxOutlined, path: '/inventory', permission: 'INVENTORY_VIEW', module: 'INVENTORY' },
      { key: 'production', label: 'Production', icon: BuildOutlined, path: '/production', permission: 'PRODUCTION_VIEW', module: 'PRODUCTION' },
    ],
  },
  {
    key: 'finance',
    label: 'Finance & People',
    items: [
      { key: 'accounts', label: 'Accounts', icon: AccountBookOutlined, path: '/accounts', permission: 'ACCOUNTS_VIEW', module: 'ACCOUNTS' },
      { key: 'crm', label: 'CRM', icon: SolutionOutlined, path: '/crm', permission: 'CRM_VIEW', module: 'CRM' },
      { key: 'hr', label: 'HR & Payroll', icon: TeamOutlined, path: '/hr', permission: 'HR_VIEW', module: 'HR' },
    ],
  },
  {
    key: 'admin',
    label: 'Administration',
    items: [
      { key: 'members', label: 'Members', icon: UserOutlined, path: '/settings/users', permission: 'USER_MANAGE' },
      { key: 'roles', label: 'Roles', icon: SafetyCertificateOutlined, path: '/settings/roles', permission: 'ROLE_MANAGE' },
      { key: 'permissions', label: 'Permissions', icon: KeyOutlined, path: '/settings/permissions', permission: 'ROLE_MANAGE' },
      { key: 'company', label: 'Company', icon: BankOutlined, path: '/settings/company', permission: 'SETTINGS_MANAGE' },
      { key: 'modules', label: 'Modules', icon: ToolOutlined, path: '/settings/modules', permission: 'SETTINGS_MANAGE' },
    ],
  },
];

export const PRIMARY_NAV: NavItem[] = NAV_SECTIONS.flatMap((section) => section.items);

export const SECONDARY_NAV: NavItem[] = [{ key: 'help', label: 'Help & Support', icon: QuestionCircleOutlined, path: '/help' }];

/** The nav entry that owns a pathname: exact match first, then the longest path prefix (`/settings/users/12` → Members). */
export function findNavItem(pathname: string): NavItem | undefined {
  return [...PRIMARY_NAV, ...SECONDARY_NAV]
    .filter((item) => pathname === item.path || pathname.startsWith(`${item.path}/`))
    .sort((a, b) => b.path.length - a.path.length)[0];
}
