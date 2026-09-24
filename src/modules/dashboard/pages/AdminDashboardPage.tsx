import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  AccountBookOutlined,
  CalendarOutlined,
  DownloadOutlined,
  FileAddOutlined,
  InboxOutlined,
  PlusOutlined,
  RightOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { BadgeText } from '@/components/common/Badge/Badge';
import type { BadgeTone } from '@/components/common/Badge/Badge.types';
import { Button } from '@/components/common/Button/Button';
import { Card, CardBody, CardHeader, CardSubtitle, CardTitle } from '@/components/common/Card/Card';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { Table, TableScroll, Td, Th } from '@/components/common/Table/Table';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { SalesTrendChart } from '../components/SalesTrendChart';
import { StatCard } from '../components/StatCard';
import {
  DASHBOARD_STATS,
  PENDING_TASKS,
  RECENT_ORDERS,
  SALES_TREND,
  TOP_SELLING_PRODUCTS,
} from '../services/dashboardService';
import type { AdminTask, RecentOrderEntry } from '../types/dashboard.types';

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  @media (min-width: 1760px) {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
  }

  gap: ${({ theme }) => theme.space[4]};
  margin-bottom: ${({ theme }) => theme.space[5]};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: ${({ theme }) => theme.space[5]};
  margin-bottom: ${({ theme }) => theme.space[5]};

  @media (max-width: 1180px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[5]};
`;

const HeaderText = styled.div`
  flex: 1;
  min-width: 0;
`;

const HeaderLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;

  .anticon {
    font-size: 10px;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
    text-decoration: underline;
  }
`;

const ChartBody = styled(CardBody)`
  padding-top: ${({ theme }) => theme.space[4]};
`;

const TaskList = styled.ul`
  list-style: none;
`;

const TaskItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[5]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const Checkbox = styled.input`
  margin-top: 3px;
  width: 16px;
  height: 16px;
  accent-color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

const TaskText = styled.label`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.textBody};
  cursor: pointer;
`;

const OrderRef = styled.span`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.primary};
`;

const Customer = styled.span`
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textStrong};
`;

const ProductList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

const ProductRow = styled.li`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ProductLine = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[3]};
  font-size: ${({ theme }) => theme.fontSize.md};
`;

const ProductName = styled.span`
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textStrong};
`;

const ProductMeta = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;

const Track = styled.div`
  height: 6px;
  border-radius: 3px;
  background: ${({ theme }) => theme.colors.bgMuted};
  overflow: hidden;
`;

const Fill = styled.div<{ $pct: number; $leader: boolean }>`
  width: ${({ $pct }) => $pct}%;
  height: 100%;
  border-radius: 3px;
  background: ${({ theme, $leader }) => ($leader ? theme.colors.primary : theme.palette.cobalt200)};
`;

const QuickGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[3]};
`;

