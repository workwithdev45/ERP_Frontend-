import styled from 'styled-components';
import { EyeOutlined, MoreOutlined, RedoOutlined, SendOutlined, StopOutlined } from '@ant-design/icons';
import { ActionMenu, type ActionMenuItem } from '@/components/common/ActionMenu/ActionMenu';
import { IconButton } from '@/components/common/IconButton/IconButton';
import { Table, TableScroll, Td, Th } from '@/components/common/Table/Table';
import { roleLabel } from '@/modules/accesscontrol/utils/roleLabel';
import { MemberAvatar, memberName } from './MemberAvatar';
import { UserStatusBadge } from './UserStatusBadge';
import type { UserSummary } from '../types/user.types';

const NameCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  min-width: 200px;
`;

const NameText = styled.div`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textStrong};
`;

const RolesText = styled.div`
  margin-top: 2px;
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Row = styled.tr`
  cursor: pointer;
`;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface UserListTableProps {
  users: UserSummary[];
  onViewUser: (user: UserSummary) => void;
  onDeactivate: (user: UserSummary) => void;
  onReactivate: (user: UserSummary) => void;
  onResendInvite: (user: UserSummary) => void;
}

/** G15: a three-dot row menu replaces the old edit-icon-only actions. */
export function UserListTable({ users, onViewUser, onDeactivate, onReactivate, onResendInvite }: UserListTableProps) {
  return (
    <TableScroll>
      <Table>
        <thead>
          <tr>
            <Th>Member</Th>
            <Th>Email</Th>
            <Th>Phone</Th>
            <Th>Status</Th>
            <Th>Member since</Th>
            <Th $align="right">
              <span className="sr-only">Actions</span>
            </Th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const name = memberName(user);
            const items: ActionMenuItem[] = [
              { key: 'view', label: 'View / Edit', icon: <EyeOutlined />, onSelect: () => onViewUser(user) },
            ];
            if (user.status === 'PENDING_VERIFICATION') {
              items.push({
                key: 'resend',
                label: 'Resend invite',
                icon: <SendOutlined />,
                onSelect: () => onResendInvite(user),
              });
            }
            if (user.status === 'ACTIVE') {
              items.push({
                key: 'deactivate',
                label: 'Deactivate',
                icon: <StopOutlined />,
                danger: true,
                divider: true,
                onSelect: () => onDeactivate(user),
              });
            } else if (user.status === 'INACTIVE' || user.status === 'SUSPENDED') {
              items.push({
                key: 'reactivate',
                label: 'Reactivate',
                icon: <RedoOutlined />,
                divider: true,
                onSelect: () => onReactivate(user),
              });
            }

            return (
              <Row key={user.id} onClick={() => onViewUser(user)}>
                <Td>
                  <NameCell>
                    <MemberAvatar user={user} />
                    <div>
                      <NameText>{name}</NameText>
                      <RolesText>{user.roles.length > 0 ? user.roles.map(roleLabel).join(', ') : 'No role'}</RolesText>
                    </div>
                  </NameCell>
                </Td>
                <Td>{user.email}</Td>
                <Td $muted>{user.phoneNumber || '—'}</Td>
                <Td>
                  <UserStatusBadge status={user.status} />
                </Td>
                <Td $muted>{formatDate(user.createdAt)}</Td>
                <Td $align="right" onClick={(e) => e.stopPropagation()}>
                  <ActionMenu
                    items={items}
                    trigger={(open) => (
                      <IconButton aria-label={`Actions for ${name}`} onClick={open}>
                        <MoreOutlined />
                      </IconButton>
                    )}
                  />
                </Td>
              </Row>
            );
          })}
        </tbody>
      </Table>
    </TableScroll>
  );
}
