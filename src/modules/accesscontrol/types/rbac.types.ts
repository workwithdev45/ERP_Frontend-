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
