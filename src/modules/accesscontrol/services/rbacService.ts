import { apiClient } from '@/api/apiClient';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import type { ApiResponse } from '@/types/api.types';
import type {
  ModuleCode,
  ModulePermission,
  PermissionAction,
  PermissionDto,
  RoleDto,
  RoleUpsertRequest,
  TenantModuleDto,
} from '../types/rbac.types';

export const rbacService = {
  listRoles: () => apiClient.get<ApiResponse<RoleDto[]>>(API_ENDPOINTS.roles.list),

  createRole: (payload: RoleUpsertRequest) =>
    apiClient.post<ApiResponse<RoleDto>>(API_ENDPOINTS.roles.list, payload),

  updateRole: (id: number, payload: RoleUpsertRequest) =>
    apiClient.put<ApiResponse<RoleDto>>(API_ENDPOINTS.roles.byId(id), payload),

  deleteRole: (id: number) => apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.roles.byId(id)),

  listPermissions: () => apiClient.get<ApiResponse<PermissionDto[]>>(API_ENDPOINTS.permissions.list),

  listModules: () => apiClient.get<ApiResponse<ModuleCode[]>>(API_ENDPOINTS.modules.list),

  listActions: () => apiClient.get<ApiResponse<PermissionAction[]>>(API_ENDPOINTS.modules.actions),

  getUserPermissions: (userId: number) =>
    apiClient.get<ApiResponse<ModulePermission[]>>(API_ENDPOINTS.users.permissions(userId)),

  assignModulePermission: (userId: number, moduleCode: ModuleCode, actions: PermissionAction[]) =>
    apiClient.put<ApiResponse<ModulePermission>>(API_ENDPOINTS.users.modulePermission(userId, moduleCode), {
      actions,
    }),

  revokeModulePermission: (userId: number, moduleCode: ModuleCode) =>
    apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.users.modulePermission(userId, moduleCode)),

  getRolePermissions: (roleId: number) =>
    apiClient.get<ApiResponse<ModulePermission[]>>(API_ENDPOINTS.roles.permissions(roleId)),

  assignRoleModulePermission: (roleId: number, moduleCode: ModuleCode, actions: PermissionAction[]) =>
    apiClient.put<ApiResponse<ModulePermission>>(API_ENDPOINTS.roles.modulePermission(roleId, moduleCode), {
      actions,
    }),

  revokeRoleModulePermission: (roleId: number, moduleCode: ModuleCode) =>
    apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.roles.modulePermission(roleId, moduleCode)),

  getEnabledModules: () => apiClient.get<ApiResponse<TenantModuleDto[]>>(API_ENDPOINTS.modules.enabled),

  setModuleEnabled: (moduleCode: ModuleCode, enabled: boolean) =>
    apiClient.put<ApiResponse<TenantModuleDto>>(API_ENDPOINTS.modules.setEnabled(moduleCode), { enabled }),
};
