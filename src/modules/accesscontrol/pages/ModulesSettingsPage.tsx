import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { apiErrorMessage } from '@/api/apiError';
import { Card, CardBody, CardHeader, CardSubtitle, CardTitle } from '@/components/common/Card/Card';
import { FormError } from '@/components/common/FormError/FormError';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { rbacService } from '../services/rbacService';
import { MODULE_LABELS, type ModuleCode, type TenantModuleDto } from '../types/rbac.types';

const ModuleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.space[4]} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const ModuleName = styled.span`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textStrong};
`;

const Track = styled.button<{ $checked: boolean }>`
  width: 40px;
  height: 22px;
  border-radius: 999px;
  border: none;
  padding: 2px;
  display: flex;
  justify-content: ${({ $checked }) => ($checked ? 'flex-end' : 'flex-start')};
  background: ${({ theme, $checked }) => ($checked ? theme.colors.primary : theme.colors.border)};
  cursor: pointer;
  transition: background ${({ theme }) => theme.transition.fast};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Thumb = styled.span`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: white;
`;

/** G14: an Admin switches modules on/off per company instead of every module always being visible. */
export function ModulesSettingsPage() {
  const [modules, setModules] = useState<TenantModuleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingCode, setSavingCode] = useState<ModuleCode | null>(null);

  useEffect(() => {
    rbacService
      .getEnabledModules()
      .then(({ data }) => setModules(data.data))
      .catch((err) => setError(apiErrorMessage(err, 'Could not load modules.')))
      .finally(() => setLoading(false));
  }, []);

  async function toggle(moduleCode: ModuleCode, enabled: boolean) {
    setError('');
    setSavingCode(moduleCode);
    const previous = modules;
    setModules((prev) => prev.map((m) => (m.moduleCode === moduleCode ? { ...m, enabled } : m)));
    try {
      await rbacService.setModuleEnabled(moduleCode, enabled);
    } catch (err) {
      setModules(previous);
      setError(apiErrorMessage(err, 'Could not update that module.'));
    } finally {
      setSavingCode(null);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Modules"
        subtitle="Switch modules on or off for this workspace — everyone's sidebar updates immediately."
      />

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Available modules</CardTitle>
            <CardSubtitle>Settings can't be turned off.</CardSubtitle>
          </div>
        </CardHeader>
        <CardBody>
          {loading ? (
            <p>Loading…</p>
          ) : error ? (
            <FormError>{error}</FormError>
          ) : (
            modules.map((module) => (
              <ModuleRow key={module.moduleCode}>
                <ModuleName>{MODULE_LABELS[module.moduleCode]}</ModuleName>
                <Track
                  type="button"
                  role="switch"
                  aria-checked={module.enabled}
                  aria-label={`${module.enabled ? 'Disable' : 'Enable'} ${MODULE_LABELS[module.moduleCode]}`}
                  $checked={module.enabled}
                  disabled={savingCode === module.moduleCode || module.moduleCode === 'SETTINGS'}
                  onClick={() => toggle(module.moduleCode, !module.enabled)}
                >
                  <Thumb />
                </Track>
              </ModuleRow>
            ))
          )}
        </CardBody>
      </Card>
    </div>
  );
}
