import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { DeleteOutlined, RightOutlined } from '@ant-design/icons';
import { Card } from '@/components/common/Card/Card';
import { BadgeText } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { rbacService } from '../services/rbacService';
import type { ModuleCode, ModulePermission, PermissionAction, RoleDto } from '../types/rbac.types';

const ACTIONS: PermissionAction[] = ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'APPROVE'];

const Layout = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[5]};
  align-items: flex-start;
`;

const LeftPane = styled.div`
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

const RightPane = styled.div`
  flex: 1;
  min-width: 0;
`;

const StatCard = styled(Card)`
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[5]};
`;

const StatLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.navy};
`;

const RoleListCard = styled(Card)`
  padding: ${({ theme }) => theme.space[3]};
`;

const RoleListTitle = styled.div`
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
`;

const RoleRow = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => theme.space[3]};
  border: none;
  border-left: 3px solid transparent;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.bgSubtle};
  }

  ${({ $active, theme }) =>
    $active &&
    `
    background: ${theme.colors.primaryLight};
    border-left-color: ${theme.colors.primary};
  `}
`;

const RoleRowName = styled.div<{ $active: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.text)};
`;

const RoleRowSubtext = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`;

const DetailCard = styled(Card)`
  padding: ${({ theme }) => theme.space[5]};
`;

const DetailHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.space[5]};
`;

const RoleTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
`;

const RoleTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.navy};
`;

const RoleDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.space[2]};
`;

const HeaderMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
`;

const LastModified = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const DeleteButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.danger};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.dangerLight};
  }
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

  &:not(:first-child) {
    text-align: center;
  }
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.space[4]};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:not(:first-child) {
    text-align: center;
  }
`;

const ModuleName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.navy};
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
  margin-bottom: ${({ theme }) => theme.space[3]};
`;

const SavedText = styled.p`
  color: ${({ theme }) => theme.colors.success};
  font-size: 13px;
  margin-bottom: ${({ theme }) => theme.space[3]};
