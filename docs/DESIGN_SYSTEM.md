# MSME ERP — Design System ("Cobalt & Slate")

All tokens live in [`src/styles/theme.ts`](../src/styles/theme.ts). Components read them through
styled-components (`${({ theme }) => theme.colors.primary}`); never hard-code a hex in a component.

## Colour

### Brand & navigation

| Token | Hex | Use |
|---|---|---|
| `colors.primary` | `#1F5AD6` | Primary buttons, links, active states, first chart series |
| `colors.primaryDark` | `#1746AE` | Primary hover, link hover |
| `colors.primaryDarker` | `#123889` | Primary pressed, text on `primarySoft` |
| `colors.primarySoft` | `#DCE6FD` | Avatars, selection highlight |
| `colors.primaryLight` | `#EEF3FE` | Selected rows, hovered quick actions, icon tiles |
| `colors.primaryBorder` | `#B9CDFB` | Borders on primary-tinted surfaces |
| `colors.sidebarBg` / `navy` | `#0B1B34` | Navigation rail |
| `colors.sidebarHover` | `#122543` | Rail item hover |
| `colors.sidebarActive` | `#1B3157` | Rail item selected |
| `colors.sidebarText` | `#C3CDDD` | Rail labels (10.7:1 on rail) |
| `colors.sidebarTextMuted` | `#8494AE` | Rail section headings (5.6:1) |
| `colors.sidebarIndicator` | `#6F9BFF` | Active indicator bar and icon |
| `colors.accent` | `#0B7A6E` | "Success"/create buttons, positive icons (white text 5.2:1) |

### Neutrals (cool slate)

| Token | Hex | Use |
|---|---|---|
| `colors.textStrong` / `text` | `#101828` | Headings, key values (17.8:1 on white) |
| `colors.textBody` | `#344054` | Body copy, table cells (10.5:1) |
| `colors.textSecondary` | `#475467` | Labels, secondary text (7.7:1) |
| `colors.textMuted` | `#667085` | Hints, captions, placeholders (5.0:1) |
| `colors.textDisabled` | `#98A2B3` | Disabled text, decorative glyphs only |
| `colors.borderStrong` | `#D0D5DD` | Input and secondary-button borders |
| `colors.border` | `#E4E7EC` | Card borders, dividers, table rules |
| `colors.bgMuted` / `bgHover` | `#F2F4F7` | Hover fills, progress tracks |
| `colors.bgSubtle` | `#F8F9FB` | Table header, search field, side panels |
| `colors.bgPage` | `#F3F5F8` | App background behind cards |
| `colors.bg` | `#FFFFFF` | Cards, header, inputs |

### Status

Each status has a strong colour for text and icons plus a light fill. Badges use the **dark** shade
on the **light** fill, so every combination passes WCAG AA.

| Status | Strong | Dark (badge text) | Light (fill) |
|---|---|---|---|
| Success | `#12805C` | `#0E6A4C` | `#E7F6EF` |
| Warning | `#B25E09` | `#93500E` | `#FEF4E6` |
| Danger | `#C8322B` | `#A52722` | `#FDEDEC` |
| Info | `#0B6FB8` | — | `#E8F3FC` |

### Charts

Use `theme.chart` in order: `#1F5AD6`, `#0E9384`, `#E08A1E`, `#6A4BE0`, `#D1453B`, `#5C7089`.
For single-series bar charts, draw history in `palette.cobalt200` (`#B9CDFB`) and the
current/highlighted bar in `primary`.

## Dark theme

Users switch with the sun/moon button (app header, and top-right on sign-in/onboarding screens).
The choice is saved per device (`localStorage['erp.theme']`); on first visit the OS setting is used.
Both themes live in [`src/styles/theme.ts`](../src/styles/theme.ts) (`lightTheme`, `darkTheme`) and share
one type, so every component works in both as long as it uses tokens.

**Fill vs text tokens.** On dark surfaces a blue dark enough for white button text is too dark to read
as link text, so the two are split:
- `primary`, `danger`, `accent`, `success`… — text, icons, borders, chart marks
- `primaryFill`, `dangerFill`, `accentFill` (+ `…Hover`, `primaryFillActive`) — solid backgrounds carrying white text

In light mode each fill equals its base colour, so light looks exactly as before.

