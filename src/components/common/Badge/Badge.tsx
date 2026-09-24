import styled, { css } from 'styled-components';
import type { BadgeProps, BadgeTone } from './Badge.types';

const toneStyles: Record<BadgeTone, ReturnType<typeof css>> = {
  success: css`
    background: ${({ theme }) => theme.colors.successLight};
    color: ${({ theme }) => theme.colors.successDark};
    border-color: rgba(18, 128, 92, 0.2);
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.dangerLight};
    color: ${({ theme }) => theme.colors.dangerDark};
    border-color: rgba(200, 50, 43, 0.2);
  `,
  warning: css`
    background: ${({ theme }) => theme.colors.warningLight};
    color: ${({ theme }) => theme.colors.warningDark};
    border-color: rgba(178, 94, 9, 0.22);
  `,
  info: css`
    background: ${({ theme }) => theme.colors.infoLight};
    color: ${({ theme }) => theme.colors.info};
    border-color: rgba(11, 111, 184, 0.2);
  `,
  primary: css`
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primaryDark};
    border-color: ${({ theme }) => theme.colors.primaryBorder};
  `,
  neutral: css`
    background: ${({ theme }) => theme.colors.bgMuted};
    color: ${({ theme }) => theme.colors.textBody};
    border-color: ${({ theme }) => theme.colors.border};
  `,
};

export const Badge = styled.span<{ $tone?: BadgeTone; $dot?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 22px;
  padding: 0 8px;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 12px;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  line-height: 1;
  white-space: nowrap;

  ${({ $tone = 'neutral' }) => toneStyles[$tone]}

  ${({ $dot }) =>
    $dot &&
    css`
      &::before {
        content: '';
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: currentColor;
      }
    `}
`;

export function BadgeText({ tone = 'neutral', dot, children, ...rest }: BadgeProps) {
  return (
    <Badge $tone={tone} $dot={dot} {...rest}>
      {children}
    </Badge>
  );
}
