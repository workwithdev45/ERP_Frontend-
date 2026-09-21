import styled, { css } from 'styled-components';
import type { ButtonProps, ButtonVariant } from './Button.types';

const variantStyles: Record<ButtonVariant, ReturnType<typeof css>> = {
  primary: css`
    background: ${({ theme }) => theme.colors.navy};
    color: #fff;
    border: 1px solid transparent;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.navySoft};
    }
  `,
  success: css`
    background: ${({ theme }) => theme.colors.accent};
    color: #fff;
    border: 1px solid transparent;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.accentDark};
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.border};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.bgSubtle};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.textSecondary};
    border: 1px solid transparent;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.bgSubtle};
    }
  `,
  link: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.primary};
    border: none;
    padding: 0;
    font-weight: 500;

    &:hover:not(:disabled) {
      text-decoration: underline;
    }
  `,
};

const StyledButton = styled.button<{ $variant: ButtonVariant; $fullWidth?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space[2]};
  height: 48px;
  padding: 0 ${({ theme }) => theme.space[5]};
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background ${({ theme }) => theme.transition.fast};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ $variant }) => variantStyles[$variant]}
`;

export function Button({
  variant = 'primary',
  fullWidth,
  loading,
  trailingIcon,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <StyledButton $variant={variant} $fullWidth={fullWidth} disabled={disabled || loading} {...rest}>
      {loading ? 'Please wait…' : children}
      {!loading && trailingIcon}
    </StyledButton>
  );
}
