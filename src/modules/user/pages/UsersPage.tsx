import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import styled from 'styled-components';
import { Button } from '@/components/common/Button/Button';
import { Card } from '@/components/common/Card/Card';
import { UserDetailModal } from '../components/UserDetailModal';
import { UserFormModal } from '../components/UserFormModal';
import { UserListTable } from '../components/UserListTable';
import { userService } from '../services/userService';
import type { InviteUserRequest, UserSummary } from '../types/user.types';

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.space[5]};
`;

const PageTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.navy};
`;

const PageSubtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const TableCard = styled(Card)`
  padding: ${({ theme }) => theme.space[4]};
`;

const EmptyState = styled.p`
  padding: ${({ theme }) => theme.space[6]};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export function UsersPage() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);

  async function loadUsers() {
    setLoading(true);
    try {
      const { data } = await userService.list();
      setUsers(data.data.content);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleInvite(payload: InviteUserRequest) {
    setInviteError('');
    setSubmitting(true);
    try {
      await userService.invite(payload);
      setModalOpen(false);
      await loadUsers();
    } catch (err) {
      if (isAxiosError<{ message?: string }>(err) && err.response?.data?.message) {
        setInviteError(err.response.data.message);
      } else {
        setInviteError('Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleUserUpdated(updated: UserSummary) {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    setSelectedUser(null);
  }

  return (
    <div>
      <Head>
        <div>
          <PageTitle>Members</PageTitle>
          <PageSubtitle>Invite teammates and manage their access.</PageSubtitle>
        </div>
        <Button onClick={() => setModalOpen(true)}>+ Invite member</Button>
      </Head>

      <TableCard>
        {loading ? (
          <EmptyState>Loading…</EmptyState>
        ) : users.length === 0 ? (
          <EmptyState>No members yet. Invite your first teammate.</EmptyState>
        ) : (
          <UserListTable users={users} onViewUser={setSelectedUser} />
        )}
      </TableCard>

      <UserFormModal
        open={modalOpen}
        submitting={submitting}
        error={inviteError}
        onClose={() => setModalOpen(false)}
        onSubmit={handleInvite}
      />

      {selectedUser && (
        <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} onUpdated={handleUserUpdated} />
      )}
    </div>
  );
}
