export type ModuleCode =
  | 'SALES'
  | 'PURCHASE'
  | 'INVENTORY'
  | 'PRODUCTION'
  | 'ACCOUNTS'
  | 'CRM'
  | 'HR'
  | 'REPORTS'
  | 'SETTINGS';

export type PermissionAction = 'VIEW' | 'CREATE' | 'EDIT' | 'DELETE' | 'APPROVE';

export interface PermissionDto {
  id: number;
  name: string;
  module: string;
  description: string;
}

export interface RoleDto {
  id: number;
  name: string;
  description: string;
  systemRole: boolean;
  permissionIds: number[];
  permissionNames: string[];
  userCount: number;
  updatedAt: string;
}

export interface RoleUpsertRequest {
  name: string;
  description?: string;
  systemRole?: boolean;
  permissionIds?: number[];
}

export interface ModulePermission {
  moduleCode: ModuleCode;
  actions: PermissionAction[];
}

/** G14: whether one module is switched on for the current tenant. */
export interface TenantModuleDto {
  moduleCode: ModuleCode;
  enabled: boolean;
}

export const MODULE_LABELS: Record<ModuleCode, string> = {
  SALES: 'Sales',
  PURCHASE: 'Purchase',
  INVENTORY: 'Inventory',
  PRODUCTION: 'Production',
  ACCOUNTS: 'Accounts',
  CRM: 'CRM',
  HR: 'HR',
  REPORTS: 'Reports',
  SETTINGS: 'Settings',
};
