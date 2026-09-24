import styled, { css } from 'styled-components';

/** Styled table primitives for data grids: `<Table><thead><tr><Th/>…</tr></thead><tbody><tr><Td/>…` */

export const TableScroll = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.fontSize.md};

  tbody tr {
    transition: background ${({ theme }) => theme.transition.fast};
  }

  tbody tr:hover {
    background: ${({ theme }) => theme.colors.bgSubtle};
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;

export const Th = styled.th<{ $align?: 'left' | 'right' | 'center' }>`
  text-align: ${({ $align = 'left' }) => $align};
  height: 40px;
  padding: 0 ${({ theme }) => theme.space[4]};
  background: ${({ theme }) => theme.colors.bgSubtle};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: 0.02em;
  white-space: nowrap;
`;

export const Td = styled.td<{ $align?: 'left' | 'right' | 'center'; $numeric?: boolean; $muted?: boolean }>`
  text-align: ${({ $align, $numeric }) => $align ?? ($numeric ? 'right' : 'left')};
  height: 52px;
  padding: 0 ${({ theme }) => theme.space[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme, $muted }) => ($muted ? theme.colors.textSecondary : theme.colors.textBody)};
  vertical-align: middle;

  ${({ $numeric, theme }) =>
    $numeric &&
    css`
      font-family: ${theme.font.mono};
      font-size: ${theme.fontSize.sm};
      white-space: nowrap;
    `}
`;
