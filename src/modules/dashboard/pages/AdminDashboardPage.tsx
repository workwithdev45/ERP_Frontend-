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
} from '@ant-design/icons';
import { Card, CardBody, CardHeader, CardSubtitle, CardTitle } from '@/components/common/Card/Card';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { companyService } from '@/modules/company/services/companyService';
import { userService } from '@/modules/user/services/userService';
import { ROUTE_PATHS } from '@/routes/routePaths';

const ChecklistCard = styled(Card)`
  max-width: 720px;
`;

const ChecklistItem = styled(Link)`
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

const ItemIcon = styled.div<{ $done: boolean }>`
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  background: ${({ theme, $done }) => ($done ? theme.colors.successLight : theme.colors.primaryLight)};
  color: ${({ theme, $done }) => ($done ? theme.colors.successDark : theme.colors.primary)};
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

/**
 * G16: the dashboard used to show hardcoded sample figures with no real data behind them.
 * Business modules aren't built yet (see the product plan's baseline), so there's nothing real
 * to chart — this shows an honest setup checklist instead of numbers nobody actually posted.
 */
export function AdminDashboardPage() {
  const [checklist, setChecklist] = useState<ChecklistState>({ companyDetailsDone: false, teamInvitedDone: false });
  const [loading, setLoading] = useState(true);
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    Promise.allSettled([companyService.get(), userService.list(0, 5)]).then(([companyResult, usersResult]) => {
      setChecklist({
        companyDetailsDone:
          companyResult.status === 'fulfilled' && !!companyResult.value.data.data.legalName,
        teamInvitedDone:
          usersResult.status === 'fulfilled' && usersResult.value.data.data.totalElements > 1,
      });
      setLoading(false);
    });
  }, []);

  const items = [
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

  const remaining = items.filter((item) => !item.done).length;

  return (
    <div>
      <PageHeader eyebrow={today} title="Welcome to your workspace" subtitle="A few steps to get set up." />

      <ChecklistCard>
        <CardHeader>
          <div>
            <CardTitle>Setup checklist</CardTitle>
            <CardSubtitle>
              {loading ? 'Checking your progress…' : remaining === 0 ? 'All set!' : `${remaining} step${remaining === 1 ? '' : 's'} left`}
            </CardSubtitle>
          </div>
        </CardHeader>
        {items.map((item) => (
          <ChecklistItem key={item.key} to={item.to}>
            <ItemIcon $done={item.done}>{item.done ? <CheckCircleFilled /> : item.icon}</ItemIcon>
            <ItemText>
              <ItemTitle>{item.title}</ItemTitle>
              <ItemDescription>{item.description}</ItemDescription>
            </ItemText>
            <RightOutlined />
          </ChecklistItem>
        ))}
      </ChecklistCard>

      <Card style={{ marginTop: 20, maxWidth: 720 }}>
        <CardBody>
          <EmptyState>
            <RocketOutlined />
            <div>Your sales, purchase, and inventory figures will show up here once you start recording activity.</div>
          </EmptyState>
        </CardBody>
      </Card>
    </div>
  );
}
