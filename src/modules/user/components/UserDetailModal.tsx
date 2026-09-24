import { useEffect, useState, type FormEvent } from 'react';
import { isAxiosError } from 'axios';
import styled from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common/Input/Input';
import { TagPicker } from '@/components/common/TagPicker/TagPicker';
import { rbacService } from '@/modules/accesscontrol/services/rbacService';
import { userService } from '../services/userService';
import type { UserStatus, UserSummary, UpdateUserRequest } from '../types/user.types';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: ${({ theme }) => theme.space[4]};
`;

const Panel = styled.div`
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.bg};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.space[6]};
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.space[5]};
  right: ${({ theme }) => theme.space[5]};
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.bgSubtle};
  }
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.navy};
  margin-bottom: ${({ theme }) => theme.space[5]};
  padding-right: ${({ theme }) => theme.space[8]};
`;

const AvatarWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.space[5]};
`;

const Avatar = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 24px;
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
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StatusSelect = styled.select`
  height: 44px;
  padding: 0 ${({ theme }) => theme.space[4]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.bg};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.borderFocus};
  }
`;

const StatusWarning = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.danger};
  font-weight: 600;
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space[3]};
  margin-top: ${({ theme }) => theme.space[2]};
`;

const STATUS_OPTIONS: UserStatus[] = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'];

interface UserDetailModalProps {
  user: UserSummary;
  onClose: () => void;
  onUpdated: (user: UserSummary) => void;
}

export function UserDetailModal({ user, onClose, onUpdated }: UserDetailModalProps) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber ?? '');
  const [status, setStatus] = useState<UserStatus>(user.status);
  const [roles, setRoles] = useState<{ id: number; name: string }[]>(
    user.roleIds.map((id, idx) => ({ id, name: user.roles[idx] ?? `Role ${id}` })),
  );
  const [allRoles, setAllRoles] = useState<{ id: number; name: string }[]>([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    rbacService
      .listRoles()
      .then(({ data }) => setAllRoles(data.data.map((r) => ({ id: r.id, name: r.name }))))
      .catch(() => {
        /* role picker degrades to current roles only */
      });
  }, []);

  const fullName = `${firstName} ${lastName}`.trim();
  const isValid = !!firstName.trim() && !!lastName.trim();
  const roleOptions = allRoles.map((r) => ({ id: r.id, label: r.name }));
  const isDeactivating = status !== 'ACTIVE' && status !== user.status;

  function addRole(roleId: number) {
    const role = allRoles.find((r) => r.id === roleId);
    if (!role) return;
    setRoles((prev) => [...prev, { id: role.id, name: role.name }]);
  }

  function removeRole(roleId: number) {
    setRoles((prev) => prev.filter((r) => r.id !== roleId));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setError('');
    setSubmitting(true);
    try {
      const payload: UpdateUserRequest = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
        status,
        roleIds: roles.map((r) => r.id),
      };
      const { data } = await userService.update(user.id, payload);
      onUpdated(data.data);
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

  return (
    <Overlay onClick={onClose}>
      <Panel onClick={(e) => e.stopPropagation()}>
        <CloseButton type="button" onClick={onClose} aria-label="Close">
          <CloseOutlined />
        </CloseButton>
        <Title>About {fullName || user.username}</Title>

        <AvatarWrap>
          <Avatar>{fullName.charAt(0).toUpperCase() || user.username.charAt(0).toUpperCase()}</Avatar>
        </AvatarWrap>

        <Form onSubmit={handleSubmit}>
          <Row>
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
          </Row>

          <Input id="email" type="email" label="Email" value={user.email} disabled />

          <Input
            id="phoneNumber"
            type="tel"
            label="Phone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <Field>
            <Label htmlFor="status">Status</Label>
            <StatusSelect id="status" value={status} onChange={(e) => setStatus(e.target.value as UserStatus)}>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </StatusSelect>
            {isDeactivating && <StatusWarning>*User will lose system access</StatusWarning>}
          </Field>

          <Field>
            <Label htmlFor="roles">Roles</Label>
            <TagPicker
              id="roles"
              selected={roles.map((r) => ({ id: r.id, label: r.name }))}
              options={roleOptions}
              placeholder="Search roles…"
              onAdd={addRole}
              onRemove={removeRole}
            />
          </Field>

          {error && <ErrorText>{error}</ErrorText>}

          <Actions>
            <Button type="submit" disabled={!isValid} loading={submitting}>
              Save
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </Actions>
        </Form>
      </Panel>
    </Overlay>
  );
}
