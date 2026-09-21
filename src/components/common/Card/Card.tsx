import styled from 'styled-components';
import type { CardProps } from './Card.types';

export const Card = styled.div<CardProps>`
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;
