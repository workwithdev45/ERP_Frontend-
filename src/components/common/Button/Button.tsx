import styled, { css } from 'styled-components';
import type { ButtonProps, ButtonSize, ButtonVariant } from './Button.types';

const variantStyles: Record<ButtonVariant, ReturnType<typeof css>> = {
  primary: css`
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.textOnPrimary};
    border: 1px solid ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadow.xs};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primaryDark};
      border-color: ${({ theme }) => theme.colors.primaryDark};
    }

    &:active:not(:disabled) {
      background: ${({ theme }) => theme.colors.primaryDarker};
    }
  `,
  success: css`
    background: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.textOnPrimary};
    border: 1px solid ${({ theme }) => theme.colors.accent};
    box-shadow: ${({ theme }) => theme.shadow.xs};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.accentDark};
      border-color: ${({ theme }) => theme.colors.accentDark};
    }
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.danger};
    color: ${({ theme }) => theme.colors.textOnPrimary};
    border: 1px solid ${({ theme }) => theme.colors.danger};
    box-shadow: ${({ theme }) => theme.shadow.xs};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.dangerDark};
      border-color: ${({ theme }) => theme.colors.dangerDark};
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.textBody};
    border: 1px solid ${({ theme }) => theme.colors.borderStrong};
    box-shadow: ${({ theme }) => theme.shadow.xs};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.bgSubtle};
      color: ${({ theme }) => theme.colors.text};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.textSecondary};
    border: 1px solid transparent;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.bgHover};
      color: ${({ theme }) => theme.colors.text};
    }
  `,
  link: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.primary};
    border: none;
    padding: 0;
    height: auto;
    font-weight: 500;

    &:hover:not(:disabled) {
      color: ${({ theme }) => theme.colors.primaryDark};
      text-decoration: underline;
    }
  `,
};

const sizeStyles: Record<ButtonSize, ReturnType<typeof css>> = {
  sm: css`
    height: 32px;
    padding: 0 ${({ theme }) => theme.space[3]};
    font-size: ${({ theme }) => theme.fontSize.sm};
  `,
  md: css`
    height: 38px;
    padding: 0 14px;
    font-size: ${({ theme }) => theme.fontSize.md};
  `,
  lg: css`
    height: 46px;
    padding: 0 ${({ theme }) => theme.space[5]};
    font-size: 15px;
  `,
};

const StyledButton = styled.button<{ $variant: ButtonVariant; $size: ButtonSize; $fullWidth?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space[2]};
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  transition:
    background ${({ theme }) => theme.transition.fast},
    border-color ${({ theme }) => theme.transition.fast},
    color ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast};

  .anticon {
    font-size: 1.05em;
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focus};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  ${({ $size }) => sizeStyles[$size]}
  ${({ $variant }) => variantStyles[$variant]}
`;

export function Button({
  variant = 'primary',
  size,
  fullWidth,
  loading,
  leadingIcon,
  trailingIcon,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <StyledButton
      $variant={variant}
      $size={size ?? (fullWidth ? 'lg' : 'md')}
      $fullWidth={fullWidth}
      disabled={disabled || loading}
      {...rest}
    >
      {!loading && leadingIcon}
      {loading ? 'Please wait…' : children}
      {!loading && trailingIcon}
    </StyledButton>
  );
}
