import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { SafetyOutlined, WarningOutlined } from '@ant-design/icons';
import { apiErrorMessage } from '@/api/apiError';
import { Button } from '@/components/common/Button/Button';
import { FormError } from '@/components/common/FormError/FormError';
import { Input } from '@/components/common/Input/Input';
import { Modal } from '@/components/common/Modal/Modal';
import { Select } from '@/components/common/Select/Select';
import { TagPicker } from '@/components/common/TagPicker/TagPicker';
import { rbacService } from '@/modules/accesscontrol/services/rbacService';
import { roleLabel } from '@/modules/accesscontrol/utils/roleLabel';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { MemberAvatar, memberName } from './MemberAvatar';
import { LABEL_BY_STATUS, UserStatusBadge } from './UserStatusBadge';
import { userService } from '../services/userService';
import type { UpdateUserRequest, UserStatus, UserSummary } from '../types/user.types';

const Identity = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  margin-top: -${({ theme }) => theme.space[2]};
  margin-bottom: ${({ theme }) => theme.space[5]};
  padding-bottom: ${({ theme }) => theme.space[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const IdentityText = styled.div`
  flex: 1;
  min-width: 0;
`;

const IdentityName = styled.div`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textStrong};
`;

const IdentityEmail = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

const Warning = styled.p`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.warningLight};
  color: ${({ theme }) => theme.colors.warningDark};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const PermissionsLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
    text-decoration: underline;
  }
`;

const FORM_ID = 'edit-member-form';

const STATUS_OPTIONS = (Object.keys(LABEL_BY_STATUS) as UserStatus[]).map((status) => ({
  value: status,
  label: LABEL_BY_STATUS[status],
}));

interface RoleOption {
  id: number;
  label: string;
}

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
  const [roles, setRoles] = useState<RoleOption[]>(
    (user.roleIds ?? []).map((id, idx) => ({ id, label: user.roles[idx] ? roleLabel(user.roles[idx]) : `Role ${id}` })),
  );
  const [allRoles, setAllRoles] = useState<RoleOption[]>([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    rbacService
      .listRoles()
      .then(({ data }) => {
        const options = data.data.map((r) => ({ id: r.id, label: roleLabel(r.name) }));
        setAllRoles(options);
        // Role ids and names come back as unordered sets, so re-label chips from the catalog.
        setRoles((prev) => prev.map((r) => options.find((o) => o.id === r.id) ?? r));
      })
      .catch(() => {
        /* The picker degrades to the member's current roles. */
      });
  }, []);

  const isValid = !!firstName.trim() && !!lastName.trim() && roles.length > 0;
  const losingAccess = status !== 'ACTIVE' && user.status === 'ACTIVE';

  function addRole(roleId: number) {
    const role = allRoles.find((r) => r.id === roleId);
    if (role) setRoles((prev) => [...prev, role]);
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
      setError(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open
      title="Edit member"
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={!isValid} loading={submitting}>
            Save changes
          </Button>
        </>
      }
    >
      <Identity>
        <MemberAvatar user={user} size={44} />
        <IdentityText>
          <IdentityName>{memberName(user)}</IdentityName>
          <IdentityEmail>{user.email}</IdentityEmail>
        </IdentityText>
        <UserStatusBadge status={user.status} />
      </Identity>

      <Form id={FORM_ID} onSubmit={handleSubmit}>
        <Row>
          <Input id="firstName" label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          <Input id="lastName" label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </Row>

        <Row>
          <Input
            id="phoneNumber"
            type="tel"
            label="Phone"
            placeholder="90000 00000"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <Select
            id="status"
            label="Status"
            value={status}
            options={STATUS_OPTIONS}
            onChange={(e) => setStatus(e.target.value as UserStatus)}
          />
        </Row>

        {losingAccess && (
          <Warning>
            <WarningOutlined /> {firstName || 'This member'} will lose access to the workspace.
          </Warning>
        )}

        <TagPicker
          id="roles"
          label="Roles"
          selected={roles}
          options={allRoles}
          placeholder="Search roles…"
          onAdd={addRole}
          onRemove={removeRole}
        />

        <PermissionsLink to={ROUTE_PATHS.settings.userDetail(user.id)}>
          <SafetyOutlined /> Extra module permissions for this member
        </PermissionsLink>

        {error && <FormError>{error}</FormError>}
      </Form>
    </Modal>
  );
}
