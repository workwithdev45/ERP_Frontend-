import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { PlusOutlined } from '@ant-design/icons';
import { apiErrorMessage } from '@/api/apiError';
import { Button } from '@/components/common/Button/Button';
import { Card, CardHeader, CardSubtitle, CardTitle } from '@/components/common/Card/Card';
import { FormError } from '@/components/common/FormError/FormError';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { RoleFormModal } from '../components/RoleFormModal';
import { RoleListTable } from '../components/RoleListTable';
import { rbacService } from '../services/rbacService';
import type { RoleDto, RoleUpsertRequest } from '../types/rbac.types';
import { roleLabel } from '../utils/roleLabel';

const HeaderText = styled.div`
  flex: 1;
  min-width: 0;
`;

const Message = styled.div`
  padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[5]};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ErrorWrap = styled.div`
  padding: ${({ theme }) => theme.space[5]};
`;

export function RolesPage() {
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleDto | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  async function loadRoles() {
    setLoadError('');
    try {
      const { data } = await rbacService.listRoles();
      setRoles(data.data);
    } catch (err) {
      setLoadError(apiErrorMessage(err, 'Could not load roles. Please refresh the page.'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRoles();
  }, []);

  function openCreate() {
    setEditingRole(null);
    setError('');
    setModalOpen(true);
  }

  function openEdit(role: RoleDto) {
    setEditingRole(role);
    setError('');
    setModalOpen(true);
  }

  async function handleSubmit(payload: RoleUpsertRequest) {
    setError('');
    setSubmitting(true);
    try {
      if (editingRole) {
        await rbacService.updateRole(editingRole.id, payload);
      } else {
        await rbacService.createRole(payload);
      }
      setModalOpen(false);
      await loadRoles();
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(role: RoleDto) {
    const members = role.userCount ?? 0;
    const warning = members > 0 ? ` ${members} member${members === 1 ? '' : 's'} will lose the access it grants.` : '';
    if (!window.confirm(`Delete the ${roleLabel(role.name)} role?${warning}`)) return;

    setError('');
    setDeleting(true);
    try {
      await rbacService.deleteRole(role.id);
      setModalOpen(false);
      await loadRoles();
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  const customCount = roles.filter((r) => !r.systemRole).length;

  function renderBody() {
    if (loading) return <Message>Loading roles…</Message>;
    if (loadError) {
      return (
        <ErrorWrap>
          <FormError>{loadError}</FormError>
        </ErrorWrap>
      );
    }
    if (roles.length === 0) return <Message>No roles yet. Create one to get started.</Message>;
    return <RoleListTable roles={roles} onEditRole={openEdit} />;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Roles"
        subtitle="ADMIN and All org users are built in. New members get All org users unless you pick another role."
        actions={
          <Button leadingIcon={<PlusOutlined />} onClick={openCreate}>
            Create role
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <HeaderText>
            <CardTitle>All roles</CardTitle>
            <CardSubtitle>
              {roles.length} total · {customCount} custom
            </CardSubtitle>
          </HeaderText>
        </CardHeader>
        {renderBody()}
      </Card>

      <RoleFormModal
        open={modalOpen}
        role={editingRole}
        submitting={submitting}
        deleting={deleting}
        error={error}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </div>
  );
}
