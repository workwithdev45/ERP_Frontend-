import styled from 'styled-components';
import { Card } from '@/components/common/Card/Card';
import { TODAYS_APPOINTMENTS } from '../services/dashboardService';
import type { AppointmentEntry } from '../types/dashboard.types';

const Panel = styled(Card)`
  overflow: hidden;
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[5]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.navy};
`;

const ViewAll = styled.a`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const Row = styled.div<{ $active?: boolean }>`
  display: flex;
  gap: ${({ theme }) => theme.space[4]};
  align-items: center;
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[5]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme, $active }) => ($active ? theme.colors.primaryLight : 'transparent')};
  border-left: 3px solid ${({ theme, $active }) => ($active ? theme.colors.primary : 'transparent')};

  &:last-child {
    border-bottom: none;
  }
`;

const TimeBlock = styled.div`
  text-align: center;
  width: 44px;
  flex-shrink: 0;
`;

const TimeValue = styled.div`
  font-weight: 700;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.navy};
`;

const TimeMeridiem = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Body = styled.div`
  flex: 1;
`;

const PatientName = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.navy};
`;

const Reason = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const StatusTag = styled.span<{ $status: AppointmentEntry['status'] }>`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme, $status }) =>
    $status === 'Checked In' ? theme.colors.success : $status === 'Waiting' ? theme.colors.warning : theme.colors.textMuted};
  white-space: nowrap;
`;

export function TodaysAppointmentsPanel() {
  return (
    <Panel>
      <Head>
        <Title>Today's Appointments</Title>
        <ViewAll>View All</ViewAll>
      </Head>
      {TODAYS_APPOINTMENTS.map((appt) => (
        <Row key={appt.id} $active={appt.active}>
          <TimeBlock>
            <TimeValue>{appt.time}</TimeValue>
            <TimeMeridiem>{appt.meridiem}</TimeMeridiem>
          </TimeBlock>
          <Body>
            <PatientName>{appt.patientName}</PatientName>
            <Reason>{appt.reason}</Reason>
          </Body>
          <StatusTag $status={appt.status}>{appt.status}</StatusTag>
        </Row>
      ))}
    </Panel>
  );
}
