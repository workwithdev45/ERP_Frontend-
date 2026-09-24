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

export const lightTheme = {
  mode: 'light' as 'light' | 'dark',
  palette,
  colors: {
    // Brand
    primary: palette.cobalt600,
    primaryDark: palette.cobalt700,
    primaryDarker: palette.cobalt800,
    primaryLight: palette.cobalt50,
    primarySoft: palette.cobalt100,
    primaryBorder: palette.cobalt200,
    // Solid fills that carry white text (buttons, brand tiles). Same as primary in light mode;
    // in dark mode `primary` becomes a lighter text shade while fills stay deep enough for white text.
    primaryFill: palette.cobalt600,
    primaryFillHover: palette.cobalt700,
    primaryFillActive: palette.cobalt800,

    // Secondary accent (used for positive / "create" actions and the second chart series)
    accent: palette.teal600,
    accentDark: palette.teal700,
    accentLight: palette.teal50,
    accentFill: palette.teal600,
    accentFillHover: palette.teal700,

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
    dangerFill: palette.red600,
    dangerFillHover: palette.red700,
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
    headerBg: 'rgba(255, 255, 255, 0.92)',

    // Decorative (onboarding background)
    decorDot: 'rgba(16, 24, 40, 0.07)',
    decorRing: '#CBD5E1',
    decorGlow: 'rgba(31, 90, 214, 0.10)',
    decorGlowAlt: 'rgba(11, 122, 110, 0.07)',
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

/** Theme shape with literal values widened, so light and dark themes share one type. */
type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends readonly (infer U)[]
      ? readonly Widen<U>[]
      : { [K in keyof T]: Widen<T[K]> };

export type AppTheme = Widen<typeof lightTheme>;
export type ThemeMode = 'light' | 'dark';

/**
 * Dark theme: same cobalt brand and status hues, re-tuned for dark surfaces. Every text/background
 * pair meets WCAG AA (checked: body 10.9:1, muted 5.3:1+, links 6.9:1, white on fills 4.6:1+).
 */
export const darkTheme: AppTheme = {
  ...lightTheme,
  mode: 'dark',
  palette: {
    ...palette,
    cobalt200: '#2C4A86',
    cobalt500: '#4C7DF0',
  },
  colors: {
    primary: '#7AA2FF',
    primaryDark: '#9DBBFF',
    primaryDarker: '#C2D4FF',
    primaryLight: '#18294B',
    primarySoft: '#1F3563',
    primaryBorder: '#2C4A86',
    primaryFill: '#2F63DB',
    primaryFillHover: '#3468E0',
    primaryFillActive: '#2757C4',

    accent: '#3FC7B4',
    accentDark: '#6FD8C9',
    accentLight: '#10302E',
    accentFill: '#0B7A6E',
    accentFillHover: '#096258',

    navy: '#EDF1F7',
    navySoft: '#C5CEDC',
    sidebarBg: '#0D1626',
    sidebarHover: '#16223A',
    sidebarActive: '#1E2D4A',
    sidebarBorder: '#1B2740',
    sidebarText: '#C3CDDD',
    sidebarTextMuted: '#8494AE',
    sidebarIndicator: '#7AA2FF',

    success: '#4FD09A',
    successDark: '#6EE0AF',
    successLight: '#123137',
    warning: '#F2A33A',
    warningDark: '#F7BC62',
    warningLight: '#352A24',
    danger: '#FF7A73',
    dangerDark: '#FF9A94',
    dangerLight: '#3A202C',
    dangerFill: '#D83A34',
    dangerFillHover: '#C0302B',
    info: '#5AB0F0',
    infoLight: '#102D4B',
    violet: '#A48CFF',
    violetLight: '#231D45',

    text: '#EDF1F7',
    textStrong: '#EDF1F7',
    textBody: '#C5CEDC',
    textSecondary: '#A1ADBF',
    textMuted: '#8795AB',
    textDisabled: '#5E6B80',
    textOnDark: '#F5F7FA',
    textOnDarkMuted: '#98A6BD',
    textOnPrimary: '#FFFFFF',

    border: '#243149',
    borderStrong: '#33425C',
    borderFocus: '#7AA2FF',
    focusRing: 'rgba(122, 162, 255, 0.35)',

    bg: '#121B2C',
    bgSubtle: '#172234',
    bgMuted: '#1D293D',
    bgHover: '#1D293D',
    bgSelected: '#18294B',
    bgPage: '#0B1220',
    overlay: 'rgba(2, 6, 15, 0.7)',
    headerBg: 'rgba(18, 27, 44, 0.92)',

    decorDot: 'rgba(255, 255, 255, 0.06)',
    decorRing: '#33425C',
    decorGlow: 'rgba(76, 125, 240, 0.16)',
    decorGlowAlt: 'rgba(63, 199, 180, 0.08)',
  },
  chart: ['#5B8BF5', '#2FB5A3', '#F0A04B', '#9B82FF', '#F2706A', '#8A9BB5'],
  shadow: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.4)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.45), 0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 4px 12px -2px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
    lg: '0 12px 24px -4px rgba(0, 0, 0, 0.55), 0 4px 8px -4px rgba(0, 0, 0, 0.35)',
    focus: '0 0 0 3px rgba(122, 162, 255, 0.35)',
  },
};

/** @deprecated use lightTheme / darkTheme via ThemeModeProvider */
export const theme = lightTheme;
