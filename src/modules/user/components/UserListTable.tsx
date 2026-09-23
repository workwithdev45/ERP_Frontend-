import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button/Button';
import { UserStatusBadge } from './UserStatusBadge';
import type { UserSummary } from '../types/user.types';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

const Th = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.space[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  vertical-align: middle;
`;

const NameLink = styled(Link)`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.navy};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Muted = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[2]};
`;

interface UserListTableProps {
  users: UserSummary[];
  onDeactivate: (user: UserSummary) => void;
  onReactivate: (user: UserSummary) => void;
}

export function UserListTable({ users, onDeactivate, onReactivate }: UserListTableProps) {
  return (
    <Table>
      <thead>
        <tr>
          <Th>Name</Th>
          <Th>Role</Th>
          <Th>Status</Th>
          <Th>Actions</Th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <Td>
              <NameLink to={`/settings/users/${user.id}`}>
                {user.firstName} {user.lastName}
              </NameLink>
              <Muted>{user.email}</Muted>
            </Td>
            <Td>{user.roles.join(', ')}</Td>
            <Td>
              <UserStatusBadge status={user.status} />
            </Td>
            <Td>
              <Actions>
                {user.status === 'ACTIVE' || user.status === 'PENDING_VERIFICATION' ? (
                  <Button variant="ghost" onClick={() => onDeactivate(user)}>
                    Deactivate
                  </Button>
                ) : (
                  <Button variant="ghost" onClick={() => onReactivate(user)}>
                    Reactivate
                  </Button>
                )}
              </Actions>
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
