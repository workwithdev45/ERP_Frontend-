import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { CheckCircleOutlined, RightOutlined } from '@ant-design/icons';
import { apiErrorMessage } from '@/api/apiError';
import { BadgeText } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { Card, CardHeader, CardSubtitle, CardTitle } from '@/components/common/Card/Card';
import { FormError } from '@/components/common/FormError/FormError';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { Table, TableScroll, Td, Th } from '@/components/common/Table/Table';
import { rbacService } from '../services/rbacService';
import type { ModuleCode, ModulePermission, PermissionAction, RoleDto } from '../types/rbac.types';
import { roleLabel } from '../utils/roleLabel';

const DEFAULT_ACTIONS: PermissionAction[] = ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'APPROVE'];

const MODULE_LABELS: Partial<Record<ModuleCode, string>> = {
  HR: 'HR & Payroll',
  CRM: 'CRM',
};

function moduleLabel(code: ModuleCode) {
  return MODULE_LABELS[code] ?? code.charAt(0) + code.slice(1).toLowerCase();
}

function actionLabel(action: PermissionAction) {
  return action.charAt(0) + action.slice(1).toLowerCase();
}

function formatDate(value?: string) {
  if (!value) return null;
  const parsed = new Date(value.replace(' ', 'T'));
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Stable string form of a permission set, for dirty checking. */
function serialize(list: ModulePermission[]) {
  return JSON.stringify(
    list
      .filter((p) => p.actions.length > 0)
      .map((p) => [p.moduleCode, [...p.actions].sort()] as const)
      .sort(([a], [b]) => a.localeCompare(b)),
  );
}

const Layout = styled.div`
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: ${({ theme }) => theme.space[5]};
  align-items: start;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const RoleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: ${({ theme }) => theme.space[2]};
`;

const RoleItem = styled.button<{ $active: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[2]};
  width: 100%;
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: background ${({ theme }) => theme.transition.fast};

  .anticon {
    font-size: 11px;
    color: ${({ theme }) => theme.colors.textDisabled};
  }

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focus};
  }

  ${({ $active, theme }) =>
    $active &&
    css`
      background: ${theme.colors.primaryLight};

      &:hover {
        background: ${theme.colors.primaryLight};
      }

      .anticon {
        color: ${theme.colors.primary};
      }
    `}
`;

const RoleItemName = styled.div<{ $active: boolean }>`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme, $active }) => ($active ? theme.colors.primaryDarker : theme.colors.textStrong)};
`;

const RoleItemMeta = styled.div`
  margin-top: 2px;
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const HeaderText = styled.div`
  flex: 1;
  min-width: 0;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
`;

const Updated = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
`;

const Notice = styled.div`
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[5]} 0;
`;

const Saved = styled.p`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.successLight};
  color: ${({ theme }) => theme.colors.successDark};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const MatrixWrap = styled(TableScroll)`
  margin-top: ${({ theme }) => theme.space[3]};
`;

