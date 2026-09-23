import { useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common/Input/Input';
import { Modal } from '@/components/common/Modal/Modal';
import type { RoleDto } from '@/modules/accesscontrol/types/rbac.types';
import type { InviteUserRequest } from '../types/user.types';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[1]};
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const Select = styled.select`
  height: 48px;
  padding: 0 ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 14px;
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
`;

interface UserFormModalProps {
  open: boolean;
  roles: RoleDto[];
  submitting: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (payload: InviteUserRequest) => void;
}

export function UserFormModal({ open, roles, submitting, error, onClose, onSubmit }: UserFormModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState<string>(roles[0]?.id ? String(roles[0].id) : '');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!roleId) return;
    onSubmit({ firstName, lastName, email, roleIds: [Number(roleId)] });
  }

  return (
    <Modal open={open} title="Invite a teammate" onClose={onClose}>
      <Form onSubmit={handleSubmit}>
        <Input
          id="firstName"
          label="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <Input
          id="lastName"
          label="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <Input
          id="email"
          type="email"
          label="Email"
          placeholder="teammate@company.in"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Field>
          <Label htmlFor="roleId">Role</Label>
          <Select id="roleId" value={roleId} onChange={(e) => setRoleId(e.target.value)} required>
            <option value="" disabled>
              Select a role
            </option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </Select>
        </Field>
        {error && <ErrorText>{error}</ErrorText>}
        <Button type="submit" fullWidth loading={submitting}>
          Send invite
        </Button>
      </Form>
    </Modal>
  );
}
