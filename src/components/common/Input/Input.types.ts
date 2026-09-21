import type { InputHTMLAttributes, ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  suffix?: string;
  prefixIcon?: ReactNode;
  prefixBadge?: ReactNode;
  suffixIcon?: ReactNode;
  onSuffixIconClick?: () => void;
  suffixBadge?: ReactNode;
}
