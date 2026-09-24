import styled, { type DefaultTheme } from 'styled-components';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Card } from '@/components/common/Card/Card';
import type { StatCardData, StatTone } from '../types/dashboard.types';

function toneColors(theme: DefaultTheme, tone: StatTone) {
  switch (tone) {
    case 'danger':
      return { fg: theme.colors.danger, bg: theme.colors.dangerLight };
    case 'warning':
      return { fg: theme.colors.warning, bg: theme.colors.warningLight };
    case 'success':
      return { fg: theme.colors.success, bg: theme.colors.successLight };
    default:
      return { fg: theme.colors.primary, bg: theme.colors.primaryLight };
  }
}

const Tile = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[5]};
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
`;

const IconTile = styled.span<{ $tone: StatTone }>`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  flex-shrink: 0;
  color: ${({ theme, $tone }) => toneColors(theme, $tone).fg};
  background: ${({ theme, $tone }) => toneColors(theme, $tone).bg};
`;

const Label = styled.span`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Attention = styled.span<{ $tone: StatTone }>`
  font-size: 11px;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.radius.xs};
  color: ${({ theme, $tone }) => ($tone === 'danger' ? theme.colors.dangerDark : theme.colors.warningDark)};
  background: ${({ theme, $tone }) => toneColors(theme, $tone).bg};
`;

const ValueRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.space[2]};
`;

const Value = styled.span`
  font-size: 26px;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.textStrong};
  font-variant-numeric: tabular-nums;
`;

const Suffix = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Foot = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Trend = styled.span<{ $down?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme, $down }) => ($down ? theme.colors.danger : theme.colors.success)};

  .anticon {
    font-size: 10px;
  }
`;

export function StatCard({ label, value, suffix, trend, trendDirection = 'up', hint, icon: Icon, tone = 'default' }: Omit<StatCardData, 'key'>) {
  const needsAttention = tone === 'danger' || tone === 'warning';
  return (
    <Tile>
      <Top>
        {Icon && (
          <IconTile $tone={tone} aria-hidden="true">
            <Icon />
          </IconTile>
        )}
        <Label>{label}</Label>
        {needsAttention && <Attention $tone={tone}>Action needed</Attention>}
      </Top>
      <ValueRow>
        <Value>{value}</Value>
        {suffix && <Suffix>{suffix}</Suffix>}
      </ValueRow>
      {(trend || hint) && (
        <Foot>
          {trend && (
            <Trend $down={trendDirection === 'down'}>
              {trendDirection === 'down' ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
              {trend}
            </Trend>
          )}
          {hint && <span>{hint}</span>}
        </Foot>
      )}
    </Tile>
  );
}
