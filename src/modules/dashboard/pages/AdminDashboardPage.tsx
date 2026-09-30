import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  BankOutlined,
  CheckCircleFilled,
  RightOutlined,
  RocketOutlined,
  ToolOutlined,
  UserAddOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { apiErrorMessage } from '@/api/apiError';
import { Card, CardBody, CardHeader, CardSubtitle, CardTitle } from '@/components/common/Card/Card';
import { FormError } from '@/components/common/FormError/FormError';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { usePermission } from '@/hooks/usePermission';
import { companyService } from '@/modules/company/services/companyService';
import { TrendChart } from '@/modules/reports/components/TrendChart';
import { reportService } from '@/modules/reports/services/reportService';
import type { DashboardSummary, Ranked } from '@/modules/reports/types/report.types';
import { formatMoney } from '@/modules/trade/utils/format';
import { userService } from '@/modules/user/services/userService';
import { ROUTE_PATHS } from '@/routes/routePaths';

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[5]};
`;

const Tiles = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.space[4]};
`;

const Tile = styled(Card)`
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[5]};
`;

const TileLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const TileValue = styled.div`
  margin-top: ${({ theme }) => theme.space[1]};
  font-size: 24px;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textStrong};
  font-variant-numeric: tabular-nums;
`;

const TileNote = styled.div<{ $tone?: 'danger' | 'muted' }>`
  margin-top: ${({ theme }) => theme.space[1]};
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme, $tone }) => ($tone === 'danger' ? theme.colors.danger : theme.colors.textMuted)};
`;

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.space[5]};
`;

const RankList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    justify-content: space-between;
    gap: ${({ theme }) => theme.space[3]};
    padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[5]};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    font-size: ${({ theme }) => theme.fontSize.md};
    color: ${({ theme }) => theme.colors.textBody};
  }

  li:last-child {
    border-bottom: none;
  }

  span.value {
    font-variant-numeric: tabular-nums;
    color: ${({ theme }) => theme.colors.textStrong};
    white-space: nowrap;
  }

  span.sub {
    font-size: ${({ theme }) => theme.fontSize.xs};
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const RowLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[5]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  text-decoration: none;
  color: inherit;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
  }
`;

const ItemIcon = styled.div<{ $done?: boolean; $warn?: boolean }>`
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  background: ${({ theme, $done, $warn }) => ($done ? theme.colors.successLight : $warn ? theme.colors.warningLight : theme.colors.primaryLight)};
  color: ${({ theme, $done, $warn }) => ($done ? theme.colors.successDark : $warn ? theme.colors.warning : theme.colors.primary)};
`;

const ItemText = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemTitle = styled.div`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textStrong};
`;

const ItemDescription = styled.div`
  margin-top: 2px;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[5]};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};

  .anticon {
    font-size: 32px;
    color: ${({ theme }) => theme.colors.textDisabled};
    margin-bottom: ${({ theme }) => theme.space[3]};
  }
`;

interface ChecklistState {
  companyDetailsDone: boolean;
  teamInvitedDone: boolean;
}

function change(current: number, previous: number): { text: string; tone?: 'danger' | 'muted' } {
  if (!previous) return { text: current ? 'No sales last month to compare' : 'Nothing yet this month', tone: 'muted' };
  const pct = Math.round(((current - previous) / previous) * 100);
  return { text: `${pct >= 0 ? '▲' : '▼'} ${Math.abs(pct)}% vs last month`, tone: pct < 0 ? 'danger' : 'muted' };
}

function Kpi({ label, value, note }: { label: string; value: string; note?: { text: string; tone?: 'danger' | 'muted' } }) {
  return (
    <Tile>
      <TileLabel>{label}</TileLabel>
      <TileValue>{value}</TileValue>
      {note && <TileNote $tone={note.tone}>{note.text}</TileNote>}
    </Tile>
  );
}

function RankCard({ title, subtitle, rows, unit }: { title: string; subtitle: string; rows: Ranked[]; unit?: boolean }) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{title}</CardTitle>
          <CardSubtitle>{subtitle}</CardSubtitle>
        </div>
      </CardHeader>
      {rows.length === 0 ? (
        <EmptyState>No sales in the last 90 days.</EmptyState>
      ) : (
        <RankList>
          {rows.map((row) => (
            <li key={row.id}>
              <span>
                {row.name}
                {unit && row.quantity != null && <span className="sub"> · {row.quantity} sold</span>}
              </span>
              <span className="value">{formatMoney(row.value)}</span>
            </li>
          ))}
        </RankList>
      )}
    </Card>
  );
}

