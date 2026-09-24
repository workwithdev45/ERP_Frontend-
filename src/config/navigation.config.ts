import type { ComponentType } from 'react';
import {
  AppstoreOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  InboxOutlined,
  ClusterOutlined,
  BookOutlined,
  TeamOutlined,
  IdcardOutlined,
  BarChartOutlined,
  SafetyOutlined,
  UsergroupAddOutlined,
  ApartmentOutlined,
  LockOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';

export interface NavItem {
  key: string;
  label: string;
  icon: ComponentType;
  path: string;
  /** Permission name required to see/reach this item (checked via ADMIN-or-authority, matching the backend's @PreAuthorize). Omit for items visible to every signed-in user. */
  permission?: string;
  children?: NavItem[];
}

export const PRIMARY_NAV: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: AppstoreOutlined, path: '/dashboard' },
  { key: 'sales', label: 'Sales', icon: DollarOutlined, path: '/sales', permission: 'SALES_VIEW' },
  { key: 'purchase', label: 'Purchase', icon: ShoppingCartOutlined, path: '/purchase', permission: 'PURCHASE_VIEW' },
  { key: 'inventory', label: 'Inventory', icon: InboxOutlined, path: '/inventory', permission: 'INVENTORY_VIEW' },
  { key: 'production', label: 'Production', icon: ClusterOutlined, path: '/production', permission: 'PRODUCTION_VIEW' },
  { key: 'accounts', label: 'Accounts', icon: BookOutlined, path: '/accounts', permission: 'ACCOUNTS_VIEW' },
  { key: 'crm', label: 'CRM', icon: TeamOutlined, path: '/crm', permission: 'CRM_VIEW' },
  { key: 'hr', label: 'HR & Payroll', icon: IdcardOutlined, path: '/hr', permission: 'HR_VIEW' },
  { key: 'reports', label: 'Reports', icon: BarChartOutlined, path: '/reports', permission: 'REPORTS_VIEW' },
  {
    key: 'administration',
    label: 'Administration',
    icon: SafetyOutlined,
    path: '/settings/users',
    permission: 'USER_MANAGE',
    children: [
      { key: 'admin-members', label: 'Members', icon: UsergroupAddOutlined, path: '/settings/users', permission: 'USER_MANAGE' },
      { key: 'admin-roles', label: 'Roles', icon: ApartmentOutlined, path: '/settings/roles', permission: 'ROLE_MANAGE' },
      { key: 'admin-permissions', label: 'Permissions', icon: LockOutlined, path: '/settings/permissions', permission: 'ROLE_MANAGE' },
    ],
  },
];

export const SECONDARY_NAV: NavItem[] = [{ key: 'help', label: 'Help', icon: QuestionCircleOutlined, path: '/help' }];
