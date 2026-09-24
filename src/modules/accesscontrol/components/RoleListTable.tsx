import styled from 'styled-components';
import { EditOutlined, SafetyOutlined } from '@ant-design/icons';
import { BadgeText } from '@/components/common/Badge/Badge';
import { IconButton, IconLink } from '@/components/common/IconButton/IconButton';
import { Table, TableScroll, Td, Th } from '@/components/common/Table/Table';
import { ROUTE_PATHS } from '@/routes/routePaths';
import type { RoleDto } from '../types/rbac.types';
import { roleLabel } from '../utils/roleLabel';

const RoleName = styled.div`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textStrong};
`;

const RoleDescription = styled.div`
  margin-top: 2px;
  max-width: 420px;
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const NameCell = styled(Td)`
  padding-top: ${({ theme }) => theme.space[3]};
  padding-bottom: ${({ theme }) => theme.space[3]};
`;

const Row = styled.tr`
  cursor: pointer;
`;

const RowActions = styled.div`
  display: inline-flex;
  gap: ${({ theme }) => theme.space[2]};
`;

function formatDate(value?: string) {
  if (!value) return '—';
  const parsed = new Date(value.replace(' ', 'T'));
  if (Number.isNaN(parsed.getTime())) return '—';
  return parsed.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface RoleListTableProps {
  roles: RoleDto[];
  onEditRole: (role: RoleDto) => void;
}

export function RoleListTable({ roles, onEditRole }: RoleListTableProps) {
  return (
    <TableScroll>
      <Table>
        <thead>
          <tr>
            <Th>Role</Th>
            <Th>Type</Th>
            <Th $align="right">Members</Th>
            <Th>Last updated</Th>
            <Th $align="right">
              <span className="sr-only">Actions</span>
            </Th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <Row key={role.id} onClick={() => onEditRole(role)}>
              <NameCell>
                <RoleName>{roleLabel(role.name)}</RoleName>
                {role.description && <RoleDescription>{role.description}</RoleDescription>}
              </NameCell>
              <Td>
                <BadgeText tone={role.systemRole ? 'neutral' : 'primary'}>{role.systemRole ? 'System' : 'Custom'}</BadgeText>
              </Td>
              <Td $numeric>{role.userCount ?? 0}</Td>
              <Td $muted>{formatDate(role.updatedAt)}</Td>
              <Td $align="right" onClick={(e) => e.stopPropagation()}>
                <RowActions>
                  <IconLink
                    to={`${ROUTE_PATHS.settings.permissions}?role=${role.id}`}
                    aria-label={`Permissions for ${roleLabel(role.name)}`}
                    title="Permissions"
                  >
                    <SafetyOutlined />
                  </IconLink>
                  <IconButton aria-label={`Edit ${roleLabel(role.name)}`} title="Edit" onClick={() => onEditRole(role)}>
                    <EditOutlined />
                  </IconButton>
                </RowActions>
              </Td>
            </Row>
          ))}
        </tbody>
      </Table>
    </TableScroll>
  );
}