/**
 * W14 live owner dashboard: this month's sales, purchases and cash, what's owed each way, stock,
 * and what needs attention. The setup checklist stays until every step is done.
 */
export function AdminDashboardPage() {
  const { canAccess } = usePermission();
  const canSeeFigures = canAccess('REPORTS_VIEW');
  const [checklist, setChecklist] = useState<ChecklistState>({ companyDetailsDone: false, teamInvitedDone: false });
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    Promise.allSettled([companyService.get(), userService.list(0, 5)]).then(([companyResult, usersResult]) => {
      setChecklist({
        companyDetailsDone: companyResult.status === 'fulfilled' && !!companyResult.value.data.data.legalName,
        teamInvitedDone: usersResult.status === 'fulfilled' && usersResult.value.data.data.totalElements > 1,
      });
      if (!canSeeFigures) setLoading(false);
    });
    if (canSeeFigures) {
      reportService
        .dashboard()
        .then((res) => setSummary(res.data.data))
        .catch((err) => setError(apiErrorMessage(err, 'Could not load your business figures.')))
        .finally(() => setLoading(false));
    }
  }, [canSeeFigures]);

  const setupItems = [
    {
      key: 'company',
      icon: <BankOutlined />,
      done: checklist.companyDetailsDone,
      title: 'Add your company details',
      description: 'Legal name, GSTIN, and address — used on every invoice.',
      to: ROUTE_PATHS.settings.company,
    },
    {
      key: 'team',
      icon: <UserAddOutlined />,
      done: checklist.teamInvitedDone,
      title: 'Invite your team',
      description: 'Bring in the people who’ll use this workspace day to day.',
      to: ROUTE_PATHS.settings.users,
    },
    {
      key: 'modules',
      icon: <ToolOutlined />,
      done: false,
      title: 'Choose which modules you need',
      description: 'Switch off anything your business doesn’t use.',
      to: ROUTE_PATHS.settings.modules,
    },
  ];
  const remaining = setupItems.filter((item) => !item.done).length;

  const attention: { key: string; title: string; description: string; to: string; show: boolean }[] = summary
    ? [
        {
          key: 'overdue-invoices',
          show: summary.overdueInvoices > 0,
          title: `${summary.overdueInvoices} overdue invoice${summary.overdueInvoices === 1 ? '' : 's'} · ${formatMoney(summary.receivablesOverdue)}`,
          description: 'Customers past their due date — follow up for payment.',
          to: ROUTE_PATHS.sales,
        },
        {
          key: 'overdue-bills',
          show: summary.overdueBills > 0,
          title: `${summary.overdueBills} overdue bill${summary.overdueBills === 1 ? '' : 's'} · ${formatMoney(summary.payablesOverdue)}`,
          description: 'Vendor bills past their due date.',
          to: ROUTE_PATHS.purchase,
        },
        {
          key: 'po-approval',
          show: summary.purchaseOrdersAwaitingApproval > 0,
          title: `${summary.purchaseOrdersAwaitingApproval} purchase order${summary.purchaseOrdersAwaitingApproval === 1 ? '' : 's'} awaiting approval`,
          description: 'Drafts can’t be received until they’re approved.',
          to: ROUTE_PATHS.purchase,
        },
        {
          key: 'low-stock',
          show: summary.lowStockItems > 0,
          title: `${summary.lowStockItems} item${summary.lowStockItems === 1 ? '' : 's'} at or below reorder level`,
          description: 'See Purchase → Reorder for what to buy.',
          to: ROUTE_PATHS.purchase,
        },
        {
          key: 'undelivered',
          show: summary.openSalesOrders > 0,
          title: `${summary.openSalesOrders} sales order${summary.openSalesOrders === 1 ? '' : 's'} to deliver · ${formatMoney(summary.undeliveredOrderValue)}`,
          description: 'Confirmed orders with items still to ship.',
          to: ROUTE_PATHS.sales,
        },
      ].filter((item) => item.show)
    : [];

  const hasActivity = !!summary && summary.trend.some((p) => p.sales || p.purchases);

  return (
    <div>
      <PageHeader
        eyebrow={today}
        title={canSeeFigures ? 'Business overview' : 'Welcome to your workspace'}
        subtitle={canSeeFigures ? 'This month at a glance. Sales and purchases exclude GST.' : 'A few steps to get set up.'}
      />

      <Stack>
        {error && <FormError>{error}</FormError>}

        {summary && (
          <>
            <Tiles>
              <Kpi label="Sales this month" value={formatMoney(summary.salesThisMonth)} note={change(summary.salesThisMonth, summary.salesLastMonth)} />
              <Kpi
                label="Purchases this month"
                value={formatMoney(summary.purchasesThisMonth)}
                note={{ text: `Last month ${formatMoney(summary.purchasesLastMonth)}`, tone: 'muted' }}
              />
              <Kpi
                label="To collect"
                value={formatMoney(summary.receivablesOutstanding)}
                note={
                  summary.receivablesOverdue > 0
                    ? { text: `${formatMoney(summary.receivablesOverdue)} overdue`, tone: 'danger' }
                    : { text: 'Nothing overdue', tone: 'muted' }
                }
              />
              <Kpi
                label="To pay"
                value={formatMoney(summary.payablesOutstanding)}
                note={
                  summary.payablesOverdue > 0
                    ? { text: `${formatMoney(summary.payablesOverdue)} overdue`, tone: 'danger' }
                    : { text: 'Nothing overdue', tone: 'muted' }
                }
              />
              <Kpi
                label="Cash this month"
                value={formatMoney(summary.receivedThisMonth - summary.paidThisMonth)}
                note={{ text: `In ${formatMoney(summary.receivedThisMonth)} · out ${formatMoney(summary.paidThisMonth)}`, tone: 'muted' }}
              />
              <Kpi
                label="Stock value"
                value={formatMoney(summary.stockValue)}
                note={{ text: `${summary.lowStockItems} low-stock item${summary.lowStockItems === 1 ? '' : 's'}`, tone: summary.lowStockItems ? 'danger' : 'muted' }}
              />
            </Tiles>

            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Sales vs purchases</CardTitle>
                  <CardSubtitle>Last six months, excluding GST, net of returns</CardSubtitle>
                </div>
              </CardHeader>
              <CardBody>
                {hasActivity ? (
                  <TrendChart points={summary.trend} />
                ) : (
                  <EmptyState>
                    <RocketOutlined />
                    <div>Your sales and purchases will chart here once you record invoices and bills.</div>
                  </EmptyState>
                )}
              </CardBody>
            </Card>

            <Columns>
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>Needs attention</CardTitle>
                    <CardSubtitle>{attention.length ? `${attention.length} item${attention.length === 1 ? '' : 's'}` : 'All clear'}</CardSubtitle>
                  </div>
                </CardHeader>
                {attention.length === 0 ? (
                  <EmptyState>
                    <CheckCircleFilled />
                    <div>Nothing overdue, nothing waiting on you.</div>
                  </EmptyState>
                ) : (
                  attention.map((item) => (
                    <RowLink key={item.key} to={item.to}>
                      <ItemIcon $warn>
                        <WarningOutlined />
                      </ItemIcon>
                      <ItemText>
                        <ItemTitle>{item.title}</ItemTitle>
                        <ItemDescription>{item.description}</ItemDescription>
                      </ItemText>
                      <RightOutlined />
                    </RowLink>
                  ))
                )}
              </Card>
              <RankCard title="Top items" subtitle="Last 90 days by sales value" rows={summary.topProducts} unit />
              <RankCard title="Top customers" subtitle="Last 90 days by sales value" rows={summary.topCustomers} />
            </Columns>
          </>
        )}

        {!loading && remaining > 0 && (
          <Card style={{ maxWidth: 720 }}>
            <CardHeader>
              <div>
                <CardTitle>Setup checklist</CardTitle>
                <CardSubtitle>{`${remaining} step${remaining === 1 ? '' : 's'} left`}</CardSubtitle>
              </div>
            </CardHeader>
            {setupItems.map((item) => (
              <RowLink key={item.key} to={item.to}>
                <ItemIcon $done={item.done}>{item.done ? <CheckCircleFilled /> : item.icon}</ItemIcon>
                <ItemText>
                  <ItemTitle>{item.title}</ItemTitle>
                  <ItemDescription>{item.description}</ItemDescription>
                </ItemText>
                <RightOutlined />
              </RowLink>
            ))}
          </Card>
        )}

        {loading && <EmptyState>Loading…</EmptyState>}
      </Stack>
    </div>
  );
}

