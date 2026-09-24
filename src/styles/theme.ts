/**
 * MSME ERP design tokens.
 *
 * Palette: "Cobalt & Slate" — a cobalt-blue brand colour on cool slate neutrals, with a
 * deep-navy navigation rail. Every text/background pair used by the components meets
 * WCAG AA (4.5:1 for body text, 3:1 for large text and UI glyphs).
 */

const palette = {
  cobalt50: '#EEF3FE',
  cobalt100: '#DCE6FD',
  cobalt200: '#B9CDFB',
  cobalt500: '#3B6FE8',
  cobalt600: '#1F5AD6',
  cobalt700: '#1746AE',
  cobalt800: '#123889',

  navy900: '#0B1B34',
  navy800: '#122543',
  navy700: '#1B3157',
  navy600: '#2A4270',

  teal50: '#E6F6F4',
  teal600: '#0B7A6E',
  teal700: '#096258',

  green50: '#E7F6EF',
  green600: '#12805C',
  green700: '#0E6A4C',

  amber50: '#FEF4E6',
  amber600: '#B25E09',
  amber700: '#93500E',

  red50: '#FDEDEC',
  red600: '#C8322B',
  red700: '#A52722',

  sky50: '#E8F3FC',
  sky600: '#0B6FB8',

  violet50: '#F1EEFE',
  violet600: '#6A4BE0',

  slate900: '#101828',
  slate700: '#344054',
  slate600: '#475467',
  slate500: '#667085',
  slate400: '#98A2B3',
  slate300: '#D0D5DD',
  slate200: '#E4E7EC',
  slate100: '#F2F4F7',
  slate50: '#F8F9FB',
  slate25: '#FCFCFD',
  page: '#F3F5F8',
  white: '#FFFFFF',
} as const;

export const theme = {
  palette,
  colors: {
    // Brand
    primary: palette.cobalt600,
    primaryDark: palette.cobalt700,
    primaryDarker: palette.cobalt800,
    primaryLight: palette.cobalt50,
    primarySoft: palette.cobalt100,
    primaryBorder: palette.cobalt200,

    // Secondary accent (used for positive / "create" actions and the second chart series)
    accent: palette.teal600,
    accentDark: palette.teal700,
    accentLight: palette.teal50,

    // Navigation rail & dark surfaces
    navy: palette.navy900,
    navySoft: palette.navy800,
    sidebarBg: palette.navy900,
    sidebarHover: palette.navy800,
    sidebarActive: palette.navy700,
    sidebarBorder: palette.navy700,
    sidebarText: '#C3CDDD',
    sidebarTextMuted: '#8494AE',
    sidebarIndicator: '#6F9BFF',

    // Status
    success: palette.green600,
    successDark: palette.green700,
    successLight: palette.green50,
    warning: palette.amber600,
    warningDark: palette.amber700,
    warningLight: palette.amber50,
    danger: palette.red600,
    dangerDark: palette.red700,
    dangerLight: palette.red50,
    info: palette.sky600,
    infoLight: palette.sky50,
    violet: palette.violet600,
    violetLight: palette.violet50,

    // Text
    text: palette.slate900,
    textStrong: palette.slate900,
    textBody: palette.slate700,
    textSecondary: palette.slate600,
    textMuted: palette.slate500,
    textDisabled: palette.slate400,
    textOnDark: '#F5F7FA',
    textOnDarkMuted: '#98A6BD',
    textOnPrimary: palette.white,

    // Lines
    border: palette.slate200,
    borderStrong: palette.slate300,
    borderFocus: palette.cobalt600,
    focusRing: 'rgba(31, 90, 214, 0.28)',

    // Surfaces
    bg: palette.white,
    bgSubtle: palette.slate50,
    bgMuted: palette.slate100,
    bgHover: palette.slate100,
    bgSelected: palette.cobalt50,
    bgPage: palette.page,
    overlay: 'rgba(11, 27, 52, 0.52)',
  },
  /** Ordered categorical palette for charts — distinguishable and colour-blind safe in sequence. */
  chart: ['#1F5AD6', '#0E9384', '#E08A1E', '#6A4BE0', '#D1453B', '#5C7089'],
  font: {
    family: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, sans-serif",
    display: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, sans-serif",
    mono: "'IBM Plex Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace",
  },
  fontSize: {
    xs: '12px',
    sm: '13px',
    md: '14px',
    lg: '16px',
    xl: '18px',
    xxl: '22px',
    display: '28px',
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  radius: {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    pill: '999px',
  },
  shadow: {
    xs: '0 1px 2px rgba(16, 24, 40, 0.05)',
    sm: '0 1px 3px rgba(16, 24, 40, 0.08), 0 1px 2px rgba(16, 24, 40, 0.04)',
    md: '0 4px 12px -2px rgba(16, 24, 40, 0.08), 0 2px 4px -2px rgba(16, 24, 40, 0.04)',
    lg: '0 12px 24px -4px rgba(16, 24, 40, 0.12), 0 4px 8px -4px rgba(16, 24, 40, 0.06)',
    focus: '0 0 0 3px rgba(31, 90, 214, 0.28)',
  },
  space: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '24px',
    6: '32px',
    7: '40px',
    8: '48px',
  },
  layout: {
    sidebarWidth: '256px',
    sidebarCollapsedWidth: '72px',
    headerHeight: '64px',
    contentMaxWidth: '1600px',
  },
  transition: {
    fast: '120ms ease',
    base: '200ms ease',
  },
} as const;

export type AppTheme = typeof theme;