const ModuleName = styled.span`
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textStrong};
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  margin: 0;
  vertical-align: middle;
  accent-color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focus};
    border-radius: ${({ theme }) => theme.radius.xs};
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[5]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const FooterHint = styled.span`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Message = styled.div`
  padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[5]};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export function PermissionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [modules, setModules] = useState<ModuleCode[]>([]);
  const [actions, setActions] = useState<PermissionAction[]>(DEFAULT_ACTIONS);
  const [savedPermissions, setSavedPermissions] = useState<ModulePermission[]>([]);
  const [draftPermissions, setDraftPermissions] = useState<ModulePermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRole, setLoadingRole] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const requestedRoleId = Number(searchParams.get('role')) || null;
  const selectedRole = roles.find((r) => r.id === requestedRoleId) ?? roles[0] ?? null;
  const selectedRoleId = selectedRole?.id ?? null;

  useEffect(() => {
    Promise.all([rbacService.listRoles(), rbacService.listModules(), rbacService.listActions()])
      .then(([rolesRes, modulesRes, actionsRes]) => {
        setRoles(rolesRes.data.data);
        setModules(modulesRes.data.data);
        if (actionsRes.data.data.length > 0) setActions(actionsRes.data.data);
      })
      .catch((err) => setError(apiErrorMessage(err, 'Could not load roles and modules. Please refresh the page.')))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setError('');
    setSaved(false);
    if (selectedRoleId == null) {
      setSavedPermissions([]);
      setDraftPermissions([]);
      return;
    }
    let cancelled = false;
    setLoadingRole(true);
    rbacService
      .getRolePermissions(selectedRoleId)
      .then(({ data }) => {
        if (cancelled) return;
        setSavedPermissions(data.data);
        setDraftPermissions(data.data);
      })
      .catch((err) => !cancelled && setError(apiErrorMessage(err, 'Could not load this role’s permissions.')))
      .finally(() => !cancelled && setLoadingRole(false));
    return () => {
      cancelled = true;
    };
  }, [selectedRoleId]);

  const actionsByModule = useMemo(() => {
    const map = new Map<ModuleCode, Set<PermissionAction>>();
    for (const permission of draftPermissions) map.set(permission.moduleCode, new Set(permission.actions));
    return map;
  }, [draftPermissions]);

  const isDirty = serialize(draftPermissions) !== serialize(savedPermissions);
  const grantedCount = draftPermissions.reduce((sum, p) => sum + p.actions.length, 0);

  function selectRole(role: RoleDto) {
    if (role.id === selectedRoleId) return;
    if (isDirty && !window.confirm('Discard your unsaved permission changes?')) return;
    setSearchParams({ role: String(role.id) }, { replace: true });
  }

  function setModuleActions(moduleCode: ModuleCode, next: Set<PermissionAction>) {
    setSaved(false);
    setDraftPermissions((prev) => [
      ...prev.filter((p) => p.moduleCode !== moduleCode),
      { moduleCode, actions: actions.filter((a) => next.has(a)) },
    ]);
  }

  function toggleAction(moduleCode: ModuleCode, action: PermissionAction, checked: boolean) {
    const next = new Set(actionsByModule.get(moduleCode) ?? []);
    if (checked) next.add(action);
    else next.delete(action);
    setModuleActions(moduleCode, next);
  }

  function toggleModule(moduleCode: ModuleCode, checked: boolean) {
    setModuleActions(moduleCode, new Set(checked ? actions : []));
  }

  function handleCancel() {
    setDraftPermissions(savedPermissions);
    setError('');
    setSaved(false);
  }

  async function handleSave() {
    if (selectedRoleId == null || !isDirty) return;
    setError('');
    setSaving(true);
    try {
      const changed = modules.filter((moduleCode) => {
        const before = [...(savedPermissions.find((p) => p.moduleCode === moduleCode)?.actions ?? [])].sort().join();
        const after = [...(actionsByModule.get(moduleCode) ?? [])].sort().join();
        return before !== after;
      });

      await Promise.all(
        changed.map((moduleCode) => {
          const next = [...(actionsByModule.get(moduleCode) ?? [])];
          return next.length > 0
            ? rbacService.assignRoleModulePermission(selectedRoleId, moduleCode, next)
            : rbacService.revokeRoleModulePermission(selectedRoleId, moduleCode);
        }),
      );

      setSavedPermissions(draftPermissions);
      setSaved(true);
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not save the permission changes. Please try again.'));
    } finally {
      setSaving(false);
    }
  }

  const isAdminRole = selectedRole?.systemRole && selectedRole.name === 'ADMIN';
  const updated = formatDate(selectedRole?.updatedAt);

  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Permissions"
        subtitle="Choose what each role can do in every module. Members get the permissions of all their roles."
      />

      {loading ? (
        <Card>
          <Message>Loading permissions…</Message>
        </Card>
      ) : roles.length === 0 ? (
        <Card>
          {error ? (
            <Notice>
              <FormError>{error}</FormError>
            </Notice>
          ) : (
            <Message>No roles yet. Create one from the Roles page to get started.</Message>
          )}
        </Card>
      ) : (
        <Layout>
          <Card>
            <CardHeader>
              <HeaderText>
                <CardTitle>Roles</CardTitle>
                <CardSubtitle>{roles.length} in this workspace</CardSubtitle>
              </HeaderText>
            </CardHeader>
            <RoleList>
              {roles.map((role) => {
                const active = role.id === selectedRoleId;
                return (
                  <RoleItem key={role.id} type="button" $active={active} aria-pressed={active} onClick={() => selectRole(role)}>
                    <div>
                      <RoleItemName $active={active}>{roleLabel(role.name)}</RoleItemName>
                      <RoleItemMeta>
                        {role.systemRole ? 'System' : 'Custom'} · {role.userCount ?? 0} member
                        {role.userCount === 1 ? '' : 's'}
                      </RoleItemMeta>
                    </div>
                    <RightOutlined />
                  </RoleItem>
                );
              })}
            </RoleList>
          </Card>

          {selectedRole && (
            <Card>
              <CardHeader>
                <HeaderText>
                  <TitleRow>
                    <CardTitle as="h2" style={{ flex: 'none' }}>
                      {roleLabel(selectedRole.name)}
                    </CardTitle>
                    {isAdminRole && <BadgeText tone="success">Full access</BadgeText>}
                  </TitleRow>
                  <CardSubtitle>{selectedRole.description || 'No description'}</CardSubtitle>
                </HeaderText>
                {updated && <Updated>Updated {updated}</Updated>}
              </CardHeader>

              {(error || saved || isAdminRole) && (
                <Notice>
                  {error ? (
                    <FormError>{error}</FormError>
                  ) : saved ? (
                    <Saved role="status">
                      <CheckCircleOutlined /> Permissions updated. Members get them the next time they sign in.
                    </Saved>
                  ) : (
                    <CardSubtitle>
                      Admins can always reach every module, whatever is ticked here.
                    </CardSubtitle>
                  )}
                </Notice>
              )}

              <MatrixWrap>
                <Table>
                  <thead>
                    <tr>
                      <Th>Module</Th>
                      <Th $align="center">All</Th>
                      {actions.map((action) => (
                        <Th key={action} $align="center">
                          {actionLabel(action)}
                        </Th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {modules.map((moduleCode) => {
                      const granted = actionsByModule.get(moduleCode) ?? new Set<PermissionAction>();
                      const all = actions.every((a) => granted.has(a));
                      const label = moduleLabel(moduleCode);
                      return (
                        <tr key={moduleCode}>
                          <Td>
                            <ModuleName>{label}</ModuleName>
                          </Td>
                          <Td $align="center">
                            <Checkbox
                              aria-label={`All ${label} permissions`}
                              checked={all}
                              ref={(el) => {
                                if (el) el.indeterminate = !all && granted.size > 0;
                              }}
                              disabled={loadingRole}
                              onChange={(e) => toggleModule(moduleCode, e.target.checked)}
                            />
                          </Td>
                          {actions.map((action) => (
                            <Td key={action} $align="center">
                              <Checkbox
                                aria-label={`${actionLabel(action)} ${label}`}
                                checked={granted.has(action)}
                                disabled={loadingRole}
                                onChange={(e) => toggleAction(moduleCode, action, e.target.checked)}
                              />
                            </Td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </MatrixWrap>

              <Footer>
                <FooterHint>
                  {grantedCount} permission{grantedCount === 1 ? '' : 's'} granted
                  {isDirty && ' · unsaved changes'}
                </FooterHint>
                <Button type="button" variant="secondary" onClick={handleCancel} disabled={!isDirty || saving}>
                  Discard
                </Button>
                <Button type="button" onClick={handleSave} disabled={!isDirty} loading={saving}>
                  Save permissions
                </Button>
              </Footer>
            </Card>
          )}
        </Layout>
      )}
    </div>
  );
}
