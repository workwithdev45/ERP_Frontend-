import styled from 'styled-components';
import { EditOutlined } from '@ant-design/icons';
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
}

export function UserListTable({ users, onViewUser }: UserListTableProps) {
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
                <Td $align="right">
                  <IconButton
                    aria-label={`Edit ${name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewUser(user);
                    }}
                  >
                    <EditOutlined />
                  </IconButton>
                </Td>
              </Row>
            );
          })}
        </tbody>
      </Table>
    </TableScroll>
  );
}
