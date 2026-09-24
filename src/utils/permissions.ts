import type { StoredSession } from './authStorage';

export function hasRole(session: StoredSession | null, role: string): boolean {
  return !!session?.roles.includes(role);
}

export function hasPermission(session: StoredSession | null, permission: string): boolean {
  return !!session?.permissions.includes(permission);
}

export function hasAnyPermission(session: StoredSession | null, permissions: string[]): boolean {
  return permissions.some((permission) => hasPermission(session, permission));
}

/** Mirrors the backend's `hasRole('ADMIN') or hasAuthority(permission)` @PreAuthorize pattern. */
export function canAccess(session: StoredSession | null, permission: string): boolean {
  return hasRole(session, 'ADMIN') || hasPermission(session, permission);
}
