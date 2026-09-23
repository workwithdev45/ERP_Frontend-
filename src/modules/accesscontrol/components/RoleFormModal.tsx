import { useMemo, useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common/Input/Input';
import { Modal } from '@/components/common/Modal/Modal';
import type { PermissionDto, RoleUpsertRequest } from '../types/rbac.types';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

const GroupLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.space[2]};
`;

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  padding: 2px 0;
`;

const PermissionList = styled.div`
  max-height: 260px;
  overflow-y: auto;
  padding-right: ${({ theme }) => theme.space[2]};
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
`;

interface RoleFormModalProps {
  open: boolean;
  permissions: PermissionDto[];
  submitting: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (payload: RoleUpsertRequest) => void;
}

export function RoleFormModal({ open, permissions, submitting, error, onClose, onSubmit }: RoleFormModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const byModule = useMemo(() => {
    const grouped = new Map<string, PermissionDto[]>();
    for (const permission of permissions) {
      const list = grouped.get(permission.module) ?? [];
      list.push(permission);
      grouped.set(permission.module, list);
    }
    return grouped;
  }, [permissions]);

  function toggle(id: number, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({ name: name.toUpperCase().replace(/\s+/g, '_'), description, permissionIds: [...selected] });
  }

  return (
    <Modal open={open} title="Create a custom role" onClose={onClose}>
      <Form onSubmit={handleSubmit}>
        <Input id="roleName" label="Role name" placeholder="WAREHOUSE_SUPERVISOR" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input id="roleDescription" label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

        <PermissionList>
          {[...byModule.entries()].map(([module, modulePermissions]) => (
            <div key={module}>
              <GroupLabel>{module}</GroupLabel>
              {modulePermissions.map((permission) => (
                <CheckboxRow key={permission.id}>
                  <input
                    type="checkbox"
                    checked={selected.has(permission.id)}
                    onChange={(e) => toggle(permission.id, e.target.checked)}
                  />
                  {permission.name}
                </CheckboxRow>
              ))}
            </div>
          ))}
        </PermissionList>

        {error && <ErrorText>{error}</ErrorText>}
        <Button type="submit" fullWidth loading={submitting}>
          Create role
        </Button>
      </Form>
    </Modal>
  );
}
