import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Card } from '@/components/common/Card/Card';
import { rbacService } from '../services/rbacService';
import type { PermissionDto } from '../types/rbac.types';

const PageTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.navy};
  margin-bottom: ${({ theme }) => theme.space[1]};
`;

const PageSubtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.space[5]};
`;

const ModuleCard = styled(Card)`
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[5]};
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const ModuleTitle = styled.div`
  font-weight: 700;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.navy};
  margin-bottom: ${({ theme }) => theme.space[3]};
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.space[2]} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 13px;

  &:last-child {
    border-bottom: none;
  }
`;

const PermissionName = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const Description = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
`;

export function PermissionsPage() {
  const [permissions, setPermissions] = useState<PermissionDto[]>([]);

  useEffect(() => {
    rbacService.listPermissions().then(({ data }) => setPermissions(data.data));
  }, []);

  const byModule = useMemo(() => {
    const grouped = new Map<string, PermissionDto[]>();
    for (const permission of permissions) {
      const list = grouped.get(permission.module) ?? [];
      list.push(permission);
      grouped.set(permission.module, list);
    }
    return grouped;
  }, [permissions]);

  return (
    <div>
      <PageTitle>Permission catalog</PageTitle>
      <PageSubtitle>
        Every permission available on this platform, grouped by module. Assign these to a user from their profile
        page, or bundle them into a custom role.
      </PageSubtitle>

      {[...byModule.entries()].map(([module, modulePermissions]) => (
        <ModuleCard key={module}>
          <ModuleTitle>{module}</ModuleTitle>
          {modulePermissions.map((permission) => (
            <Row key={permission.id}>
              <PermissionName>{permission.name}</PermissionName>
              <Description>{permission.description}</Description>
            </Row>
          ))}
        </ModuleCard>
      ))}
    </div>
  );
}
