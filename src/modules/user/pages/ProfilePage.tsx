import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { LockOutlined } from '@ant-design/icons';
import { apiErrorMessage } from '@/api/apiError';
import { BadgeText } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/common/Card/Card';
import { FormError } from '@/components/common/FormError/FormError';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { ChangePasswordModal } from '@/modules/auth/components/ChangePasswordModal';
import { authService } from '@/modules/auth/services/authService';
import type { UserProfileResponse } from '@/modules/auth/types/auth.types';
import { roleLabel } from '@/modules/accesscontrol/utils/roleLabel';

const Grid = styled.dl`
  display: grid;
  grid-template-columns: 160px 1fr;
  row-gap: ${({ theme }) => theme.space[4]};
  column-gap: ${({ theme }) => theme.space[4]};

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.dt`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Value = styled.dd`
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.textStrong};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`;

const RoleRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[2]};
  flex-wrap: wrap;
`;

const Actions = styled.div`
  margin-top: ${({ theme }) => theme.space[5]};
`;

/** G12: "My profile" from the account menu. */
export function ProfilePage() {
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loadError, setLoadError] = useState('');
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  useEffect(() => {
    authService
      .me()
      .then(({ data }) => setProfile(data.data))
      .catch((err) => setLoadError(apiErrorMessage(err, 'Could not load your profile.')));
  }, []);

  return (
    <div>
      <PageHeader eyebrow="Account" title="My profile" subtitle="Your account details for this workspace." />

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardBody>
          {loadError && <FormError>{loadError}</FormError>}
          {profile && (
            <>
              <Grid>
                <Label>Name</Label>
                <Value>
                  {profile.firstName} {profile.lastName}
                </Value>
                <Label>Username</Label>
                <Value>{profile.username}</Value>
                <Label>Email</Label>
                <Value>{profile.email}</Value>
                <Label>Phone</Label>
                <Value>{profile.phoneNumber || '—'}</Value>
                <Label>Workspace</Label>
                <Value>{profile.tenantName}</Value>
                <Label>Roles</Label>
                <RoleRow>
                  {profile.roles.map((role) => (
                    <BadgeText key={role} tone="info">
                      {roleLabel(role)}
                    </BadgeText>
                  ))}
                </RoleRow>
              </Grid>
              <Actions>
                <Button leadingIcon={<LockOutlined />} variant="secondary" onClick={() => setChangePasswordOpen(true)}>
                  Change password
                </Button>
              </Actions>
            </>
          )}
        </CardBody>
      </Card>

      <ChangePasswordModal open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} />
    </div>
  );
}
