import { useId } from 'react';
import { useTheme } from 'styled-components';

interface BrandMarkProps {
  size?: number;
}

/**
 * MSME ERP product mark: four module blocks in a 2×2 grid — integrated business modules —
 * with one lighter block for the module you add next. Keep in sync with public/favicon.svg.
 */
export function BrandMark({ size = 34 }: BrandMarkProps) {
  const theme = useTheme();
  const gradientId = useId();

  return (
    <svg width={size} height={size} viewBox="0 0 34 34" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={theme.colors.primary} />
          <stop offset="1" stopColor={theme.palette.cobalt500} />
        </linearGradient>
      </defs>
      <rect width="34" height="34" rx="9" fill={`url(#${gradientId})`} />
      <rect x="9" y="9" width="7" height="7" rx="1.8" fill="#FFFFFF" />
      <rect x="18" y="9" width="7" height="7" rx="1.8" fill="#FFFFFF" fillOpacity="0.55" />
      <rect x="9" y="18" width="7" height="7" rx="1.8" fill="#FFFFFF" />
      <rect x="18" y="18" width="7" height="7" rx="1.8" fill="#FFFFFF" />
    </svg>
  );
}
