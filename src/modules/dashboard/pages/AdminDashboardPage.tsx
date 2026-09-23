import styled from 'styled-components';
import { Button } from '@/components/common/Button/Button';
import { Card } from '@/components/common/Card/Card';
import { StatCard } from '../components/StatCard';
import {
  DASHBOARD_STATS,
  PENDING_TASKS,
  RECENT_ORDERS,
  TOP_SELLING_PRODUCTS,
} from '../services/dashboardService';

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
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.space[4]};

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const PanelCard = styled(Card)`
  padding: ${({ theme }) => theme.space[5]};
`;

const PanelTitle = styled.div`
  font-weight: 700;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.navy};
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.space[2]} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 13px;

  &:last-child {
    border-bottom: none;
  }
`;

const StatusPill = styled.span<{ $status: 'Paid' | 'Pending' | 'Overdue' }>`
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
  color: ${({ theme, $status }) =>
    $status === 'Paid' ? theme.colors.success : $status === 'Overdue' ? theme.colors.danger : theme.colors.warning};
  background: ${({ theme, $status }) =>
    $status === 'Paid'
      ? theme.colors.accentLight
      : $status === 'Overdue'
        ? theme.colors.dangerLight
        : theme.colors.border};
`;

export function AdminDashboardPage() {
  return (
    <div>
      <Head>
        <div>
          <PageTitle>Company Overview</PageTitle>
          <PageSubtitle>Real-time operational metrics across every module</PageSubtitle>
        </div>
        <Button>⬇ Export Report</Button>
      </Head>

      <Layout>
        <MainColumn>
          <StatGrid>
            {DASHBOARD_STATS.map(({ key, ...stat }) => (
              <StatCard key={key} {...stat} />
            ))}
          </StatGrid>

          <PanelCard>
            <PanelTitle>Recent Sales Orders</PanelTitle>
            {RECENT_ORDERS.map((order) => (
              <Row key={order.id}>
                <span>
                  {order.reference} — {order.customerName}
                </span>
                <span>
                  {order.amount} <StatusPill $status={order.status}>{order.status}</StatusPill>
                </span>
              </Row>
            ))}
          </PanelCard>

          <PanelCard>
            <PanelTitle>Top Selling Products</PanelTitle>
            {TOP_SELLING_PRODUCTS.map((product) => (
              <Row key={product.id}>
                <span>{product.name}</span>
                <span>
                  {product.unitsSold} units — {product.revenue}
                </span>
              </Row>
            ))}
          </PanelCard>
        </MainColumn>

        <SideColumn>
          <PanelCard>
            <PanelTitle>Pending Tasks</PanelTitle>
            {PENDING_TASKS.map((task) => (
              <Row key={task.id}>
                <span>{task.label}</span>
                <span style={{ color: task.overdue ? undefined : undefined }}>{task.note}</span>
              </Row>
            ))}
          </PanelCard>
        </SideColumn>
      </Layout>
    </div>
  );
}
