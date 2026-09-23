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
};
