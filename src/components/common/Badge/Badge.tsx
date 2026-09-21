import styled, { css } from 'styled-components';
import type { BadgeProps, BadgeTone } from './Badge.types';

const toneStyles: Record<BadgeTone, ReturnType<typeof css>> = {
  success: css`
    background: ${({ theme }) => theme.colors.successLight};
    color: ${({ theme }) => theme.colors.success};
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.dangerLight};
    color: ${({ theme }) => theme.colors.danger};
  `,
  neutral: css`
    background: ${({ theme }) => theme.colors.bgSubtle};
    color: ${({ theme }) => theme.colors.textSecondary};
  `,
};

export const Badge = styled.span<{ $tone?: BadgeTone }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;

  ${({ $tone = 'neutral' }) => toneStyles[$tone]}
`;

export function BadgeText({ tone = 'neutral', children, ...rest }: BadgeProps) {
  return (
    <Badge $tone={tone} {...rest}>
      {children}
    </Badge>
  );
}
