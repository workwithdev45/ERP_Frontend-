import axios from 'axios';
import { APP_CONFIG } from '@/config/app.config';
import { installAuthInterceptor } from './axiosInterceptor';
import { installTenantInterceptor } from './tenantInterceptor';

export const apiClient = axios.create({
  baseURL: APP_CONFIG.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

installTenantInterceptor(apiClient);
installAuthInterceptor(apiClient);
