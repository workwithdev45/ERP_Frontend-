import styled from 'styled-components';
import { BadgeText } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import type { RoleDto } from '../types/rbac.types';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

const Th = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.space[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.space[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  vertical-align: top;
`;

const RoleName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.navy};
`;

const Description = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`;

const PermissionCount = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

interface RoleListTableProps {
  roles: RoleDto[];
  onDelete: (role: RoleDto) => void;
}

export function RoleListTable({ roles, onDelete }: RoleListTableProps) {
  return (
    <Table>
      <thead>
        <tr>
          <Th>Role</Th>
          <Th>Permissions</Th>
          <Th>Type</Th>
          <Th></Th>
        </tr>
      </thead>
      <tbody>
        {roles.map((role) => (
          <tr key={role.id}>
            <Td>
              <RoleName>{role.name}</RoleName>
              {role.description && <Description>{role.description}</Description>}
            </Td>
            <Td>
              <PermissionCount>{role.permissionNames.length} granted</PermissionCount>
            </Td>
            <Td>
              <BadgeText tone={role.systemRole ? 'neutral' : 'success'}>
                {role.systemRole ? 'System' : 'Custom'}
              </BadgeText>
            </Td>
            <Td>
              {!role.systemRole && (
                <Button variant="ghost" onClick={() => onDelete(role)}>
                  Delete
                </Button>
              )}
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
