import styled from 'styled-components';
import { MoreOutlined } from '@ant-design/icons';
import { UserStatusBadge } from './UserStatusBadge';
import type { UserSummary } from '../types/user.types';

const TableWrap = styled.div`
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.space[4]};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  white-space: nowrap;
`;

const NameCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
`;

const NameText = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.navy};
`;

const RolesText = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.space[8]};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;

const MenuCell = styled.td`
  padding: ${({ theme }) => theme.space[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  text-align: right;
  position: relative;
  white-space: nowrap;
`;

const MenuButton = styled.button`
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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

interface UserListTableProps {
  users: UserSummary[];
  onViewUser: (user: UserSummary) => void;
}

export function UserListTable({ users, onViewUser }: UserListTableProps) {
  if (users.length === 0) {
    return <EmptyState>No members yet. Add one to get started.</EmptyState>;
  }

  return (
    <TableWrap>
      <StyledTable>
        <thead>
          <tr>
            <Th>Member</Th>
            <Th>Email</Th>
            <Th>Phone</Th>
            <Th>Status</Th>
            <Th>Active Since</Th>
            <Th />
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const fullName = `${user.firstName} ${user.lastName}`.trim();
            return (
              <tr key={user.id}>
                <Td>
                  <NameCell>
                    <Avatar>{fullName.charAt(0).toUpperCase() || user.username.charAt(0).toUpperCase()}</Avatar>
                    <div>
                      <NameText>{fullName || user.username}</NameText>
                      <RolesText>{user.roles.join(', ')}</RolesText>
                    </div>
                  </NameCell>
                </Td>
                <Td>{user.email}</Td>
                <Td>{user.phoneNumber ?? '—'}</Td>
                <Td>
                  <UserStatusBadge status={user.status} />
                </Td>
                <Td>{formatDate(user.createdAt)}</Td>
                <MenuCell>
                  <MenuButton type="button" onClick={() => onViewUser(user)} aria-label={`Actions for ${fullName || user.username}`}>
                    <MoreOutlined />
                  </MenuButton>
                </MenuCell>
              </tr>
            );
          })}
        </tbody>
      </StyledTable>
    </TableWrap>
  );
}
