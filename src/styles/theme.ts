export const theme = {
  colors: {
    primary: '#1d4ed8',
    primaryDark: '#1e3a8a',
    primaryLight: '#dbeafe',
    accent: '#14b8a6',
    accentDark: '#0f9488',
    accentLight: '#ccfbf1',

    navy: '#0f172a',
    navySoft: '#1e293b',

    success: '#059669',
    successLight: '#d1fae5',
    danger: '#dc2626',
    dangerLight: '#fee2e2',
    warning: '#d97706',
    warningLight: '#fef3c7',

    text: '#111827',
    textSecondary: '#6b7280',
    textMuted: '#9ca3af',
    textOnDark: '#f8fafc',
    textOnDarkMuted: '#94a3b8',

    border: '#e5e7eb',
    borderFocus: '#1d4ed8',
    bg: '#ffffff',
    bgSubtle: '#f8fafc',
    bgPage: '#f1f5f9',
  },
  font: {
    family: "'Hanken Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    mono: "'IBM Plex Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace",
  },
  radius: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    xl: '22px',
  },
  shadow: {
    sm: '0 1px 2px rgba(15, 23, 42, 0.05)',
    md: '0 4px 12px rgba(15, 23, 42, 0.08)',
    lg: '0 12px 32px rgba(15, 23, 42, 0.14)',
  },
  space: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '24px',
    6: '32px',
    8: '48px',
  },
  transition: {
    fast: '150ms ease',
    base: '200ms ease',
  },
} as const;

export type AppTheme = typeof theme;
