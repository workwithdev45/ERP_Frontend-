import styled from 'styled-components';
import type { CardProps } from './Card.types';

export const Card = styled.div<CardProps>`
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.xs};
`;

/** Title row of a card: heading on the left, actions on the right. */
export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  min-height: 56px;
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[5]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const CardTitle = styled.h2`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textStrong};
`;

export const CardSubtitle = styled.p`
  margin-top: 2px;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.regular};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const CardBody = styled.div`
  padding: ${({ theme }) => theme.space[5]};
`;
