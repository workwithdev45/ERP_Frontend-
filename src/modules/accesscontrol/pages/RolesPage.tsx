import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import styled from 'styled-components';
import { Button } from '@/components/common/Button/Button';
import { Card } from '@/components/common/Card/Card';
import { RoleDetailModal } from '../components/RoleDetailModal';
import { RoleFormModal } from '../components/RoleFormModal';
import { RoleListTable } from '../components/RoleListTable';
import { rbacService } from '../services/rbacService';
import type { RoleDto, RoleUpsertRequest } from '../types/rbac.types';

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

export function RolesPage() {
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<RoleDto | null>(null);

  async function loadRoles() {
    const { data } = await rbacService.listRoles();
    setRoles(data.data);
  }

  useEffect(() => {
    loadRoles();
  }, []);

  async function handleCreate(payload: RoleUpsertRequest) {
    setError('');
    setSubmitting(true);
    try {
      await rbacService.createRole(payload);
      setModalOpen(false);
      await loadRoles();
    } catch (err) {
      if (isAxiosError<{ message?: string }>(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleRoleUpdated(updated: RoleDto) {
    setRoles((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setSelectedRole(null);
  }

  function handleRoleDeleted(deleted: RoleDto) {
    setRoles((prev) => prev.filter((r) => r.id !== deleted.id));
    setSelectedRole(null);
  }

  return (
    <div>
      <Head>
        <div>
          <PageTitle>Roles</PageTitle>
          <PageSubtitle>ADMIN and USER are built-in; add custom roles for specific teams.</PageSubtitle>
        </div>
        <Button onClick={() => setModalOpen(true)}>+ Create role</Button>
      </Head>

      <TableCard>
        <RoleListTable roles={roles} onViewRole={setSelectedRole} />
      </TableCard>

      <RoleFormModal
        open={modalOpen}
        submitting={submitting}
        error={error}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />

      {selectedRole && (
        <RoleDetailModal
          role={selectedRole}
          onClose={() => setSelectedRole(null)}
          onUpdated={handleRoleUpdated}
          onDeleted={handleRoleDeleted}
        />
      )}
    </div>
  );
}
