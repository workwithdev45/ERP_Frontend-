import type { HTMLAttributes } from 'react';

export type BadgeTone = 'success' | 'danger' | 'warning' | 'info' | 'primary' | 'neutral';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  /** Shows a small status dot before the label. */
  dot?: boolean;
}
