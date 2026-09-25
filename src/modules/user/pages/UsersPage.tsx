import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { SearchOutlined, TeamOutlined, UserAddOutlined } from '@ant-design/icons';
import { apiErrorMessage } from '@/api/apiError';
import { Button } from '@/components/common/Button/Button';
import { Card, CardHeader, CardSubtitle, CardTitle } from '@/components/common/Card/Card';
import { FormError } from '@/components/common/FormError/FormError';
import { Input } from '@/components/common/Input/Input';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { Select } from '@/components/common/Select/Select';
import { rbacService } from '@/modules/accesscontrol/services/rbacService';
import type { RoleDto } from '@/modules/accesscontrol/types/rbac.types';
import { roleLabel } from '@/modules/accesscontrol/utils/roleLabel';
import { memberName } from '../components/MemberAvatar';
import { UserDetailModal } from '../components/UserDetailModal';
import { UserFormModal } from '../components/UserFormModal';
import { UserListTable } from '../components/UserListTable';
import { LABEL_BY_STATUS } from '../components/UserStatusBadge';
import { userService } from '../services/userService';
import type { InviteUserRequest, UserStatus, UserSummary } from '../types/user.types';

const HeaderText = styled.div`
  flex: 1;
  min-width: 0;
`;

const Filters = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[2]};

  > :first-child {
    width: 240px;
  }

  > :last-child {
    width: 170px;
  }

  @media (max-width: 720px) {
    display: none;
  }
`;

const Empty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[5]};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSize.md};

  .anticon {
    font-size: 28px;
    color: ${({ theme }) => theme.colors.textDisabled};
  }
`;

const EmptyTitle = styled.div`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textStrong};
`;

const ErrorWrap = styled.div`
  padding: ${({ theme }) => theme.space[5]};
`;

const STATUS_FILTER_OPTIONS = [
  { value: 'ALL', label: 'All statuses' },
  ...(Object.keys(LABEL_BY_STATUS) as UserStatus[]).map((status) => ({ value: status, label: LABEL_BY_STATUS[status] })),
];

export function UsersPage() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | UserStatus>('ALL');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);

  async function loadUsers() {
    setLoading(true);
    setLoadError('');
    try {
      const { data } = await userService.list(0, 100);
      setUsers(data.data.content);
    } catch (err) {
      setLoadError(apiErrorMessage(err, 'Could not load members. Please refresh the page.'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
    rbacService
      .listRoles()
      .then(({ data }) => setRoles(data.data))
      .catch(() => {
        /* Without the list, invites fall back to the default role. */
      });
  }, []);

  const visibleUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter(
      (user) =>
        (statusFilter === 'ALL' || user.status === statusFilter) &&
        (!q ||
          memberName(user).toLowerCase().includes(q) ||
          user.email.toLowerCase().includes(q) ||
          user.roles.some((role) => roleLabel(role).toLowerCase().includes(q))),
    );
  }, [users, query, statusFilter]);

  const activeCount = users.filter((u) => u.status === 'ACTIVE').length;
  const pendingCount = users.filter((u) => u.status === 'PENDING_VERIFICATION').length;

  function openInvite() {
    setInviteError('');
    setInviteOpen(true);
  }

  async function handleInvite(payload: InviteUserRequest) {
    setInviteError('');
    setSubmitting(true);
    try {
      await userService.invite(payload);
      setInviteOpen(false);
      await loadUsers();
    } catch (err) {
      setInviteError(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  function handleUserUpdated(updated: UserSummary) {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    setSelectedUser(null);
  }

  async function handleDeactivate(user: UserSummary) {
    if (!window.confirm(`Deactivate ${memberName(user)}? They'll lose access to this workspace.`)) return;
    try {
      await userService.deactivate(user.id);
      await loadUsers();
    } catch (err) {
      setLoadError(apiErrorMessage(err, 'Could not deactivate this member.'));
    }
  }

  async function handleReactivate(user: UserSummary) {
    try {
      const { data } = await userService.reactivate(user.id);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? data.data : u)));
    } catch (err) {
      setLoadError(apiErrorMessage(err, 'Could not reactivate this member.'));
    }
  }

  async function handleResendInvite(user: UserSummary) {
    try {
      await userService.resendInvite(user.id);
    } catch (err) {
      setLoadError(apiErrorMessage(err, 'Could not resend the invite.'));
    }
  }

  function renderBody() {
    if (loading) {
      return <Empty>Loading members…</Empty>;
    }
    if (loadError) {
      return (
        <ErrorWrap>
          <FormError>{loadError}</FormError>
        </ErrorWrap>
      );
    }
    if (users.length === 0) {
      return (
        <Empty>
          <TeamOutlined />
          <EmptyTitle>No members yet</EmptyTitle>
          Invite your first teammate to start working together.
          <Button leadingIcon={<UserAddOutlined />} onClick={openInvite}>
            Invite member
          </Button>
        </Empty>
      );
    }
    if (visibleUsers.length === 0) {
      return <Empty>No members match your filters.</Empty>;
    }
    return (
      <UserListTable
        users={visibleUsers}
        onViewUser={setSelectedUser}
        onDeactivate={handleDeactivate}
        onReactivate={handleReactivate}
        onResendInvite={handleResendInvite}
      />
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Members"
        subtitle="Invite teammates, assign roles and manage who can sign in."
        actions={
          <Button leadingIcon={<UserAddOutlined />} onClick={openInvite}>
            Invite member
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <HeaderText>
            <CardTitle>All members</CardTitle>
            <CardSubtitle>
              {users.length} total · {activeCount} active
              {pendingCount > 0 && ` · ${pendingCount} invite${pendingCount === 1 ? '' : 's'} pending`}
            </CardSubtitle>
          </HeaderText>
          <Filters>
            <Input
              aria-label="Search members"
              placeholder="Search name, email or role"
              prefixIcon={<SearchOutlined />}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Select
              aria-label="Filter by status"
              value={statusFilter}
              options={STATUS_FILTER_OPTIONS}
              onChange={(e) => setStatusFilter(e.target.value as 'ALL' | UserStatus)}
            />
          </Filters>
        </CardHeader>
        {renderBody()}
      </Card>

      <UserFormModal
        open={inviteOpen}
        roles={roles}
        submitting={submitting}
        error={inviteError}
        onClose={() => setInviteOpen(false)}
        onSubmit={handleInvite}
      />

      {selectedUser && (
        <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} onUpdated={handleUserUpdated} />
      )}
    </div>
  );
}
