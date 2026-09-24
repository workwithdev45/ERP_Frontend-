import {
  AppstoreOutlined,
  AccountBookOutlined,
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
  UserOutlined,
} from '@ant-design/icons';

/** Any Ant Design icon component (they all share one type). */
export type NavIcon = typeof AppstoreOutlined;

export interface NavItem {
  key: string;
  label: string;
  icon: NavIcon;
  path: string;
  /** Permission needed to see this item (ADMIN always can, matching the backend's @PreAuthorize). Omit for items every signed-in user sees. */
  permission?: string;
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
      { key: 'reports', label: 'Reports', icon: BarChartOutlined, path: '/reports', permission: 'REPORTS_VIEW' },
    ],
  },
  {
    key: 'operations',
    label: 'Operations',
    items: [
      { key: 'sales', label: 'Sales', icon: RiseOutlined, path: '/sales', permission: 'SALES_VIEW' },
      { key: 'purchase', label: 'Purchase', icon: ShoppingCartOutlined, path: '/purchase', permission: 'PURCHASE_VIEW' },
      { key: 'inventory', label: 'Inventory', icon: InboxOutlined, path: '/inventory', permission: 'INVENTORY_VIEW' },
      { key: 'production', label: 'Production', icon: BuildOutlined, path: '/production', permission: 'PRODUCTION_VIEW' },
    ],
  },
  {
    key: 'finance',
    label: 'Finance & People',
    items: [
      { key: 'accounts', label: 'Accounts', icon: AccountBookOutlined, path: '/accounts', permission: 'ACCOUNTS_VIEW' },
      { key: 'crm', label: 'CRM', icon: SolutionOutlined, path: '/crm', permission: 'CRM_VIEW' },
      { key: 'hr', label: 'HR & Payroll', icon: TeamOutlined, path: '/hr', permission: 'HR_VIEW' },
    ],
  },
  {
    key: 'admin',
    label: 'Administration',
    items: [
      { key: 'members', label: 'Members', icon: UserOutlined, path: '/settings/users', permission: 'USER_MANAGE' },
      { key: 'roles', label: 'Roles', icon: SafetyCertificateOutlined, path: '/settings/roles', permission: 'ROLE_MANAGE' },
      { key: 'permissions', label: 'Permissions', icon: KeyOutlined, path: '/settings/permissions', permission: 'ROLE_MANAGE' },
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
