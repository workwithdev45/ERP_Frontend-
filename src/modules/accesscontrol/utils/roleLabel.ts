/**
 * Display names for built-in roles. The backend keeps the stored names (USER is also the
 * ROLE_USER authority), so only what people see changes.
 */
const BUILT_IN_ROLE_LABELS: Record<string, string> = {
  USER: 'All org users',
};

/** The role that new members get when the admin doesn't pick one (the backend applies it). */
export const DEFAULT_ROLE_LABEL = BUILT_IN_ROLE_LABELS.USER;

export function roleLabel(name: string): string {
  return BUILT_IN_ROLE_LABELS[name] ?? name;
}
