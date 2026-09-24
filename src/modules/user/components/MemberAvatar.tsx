import styled from 'styled-components';
import type { UserSummary } from '../types/user.types';

const Circle = styled.span<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primarySoft};
  color: ${({ theme }) => theme.colors.primaryDarker};
  font-size: ${({ $size }) => Math.round($size * 0.38)}px;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`;

export function memberName(user: Pick<UserSummary, 'firstName' | 'lastName' | 'username'>): string {
  return `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.username;
}

export function MemberAvatar({ user, size = 36 }: { user: UserSummary; size?: number }) {
  const initials =
    [user.firstName, user.lastName]
      .map((part) => part?.trim().charAt(0) ?? '')
      .join('')
      .toUpperCase() || user.username.charAt(0).toUpperCase();

  return (
    <Circle $size={size} aria-hidden="true">
      {initials}
    </Circle>
  );
}
