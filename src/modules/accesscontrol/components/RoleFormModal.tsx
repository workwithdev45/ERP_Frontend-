import { useEffect, useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { DeleteOutlined } from '@ant-design/icons';
import { BadgeText } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { FormError } from '@/components/common/FormError/FormError';
import { Input } from '@/components/common/Input/Input';
import { Modal } from '@/components/common/Modal/Modal';
import type { RoleDto, RoleUpsertRequest } from '../types/rbac.types';
import { roleLabel } from '../utils/roleLabel';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  margin-top: -${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textBody};
`;

const TextArea = styled.textarea`
  min-height: 84px;
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.xs};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSize.md};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};
  resize: vertical;
  transition:
    border-color ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.textDisabled};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.borderFocus};
    box-shadow: ${({ theme }) => theme.shadow.focus};
  }
`;

const FooterSpacer = styled.div`
  flex: 1;
`;

const FORM_ID = 'role-form';

/** Role names are stored as upper snake case (e.g. WAREHOUSE_SUPERVISOR). */
function toRoleName(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, '_');
}

interface RoleFormModalProps {
  open: boolean;
  /** Present when editing an existing role; omitted when creating one. */
  role?: RoleDto | null;
  submitting: boolean;
  deleting?: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (payload: RoleUpsertRequest) => void;
  onDelete?: (role: RoleDto) => void;
}

export function RoleFormModal({ open, role, submitting, deleting, error, onClose, onSubmit, onDelete }: RoleFormModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (open) {
      setName(role ? (role.systemRole ? roleLabel(role.name) : role.name) : '');
      setDescription(role?.description ?? '');
    }
  }, [open, role]);

  const isEdit = !!role;
  const isValid = !!name.trim();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({
      name: role?.systemRole ? role.name : toRoleName(name),
      // An empty string (not undefined) so clearing the field actually clears it.
      description: description.trim(),
    });
  }

  return (
    <Modal
      open={open}
      title={isEdit ? 'Edit role' : 'Create role'}
      onClose={onClose}
      footer={
        <>
          {isEdit && !role.systemRole && onDelete && (
            <Button
              type="button"
              variant="ghost"
              leadingIcon={<DeleteOutlined />}
              loading={deleting}
              onClick={() => onDelete(role)}
            >
              Delete
            </Button>
          )}
          <FooterSpacer />
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={!isValid} loading={submitting}>
            {isEdit ? 'Save changes' : 'Create role'}
          </Button>
        </>
      }
    >
      <Form id={FORM_ID} onSubmit={handleSubmit}>
        {isEdit && (
          <Meta>
            <BadgeText tone={role.systemRole ? 'neutral' : 'primary'}>{role.systemRole ? 'System role' : 'Custom role'}</BadgeText>
            {role.userCount ?? 0} member{role.userCount === 1 ? '' : 's'}
          </Meta>
        )}
        <Input
          id="roleName"
          label="Role name"
          placeholder="WAREHOUSE_SUPERVISOR"
          hint={role?.systemRole ? 'Built-in roles cannot be renamed.' : 'Saved in capitals with underscores.'}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={role?.systemRole}
          required
          autoFocus={!isEdit}
        />
        <Field>
          <Label htmlFor="roleDescription">Description</Label>
          <TextArea
            id="roleDescription"
            placeholder="What this role is for, e.g. Manages stock across warehouses"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
        {!isEdit && <Meta>Set what this role can do from the Permissions page once it's created.</Meta>}
        {error && <FormError>{error}</FormError>}
      </Form>
    </Modal>
  );
}