| Token | Light | Dark |
|---|---|---|
| `bgPage` | `#F3F5F8` | `#0B1220` |
| `bg` (cards) | `#FFFFFF` | `#121B2C` |
| `bgSubtle` | `#F8F9FB` | `#172234` |
| `bgMuted` / `bgHover` | `#F2F4F7` | `#1D293D` |
| `border` / `borderStrong` | `#E4E7EC` / `#D0D5DD` | `#243149` / `#33425C` |
| `textStrong` | `#101828` | `#EDF1F7` (15.2:1) |
| `textBody` | `#344054` | `#C5CEDC` (10.9:1) |
| `textSecondary` | `#475467` | `#A1ADBF` (7.6:1) |
| `textMuted` | `#667085` | `#8795AB` (5.7:1) |
| `primary` (text) | `#1F5AD6` | `#7AA2FF` (6.9:1) |
| `primaryFill` | `#1F5AD6` | `#2F63DB` (white 5.4:1) |
| `dangerFill` | `#C8322B` | `#D83A34` (white 4.6:1) |
| `success` / `warning` / `danger` / `info` | `#12805C` / `#B25E09` / `#C8322B` / `#0B6FB8` | `#4FD09A` / `#F2A33A` / `#FF7A73` / `#5AB0F0` |
| `sidebarBg` | `#0B1B34` | `#0D1626` |

Ratios are against the dark card colour `#121B2C`; badge text-on-tint pairs are all 5.9:1 or higher.

## Typography

- **UI:** IBM Plex Sans 400 / 500 / 600 / 700
- **Figures and codes:** IBM Plex Mono (amounts in tables, document numbers like `SO-1042`)
- All tables and KPIs use `font-variant-numeric: tabular-nums` so digits line up.

| Token | Size | Use |
|---|---|---|
| `fontSize.display` | 28px / 600 | Page title (`PageHeader`) |
| `fontSize.xl` | 18px / 600 | Modal title, empty-state heading |
| `fontSize.lg` | 16px / 600 | Card title |
| `fontSize.md` | 14px / 400 | Body, table cells, inputs, buttons |
| `fontSize.sm` | 13px | Labels, secondary lines |
| `fontSize.xs` | 12px | Hints, table headers, badges |

## Spacing, radius, elevation

- Spacing scale: 4, 8, 12, 16, 24, 32, 40, 48 (`space[1]`…`space[8]`). Page padding is 32px; card
  padding is 24px; gaps between cards are 24px.
- Radius: 4 (kbd), 6 (badges), **8 (buttons, inputs, nav items)**, **12 (cards)**, 16 (large panels).
- Shadows are subtle: cards use `shadow.xs`; modals use `shadow.lg`. Focus uses `shadow.focus`
  (a 3px cobalt ring at 28% opacity).

## Layout

- Sidebar 256px, collapsible to 72px (the preference is saved in `localStorage`).
- Sticky 64px header: breadcrumb (section › module), global search (⌘K / Ctrl+K), tasks,
  notifications, account.
- Content max width is 1600px, centred.

## Components

| Component | File | Notes |
|---|---|---|
| `Button` | `common/Button` | Variants `primary`, `secondary`, `ghost`, `link`, `success`, `danger`; sizes `sm` 32 / `md` 38 / `lg` 46; `leadingIcon`, `trailingIcon`, `loading` |
| `BadgeText` | `common/Badge` | Tones `success`, `warning`, `danger`, `info`, `primary`, `neutral`; `dot` for a status dot |
| `Card`, `CardHeader`, `CardTitle`, `CardSubtitle`, `CardBody` | `common/Card` | Standard panel |
| `PageHeader` | `common/PageHeader` | Eyebrow, title, subtitle, right-aligned actions |
| `Table`, `Th`, `Td`, `TableScroll` | `common/Table` | `Td $numeric` right-aligns and uses mono figures |
| `Input` | `common/Input` | 40px, 8px radius, cobalt focus ring, red error ring |
| `Modal` | `common/Modal` | Navy scrim, `role="dialog"` |
| `ModulePlaceholder` | `common/ModulePlaceholder` | Roadmap page with planned capabilities |

### Status mapping conventions

| Document state | Badge tone |
|---|---|
| Draft, Inactive | `neutral` |
| Pending, Due today, Low stock | `warning` |
| Submitted, Scheduled, Due later | `info` |
| Approved, Posted, Paid, Active | `success` |
| Overdue, Rejected, Cancelled, Out of stock | `danger` |
| Informational tags (roles, phases) | `primary` |

## Rules of thumb

1. One primary button per view; everything else is `secondary` or `ghost`.
2. Colour always carries a label too (badge text, icon); never colour alone.
3. Amounts are right-aligned in mono; identifiers (SO-, PO-, INV-) are mono in `primary`.
4. Icons come from `@ant-design/icons` (outlined set). No emoji in the UI.
