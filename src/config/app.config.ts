export const APP_CONFIG = {
  appName: 'MSME ERP',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1',
  portalDomain: import.meta.env.VITE_PORTAL_DOMAIN ?? 'msmeerp.com',
  otpLength: 4,
  otpExpirySeconds: 600,
  otpResendCooldownSeconds: 30,
  /** G18: minutes of inactivity before an automatic sign-out. */
  idleTimeoutMinutes: 30,
};

interface RuntimeConfig {
  apiBaseUrl?: string;
  portalDomain?: string;
}

/**
 * G24: the API URL used to be baked in at build time. Loading `/config.json` once at startup
 * (a static file, swappable per-deployment without rebuilding the bundle) overrides it — call
 * this and await it before anything that reads APP_CONFIG.apiBaseUrl gets imported (see main.tsx).
 */
export async function loadRuntimeConfig(): Promise<void> {
  try {
    const response = await fetch('/config.json', { cache: 'no-store' });
    if (!response.ok) return;
    const runtime = (await response.json()) as RuntimeConfig;
    if (runtime.apiBaseUrl) APP_CONFIG.apiBaseUrl = runtime.apiBaseUrl;
    if (runtime.portalDomain) APP_CONFIG.portalDomain = runtime.portalDomain;
  } catch {
    // No /config.json reachable (e.g. local dev without one) — keep the build-time defaults.
  }
}
