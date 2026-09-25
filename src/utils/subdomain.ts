import { APP_CONFIG } from '@/config/app.config';

/**
 * G6: in production each workspace has its own subdomain (acme.msmeerp.com) — read the
 * workspace ID from there instead of asking for it. Returns null on localhost/IP hosts or
 * anything that isn't a single-level subdomain of the configured portal domain, so the
 * Workspace ID field stays around for local/dev.
 */
export function detectWorkspaceFromHost(): string | null {
  const host = window.location.hostname;
  const suffix = `.${APP_CONFIG.portalDomain}`;
  if (!host.endsWith(suffix)) return null;

  const subdomain = host.slice(0, -suffix.length);
  if (!subdomain || subdomain === 'www' || subdomain.includes('.')) return null;

  return subdomain;
}
