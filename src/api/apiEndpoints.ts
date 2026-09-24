export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    me: '/auth/me',
    refreshToken: '/auth/refresh-token',
  },
  companies: {
    register: '/companies/register',
    verifyOtp: '/companies/verify-otp',
    checkPortalId: (portalId: string) => `/companies/check-portal-id/${portalId}`,
    reservePortal: '/companies/reserve-portal',
    setAdminPassword: '/companies/set-admin-password',
    find: '/companies/find',
  },
  users: {
    list: '/users',
    byId: (id: number) => `/users/${id}`,
    invite: '/users/invite',
    acceptInvite: '/users/accept-invite',
    permissions: (userId: number) => `/users/${userId}/permissions`,
    modulePermission: (userId: number, moduleCode: string) => `/users/${userId}/permissions/${moduleCode}`,
  },
  roles: {
    list: '/roles',
    byId: (id: number) => `/roles/${id}`,
    permissions: (roleId: number) => `/roles/${roleId}/permissions`,
    modulePermission: (roleId: number, moduleCode: string) => `/roles/${roleId}/permissions/${moduleCode}`,
  },
  permissions: {
    list: '/permissions',
    byModule: (module: string) => `/permissions/module/${module}`,
  },
  modules: {
    list: '/modules',
    actions: '/modules/actions',
  },
  warehouses: {
    list: '/warehouses',
    byId: (id: number) => `/warehouses/${id}`,
  },
  stockItems: {
    list: '/stock-items',
    byId: (id: number) => `/stock-items/${id}`,
    lowStock: '/stock-items/low-stock',
  },
  stockBatches: {
    list: '/stock-batches',
    byId: (id: number) => `/stock-batches/${id}`,
    expiringSoon: '/stock-batches/expiring-soon',
  },
  stockMovements: {
    list: '/stock-movements',
  },
  stockTransfers: {
    list: '/stock-transfers',
    byId: (id: number) => `/stock-transfers/${id}`,
    complete: (id: number) => `/stock-transfers/${id}/complete`,
    cancel: (id: number) => `/stock-transfers/${id}/cancel`,
  },
} as const;
