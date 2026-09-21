import styled from 'styled-components';
import { Card } from '@/components/common/Card/Card';
import { EMERGENCY_ALERTS } from '../services/dashboardService';

const Panel = styled(Card)`
  border-color: ${({ theme }) => theme.colors.dangerLight};
  background: ${({ theme }) => theme.colors.dangerLight};
  overflow: hidden;
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[5]};
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.danger};
`;

const Badge = styled.span`
  background: ${({ theme }) => theme.colors.danger};
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 999px;
`;

const AlertRow = styled.div`
  background: ${({ theme }) => theme.colors.bg};
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[5]};
  border-top: 1px solid ${({ theme }) => theme.colors.dangerLight};
`;

const AlertHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[2]};
`;

const AlertTitle = styled.span`
  font-weight: 700;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.navy};
`;

const AlertTime = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.danger};
  white-space: nowrap;
`;

const AlertDescription = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 4px;
  line-height: 1.4;
`;

export function EmergencyAlertsPanel() {
  const highCount = EMERGENCY_ALERTS.filter((a) => a.severity === 'high').length;

  return (
    <Panel>
      <Head>
        <Title>✳ Emergency Alerts</Title>
        {highCount > 0 && <Badge>{highCount} HIGH</Badge>}
      </Head>
      {EMERGENCY_ALERTS.map((alert) => (
        <AlertRow key={alert.id}>
          <AlertHead>
            <AlertTitle>{alert.title}</AlertTitle>
            <AlertTime>{alert.timeAgo}</AlertTime>
          </AlertHead>
          <AlertDescription>{alert.description}</AlertDescription>
        </AlertRow>
      ))}
    </Panel>
  );
}
