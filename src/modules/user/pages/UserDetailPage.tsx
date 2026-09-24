import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Card } from '@/components/common/Card/Card';
import { PermissionMatrix } from '@/modules/accesscontrol/components/PermissionMatrix';
import { rbacService } from '@/modules/accesscontrol/services/rbacService';
import type { ModuleCode, ModulePermission, PermissionAction } from '@/modules/accesscontrol/types/rbac.types';
import { userService } from '../services/userService';
import { UserStatusBadge } from '../components/UserStatusBadge';
import type { UserSummary } from '../types/user.types';

const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 13px;
  cursor: pointer;
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  margin-bottom: ${({ theme }) => theme.space[5]};
`;

const Name = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.navy};
`;

const Meta = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.space[5]};
`;

const PanelCard = styled(Card)`
  padding: ${({ theme }) => theme.space[5]};
`;

const PanelTitle = styled.div`
  font-weight: 700;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.navy};
  margin-bottom: ${({ theme }) => theme.space[1]};
`;

const PanelHint = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = Number(id);

  const [user, setUser] = useState<UserSummary | null>(null);
  const [modules, setModules] = useState<ModuleCode[]>([]);
  const [actions, setActions] = useState<PermissionAction[]>([]);
  const [permissions, setPermissions] = useState<ModulePermission[]>([]);

  useEffect(() => {
    userService.getById(userId).then(({ data }) => setUser(data.data));
    rbacService.listModules().then(({ data }) => setModules(data.data));
    rbacService.listActions().then(({ data }) => setActions(data.data));
    rbacService.getUserPermissions(userId).then(({ data }) => setPermissions(data.data));
  }, [userId]);

  async function handleToggle(moduleCode: ModuleCode, action: PermissionAction, checked: boolean) {
    const current = permissions.find((p) => p.moduleCode === moduleCode)?.actions ?? [];
    const nextActions = checked ? [...current, action] : current.filter((a) => a !== action);

    if (nextActions.length === 0) {
      await rbacService.revokeModulePermission(userId, moduleCode);
    } else {
      await rbacService.assignModulePermission(userId, moduleCode, nextActions);
    }

    setPermissions((prev) => {
      const withoutModule = prev.filter((p) => p.moduleCode !== moduleCode);
      return nextActions.length === 0 ? withoutModule : [...withoutModule, { moduleCode, actions: nextActions }];
    });
  }

  if (!user) return null;

  return (
    <div>
      <BackLink type="button" onClick={() => navigate('/settings/users')}>
        <ArrowLeftOutlined /> Back to Users
      </BackLink>
      <Head>
        <Name>
          {user.firstName} {user.lastName}
        </Name>
        <UserStatusBadge status={user.status} />
      </Head>
      <Meta>
        {user.email} · Role: {user.roles.join(', ')}
      </Meta>

      <PanelCard>
        <PanelTitle>Module Permissions</PanelTitle>
        <PanelHint>
          Fine-grained access on top of {user.firstName}&apos;s role — grant only the actions they need per module.
        </PanelHint>
        <PermissionMatrix modules={modules} actions={actions} permissions={permissions} onToggle={handleToggle} />
      </PanelCard>
    </div>
  );
}
