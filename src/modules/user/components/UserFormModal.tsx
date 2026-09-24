import { useEffect, useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { SendOutlined } from '@ant-design/icons';
import { Button } from '@/components/common/Button/Button';
import { FormError } from '@/components/common/FormError/FormError';
import { Input } from '@/components/common/Input/Input';
import { Modal } from '@/components/common/Modal/Modal';
import { TagPicker, type TagPickerOption } from '@/components/common/TagPicker/TagPicker';
import { DEFAULT_ROLE_LABEL, roleLabel } from '@/modules/accesscontrol/utils/roleLabel';
import type { RoleDto } from '@/modules/accesscontrol/types/rbac.types';
import type { InviteUserRequest } from '../types/user.types';

const Intro = styled.p`
  margin-top: -${({ theme }) => theme.space[3]};
  margin-bottom: ${({ theme }) => theme.space[5]};
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.space[4]};

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const RoleHint = styled.span`
  margin-top: -${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const FORM_ID = 'invite-member-form';

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
  const [selectedRoles, setSelectedRoles] = useState<TagPickerOption[]>([]);

  useEffect(() => {
    if (open) {
      setFirstName('');
      setLastName('');
      setEmail('');
      setSelectedRoles([]);
    }
  }, [open]);

  const isValid = !!firstName.trim() && !!lastName.trim() && !!email.trim();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      // No roles picked: leave it to the backend, which assigns All org users.
      roleIds: selectedRoles.length > 0 ? selectedRoles.map((r) => r.id) : undefined,
    });
  }

  const roleOptions = roles.map((r) => ({ id: r.id, label: roleLabel(r.name) }));

  function addRole(roleId: number) {
    const role = roleOptions.find((r) => r.id === roleId);
    if (role) setSelectedRoles((prev) => [...prev, role]);
  }

  return (
    <Modal
      open={open}
      title="Invite member"
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={!isValid} loading={submitting} leadingIcon={<SendOutlined />}>
            Send invite
          </Button>
        </>
      }
    >
      <Intro>
        They&apos;ll get an email with a link to set their password and sign in.
      </Intro>
      <Form id={FORM_ID} onSubmit={handleSubmit}>
        <Row>
          <Input
            id="firstName"
            label="First name"
            placeholder="Sunita"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            autoFocus
          />
          <Input
            id="lastName"
            label="Last name"
            placeholder="Sharma"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </Row>
        <Input
          id="email"
          type="email"
          label="Work email"
          placeholder="teammate@company.in"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TagPicker
          id="inviteRoles"
          label="Role"
          selected={selectedRoles}
          options={roleOptions}
          placeholder={`${DEFAULT_ROLE_LABEL} (default)`}
          onAdd={addRole}
          onRemove={(roleId) => setSelectedRoles((prev) => prev.filter((r) => r.id !== roleId))}
        />
        <RoleHint>Leave empty to give them {DEFAULT_ROLE_LABEL}. You can change roles later.</RoleHint>
        {error && <FormError>{error}</FormError>}
      </Form>
    </Modal>
  );
}
