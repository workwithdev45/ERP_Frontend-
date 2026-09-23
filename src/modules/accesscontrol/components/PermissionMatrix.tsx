import styled from 'styled-components';
import type { ModuleCode, ModulePermission, PermissionAction } from '../types/rbac.types';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
`;

const Th = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.04em;

  &:not(:first-child) {
    text-align: center;
  }
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:not(:first-child) {
    text-align: center;
  }
`;

const ModuleLabel = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.navy};
`;

interface PermissionMatrixProps {
  modules: ModuleCode[];
  actions: PermissionAction[];
  permissions: ModulePermission[];
  readOnly?: boolean;
  onToggle?: (moduleCode: ModuleCode, action: PermissionAction, checked: boolean) => void;
}

export function PermissionMatrix({ modules, actions, permissions, readOnly, onToggle }: PermissionMatrixProps) {
  function isChecked(moduleCode: ModuleCode, action: PermissionAction) {
    return permissions.find((p) => p.moduleCode === moduleCode)?.actions.includes(action) ?? false;
  }

  return (
    <Table>
      <thead>
        <tr>
          <Th>Module</Th>
          {actions.map((action) => (
            <Th key={action}>{action}</Th>
          ))}
        </tr>
      </thead>
      <tbody>
        {modules.map((moduleCode) => (
          <tr key={moduleCode}>
            <Td>
              <ModuleLabel>{moduleCode}</ModuleLabel>
            </Td>
            {actions.map((action) => (
              <Td key={action}>
                <input
                  type="checkbox"
                  checked={isChecked(moduleCode, action)}
                  disabled={readOnly}
                  onChange={(e) => onToggle?.(moduleCode, action, e.target.checked)}
                />
              </Td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
