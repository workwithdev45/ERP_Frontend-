import styled from 'styled-components';
import { Card } from '@/components/common/Card/Card';
import type { StatCardData } from '../types/dashboard.types';

const Tile = styled(Card)<{ $danger?: boolean }>`
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[5]};
  background: ${({ theme, $danger }) => ($danger ? theme.colors.dangerLight : theme.colors.bg)};
  border-color: ${({ theme, $danger }) => ($danger ? theme.colors.dangerLight : theme.colors.border)};
`;

const Label = styled.div<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${({ theme, $danger }) => ($danger ? theme.colors.danger : theme.colors.textSecondary)};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const ValueRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.space[2]};
`;

const Value = styled.span<{ $danger?: boolean }>`
  font-size: 26px;
  font-weight: 700;
  color: ${({ theme, $danger }) => ($danger ? theme.colors.danger : theme.colors.navy)};
`;

const Trend = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.success};
`;

const Suffix = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export function StatCard({ label, value, suffix, trend, tone }: Omit<StatCardData, 'key'>) {
  const danger = tone === 'danger';
  return (
    <Tile $danger={danger}>
      <Label $danger={danger}>
        {danger && '⚠'} {label}
      </Label>
      <ValueRow>
        <Value $danger={danger}>{value}</Value>
        {trend && <Trend>{trend}</Trend>}
        {suffix && <Suffix>{suffix}</Suffix>}
      </ValueRow>
    </Tile>
  );
}
