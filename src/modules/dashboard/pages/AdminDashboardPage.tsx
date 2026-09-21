/*
import styled from 'styled-components';
import { Button } from '@/components/common/Button/Button';
import { Card } from '@/components/common/Card/Card';
import { BedOccupancyWidget } from '../components/BedOccupancyWidget';
import { EmergencyAlertsPanel } from '../components/EmergencyAlertsPanel';
import { PatientTrendChart } from '../components/PatientTrendChart';
import { PendingTasksWidget } from '../components/PendingTasksWidget';
import { StatCard } from '../components/StatCard';
import { TodaysAppointmentsPanel } from '../components/TodaysAppointmentsPanel';
import { DASHBOARD_STATS } from '../services/dashboardService';

const Head = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.space[5]};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[4]};
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.navy};
`;

const PageSubtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 2px;
`;

const HeadActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
`;

const DatePill = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px ${({ theme }) => theme.space[4]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.bg};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.navy};
  white-space: nowrap;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.space[5]};

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[5]};
`;

const SideColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[5]};
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.space[4]};

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: ${({ theme }) => theme.space[4]};

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled(Card)`
  padding: ${({ theme }) => theme.space[5]};
`;

const ChartTitle = styled.div`
  font-weight: 700;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.navy};
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

export function AdminDashboardPage() {
  return (
    <div>
      <Head>
        <div>
          <PageTitle>Hospital Overview</PageTitle>
          <PageSubtitle>Real-time operational metrics for City Branch</PageSubtitle>
        </div>
        <HeadActions>
          <DatePill>📅 Today, Oct 24</DatePill>
          <Button>⬇ Export Report</Button>
        </HeadActions>
      </Head>

      <Layout>
        <MainColumn>
          <StatGrid>
            {DASHBOARD_STATS.map(({ key, ...stat }) => (
              <StatCard key={key} {...stat} />
            ))}
          </StatGrid>

          <ChartsGrid>
            <ChartCard>
              <ChartTitle>Patient Registration Trend</ChartTitle>
              <PatientTrendChart />
            </ChartCard>
            <ChartCard>
              <ChartTitle>Bed Occupancy</ChartTitle>
              <BedOccupancyWidget />
            </ChartCard>
          </ChartsGrid>
        </MainColumn>

        <SideColumn>
          <EmergencyAlertsPanel />
          <TodaysAppointmentsPanel />
          <PendingTasksWidget />
        </SideColumn>
      </Layout>
    </div>
  );
}
*/

export function AdminDashboardPage() {
  return <h1>Dashboard</h1>;
}