`;

const TableFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space[3]};
  margin-top: ${({ theme }) => theme.space[5]};
  padding-top: ${({ theme }) => theme.space[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.space[8]};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;

function formatDate(value?: string) {
  if (!value) return '—';
  const parsed = new Date(value.replace(' ', 'T'));
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function PermissionsPage() {
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [modules, setModules] = useState<ModuleCode[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [savedPermissions, setSavedPermissions] = useState<ModulePermission[]>([]);
  const [draftPermissions, setDraftPermissions] = useState<ModulePermission[]>([]);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    rbacService.listRoles().then(({ data }) => {
      setRoles(data.data);
      if (data.data.length > 0) {
        setSelectedRoleId(data.data[0].id);
      }
    });
    rbacService.listModules().then(({ data }) => setModules(data.data));
  }, []);

  useEffect(() => {
    setError('');
    setSaved(false);
    if (selectedRoleId == null) {
      setSavedPermissions([]);
      setDraftPermissions([]);
      return;
    }
    rbacService.getRolePermissions(selectedRoleId).then(({ data }) => {
      setSavedPermissions(data.data);
      setDraftPermissions(data.data);
    });
  }, [selectedRoleId]);

  const selectedRole = useMemo(() => roles.find((r) => r.id === selectedRoleId) ?? null, [roles, selectedRoleId]);

  const activeUsers = useMemo(() => roles.reduce((sum, role) => sum + (role.userCount ?? 0), 0), [roles]);

  const actionsByModule = useMemo(() => {
    const map = new Map<ModuleCode, Set<PermissionAction>>();
    for (const permission of draftPermissions) {
      map.set(permission.moduleCode, new Set(permission.actions));
    }
    return map;
  }, [draftPermissions]);

  const isDirty = useMemo(() => {
    const serialize = (list: ModulePermission[]) =>
      JSON.stringify(
        [...list]
          .map((p) => [p.moduleCode, [...p.actions].sort()] as const)
          .sort(([a], [b]) => a.localeCompare(b)),
      );
    return serialize(draftPermissions) !== serialize(savedPermissions);
  }, [draftPermissions, savedPermissions]);

  function toggleAction(moduleCode: ModuleCode, action: PermissionAction, checked: boolean) {
    setSaved(false);
    const currentActions = actionsByModule.get(moduleCode) ?? new Set<PermissionAction>();
    const nextActions = new Set(currentActions);
    if (checked) nextActions.add(action);
    else nextActions.delete(action);

    setDraftPermissions((prev) => {
      const withoutModule = prev.filter((p) => p.moduleCode !== moduleCode);
      return [...withoutModule, { moduleCode, actions: [...nextActions] }];
    });
  }

  function handleCancel() {
    setDraftPermissions(savedPermissions);
    setError('');
    setSaved(false);
  }

  async function handleUpdate() {
    if (selectedRoleId == null || !isDirty) return;
    setError('');
    setSaving(true);
    try {
      const changedModules = modules.filter((moduleCode) => {
        const before = new Set(savedPermissions.find((p) => p.moduleCode === moduleCode)?.actions ?? []);
        const after = actionsByModule.get(moduleCode) ?? new Set<PermissionAction>();
        if (before.size !== after.size) return true;
        for (const action of before) if (!after.has(action)) return true;
        return false;
      });

      await Promise.all(
        changedModules.map((moduleCode) =>
          rbacService.assignRoleModulePermission(selectedRoleId, moduleCode, [...(actionsByModule.get(moduleCode) ?? [])]),
        ),
      );

      setSavedPermissions(draftPermissions);
      setSaved(true);
    } catch {
      setError('Could not save the permission changes. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!selectedRole || selectedRole.systemRole) return;
    try {
      await rbacService.deleteRole(selectedRole.id);
      const remaining = roles.filter((r) => r.id !== selectedRole.id);
      setRoles(remaining);
      setSelectedRoleId(remaining.length > 0 ? remaining[0].id : null);
    } catch {
      setError('Could not delete this role. Please try again.');
    }
  }

  const isFullAccess = !!selectedRole?.systemRole && selectedRole.name === 'ADMIN';

  return (
    <Layout>
      <LeftPane>
        <StatCard>
          <StatLabel>Active Users</StatLabel>
          <StatValue>{activeUsers}</StatValue>
        </StatCard>

        <RoleListCard>
          <RoleListTitle>System Roles</RoleListTitle>
          {roles.map((role) => (
            <RoleRow key={role.id} type="button" $active={role.id === selectedRoleId} onClick={() => setSelectedRoleId(role.id)}>
              <div>
                <RoleRowName $active={role.id === selectedRoleId}>{role.name}</RoleRowName>
                <RoleRowSubtext>{role.userCount ?? 0} Users</RoleRowSubtext>
              </div>
              <RightOutlined style={{ fontSize: 12, opacity: 0.5 }} />
            </RoleRow>
          ))}
        </RoleListCard>
      </LeftPane>

      <RightPane>
        {!selectedRole ? (
          <DetailCard>
            <EmptyState>No roles yet. Create one from the Roles page to get started.</EmptyState>
          </DetailCard>
        ) : (
          <DetailCard>
            <DetailHeader>
              <div>
                <RoleTitleRow>
                  <RoleTitle>{selectedRole.name}</RoleTitle>
                  {isFullAccess && <BadgeText tone="success">Full Access</BadgeText>}
                </RoleTitleRow>
                <RoleDescription>{selectedRole.description}</RoleDescription>
              </div>
              <HeaderMeta>
                <LastModified>Last modified: {formatDate(selectedRole.updatedAt)}</LastModified>
                {!selectedRole.systemRole && (
                  <DeleteButton type="button" aria-label={`Delete ${selectedRole.name}`} onClick={handleDelete}>
                    <DeleteOutlined />
                  </DeleteButton>
                )}
              </HeaderMeta>
            </DetailHeader>

            {error && <ErrorText>{error}</ErrorText>}
            {saved && !error && <SavedText>Permissions updated successfully.</SavedText>}

            <StyledTable>
              <thead>
                <tr>
                  <Th>Module</Th>
                  {ACTIONS.map((action) => (
                    <Th key={action}>{action.charAt(0) + action.slice(1).toLowerCase()}</Th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {modules.map((moduleCode) => {
                  const moduleActions = actionsByModule.get(moduleCode) ?? new Set<PermissionAction>();
                  return (
                    <tr key={moduleCode}>
                      <Td>
                        <ModuleName>{moduleCode}</ModuleName>
                      </Td>
                      {ACTIONS.map((action) => (
                        <Td key={action}>
                          <input
                            type="checkbox"
                            checked={moduleActions.has(action)}
                            onChange={(e) => toggleAction(moduleCode, action, e.target.checked)}
                          />
                        </Td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </StyledTable>

            <TableFooter>
              <Button type="button" variant="secondary" onClick={handleCancel} disabled={!isDirty || saving}>
                Cancel
              </Button>
              <Button type="button" onClick={handleUpdate} disabled={!isDirty} loading={saving}>
                Update
              </Button>
            </TableFooter>
          </DetailCard>
        )}
      </RightPane>
    </Layout>
  );
}
