import type { HTMLAttributes } from 'react';

export type BadgeTone = 'success' | 'danger' | 'neutral';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}