const QuickAction = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => theme.space[4]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textStrong};
  text-decoration: none;
  transition:
    border-color ${({ theme }) => theme.transition.fast},
    background ${({ theme }) => theme.transition.fast};

  .anticon {
    font-size: 18px;
    color: ${({ theme }) => theme.colors.primary};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryBorder};
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`;

const ORDER_TONE: Record<RecentOrderEntry['status'], BadgeTone> = {
  Paid: 'success',
  Pending: 'warning',
  Overdue: 'danger',
};

function taskTone(task: AdminTask): BadgeTone {
  if (task.overdue) return 'danger';
  if (/today/i.test(task.note)) return 'warning';
  return 'info';
}

const QUICK_ACTIONS = [
  { label: 'New sales order', icon: FileAddOutlined, to: ROUTE_PATHS.sales },
  { label: 'New purchase order', icon: ShoppingCartOutlined, to: ROUTE_PATHS.purchase },
  { label: 'Add stock item', icon: InboxOutlined, to: ROUTE_PATHS.inventory },
  { label: 'Record payment', icon: AccountBookOutlined, to: ROUTE_PATHS.accounts },
];

export function AdminDashboardPage() {
  const maxUnits = Math.max(...TOP_SELLING_PRODUCTS.map((p) => p.unitsSold));
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div>
      <PageHeader
        eyebrow={today}
        title="Company overview"
        subtitle="Real-time operational metrics across every module."
        actions={
          <>
            <Button variant="secondary" leadingIcon={<CalendarOutlined />}>
              This month
            </Button>
            <Button variant="secondary" leadingIcon={<DownloadOutlined />}>
              Export
            </Button>
            <Button leadingIcon={<PlusOutlined />}>New sales order</Button>
          </>
        }
      />

      <StatGrid>
        {DASHBOARD_STATS.map(({ key, ...stat }) => (
          <StatCard key={key} {...stat} />
        ))}
      </StatGrid>

      <Row>
        <Card>
          <CardHeader>
            <HeaderText>
              <CardTitle>Sales trend</CardTitle>
              <CardSubtitle>Last 7 days</CardSubtitle>
            </HeaderText>
            <HeaderLink to={ROUTE_PATHS.reports}>
              Full report <RightOutlined />
            </HeaderLink>
          </CardHeader>
          <ChartBody>
            <SalesTrendChart data={SALES_TREND} />
          </ChartBody>
        </Card>

        <Card>
          <CardHeader>
            <HeaderText>
              <CardTitle>Pending tasks</CardTitle>
              <CardSubtitle>{PENDING_TASKS.length} items need your attention</CardSubtitle>
            </HeaderText>
          </CardHeader>
          <TaskList>
            {PENDING_TASKS.map((task) => (
              <TaskItem key={task.id}>
                <Checkbox type="checkbox" id={task.id} />
                <TaskText htmlFor={task.id}>{task.label}</TaskText>
                <BadgeText tone={taskTone(task)} dot>
                  {task.note}
                </BadgeText>
              </TaskItem>
            ))}
          </TaskList>
        </Card>
      </Row>

      <Row>
        <Card>
          <CardHeader>
            <HeaderText>
              <CardTitle>Recent sales orders</CardTitle>
            </HeaderText>
            <HeaderLink to={ROUTE_PATHS.sales}>
              View all <RightOutlined />
            </HeaderLink>
          </CardHeader>
          <TableScroll>
            <Table>
              <thead>
                <tr>
                  <Th>Order</Th>
                  <Th>Customer</Th>
                  <Th $align="right">Amount</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map((order) => (
                  <tr key={order.id}>
                    <Td>
                      <OrderRef>{order.reference}</OrderRef>
                    </Td>
                    <Td>
                      <Customer>{order.customerName}</Customer>
                    </Td>
                    <Td $numeric>{order.amount}</Td>
                    <Td>
                      <BadgeText tone={ORDER_TONE[order.status]} dot>
                        {order.status}
                      </BadgeText>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableScroll>
        </Card>

        <Column>
          <Card>
            <CardHeader>
              <HeaderText>
                <CardTitle>Top selling products</CardTitle>
              </HeaderText>
            </CardHeader>
            <CardBody>
              <ProductList>
                {TOP_SELLING_PRODUCTS.map((product, i) => (
                  <ProductRow key={product.id}>
                    <ProductLine>
                      <ProductName>{product.name}</ProductName>
                      <ProductMeta>
                        {product.unitsSold} units · {product.revenue}
                      </ProductMeta>
                    </ProductLine>
                    <Track>
                      <Fill $pct={(product.unitsSold / maxUnits) * 100} $leader={i === 0} />
                    </Track>
                  </ProductRow>
                ))}
              </ProductList>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <HeaderText>
                <CardTitle>Quick actions</CardTitle>
              </HeaderText>
            </CardHeader>
            <CardBody>
              <QuickGrid>
                {QUICK_ACTIONS.map(({ label, icon: Icon, to }) => (
                  <QuickAction key={label} to={to}>
                    <Icon />
                    {label}
                  </QuickAction>
                ))}
              </QuickGrid>
            </CardBody>
          </Card>
        </Column>
      </Row>
    </div>
  );
}
