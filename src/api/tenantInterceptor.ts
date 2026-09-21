import type { AxiosInstance } from 'axios';
import { authStorage } from '@/utils/authStorage';

export function installTenantInterceptor(client: AxiosInstance) {
  client.interceptors.request.use((config) => {
    if (!config.headers?.['X-Tenant-ID']) {
      const portalId = authStorage.getPortalId();
      if (portalId) {
        config.headers.set('X-Tenant-ID', portalId);
      }
    }
    return config;
  });
}
