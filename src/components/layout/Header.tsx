import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BankOutlined, DownOutlined, LockOutlined, LogoutOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons';
import { Button } from '@/components/common/Button/Button';
import { ActionMenu } from '@/components/common/ActionMenu/ActionMenu';
import { IconButton } from '@/components/common/IconButton/IconButton';
import { Modal } from '@/components/common/Modal/Modal';
import { ThemeToggle } from '@/components/common/ThemeToggle/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { ChangePasswordModal } from '@/modules/auth/components/ChangePasswordModal';
import { usePermission } from '@/hooks/usePermission';
import { ROUTE_PATHS } from '@/routes/routePaths';

const Bar = styled.header`
  height: ${({ theme }) => theme.layout.headerHeight};
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[5]};
  padding: 0 ${({ theme }) => theme.space[6]};
  background: ${({ theme }) => theme.colors.headerBg};
  backdrop-filter: saturate(180%) blur(8px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Actions = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[1]};
`;

/** G19: opens the sidebar drawer — hidden once the sidebar has room to sit statically. */
const MenuButton = styled(IconButton)`
  display: none;

  @media (max-width: 900px) {
    display: inline-flex;
  }
`;

const Divider = styled.span`
  width: 1px;
  height: 28px;
  margin: 0 ${({ theme }) => theme.space[2]};
  background: ${({ theme }) => theme.colors.border};
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  padding: 4px 10px 4px 4px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
  }

  > .anticon {
    font-size: 10px;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Avatar = styled.span`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primarySoft};
  color: ${({ theme }) => theme.colors.primaryDarker};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 13px;
  flex-shrink: 0;
`;

const UserText = styled.span`
  display: flex;
  flex-direction: column;
  line-height: 1.25;

  @media (max-width: 1100px) {
    display: none;
  }
`;

const UserName = styled.span`
  font-weight: 600;
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.textStrong};
`;

const UserRole = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

function initials(name: string) {
  return name
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function humanizeRole(role: string) {
  return role
    .replace(/^ROLE_/, '')
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const { canAccess } = usePermission();
  const displayName = session?.username ?? 'Admin';
  const displayRole = session?.roles[0] ? humanizeRole(session.roles[0]) : 'Administrator';

  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

  function handleLogout() {
    setConfirmLogoutOpen(false);
    logout();
    navigate(ROUTE_PATHS.auth.login, { replace: true });
  }

  return (
    <Bar>
      <MenuButton aria-label="Open navigation" onClick={onMenuClick}>
        <MenuOutlined />
      </MenuButton>
      <Actions>
        <ThemeToggle />
        <Divider />
        <ActionMenu
          trigger={(open) => (
            <UserButton type="button" aria-label={`Account menu for ${displayName}`} onClick={open}>
              <Avatar>{initials(displayName)}</Avatar>
              <UserText>
                <UserName>{displayName}</UserName>
                <UserRole>{displayRole}</UserRole>
              </UserText>
              <DownOutlined />
            </UserButton>
          )}
          items={[
            {
              key: 'profile',
              label: 'My profile',
              icon: <UserOutlined />,
              onSelect: () => navigate(ROUTE_PATHS.settings.profile),
            },
            {
              key: 'change-password',
              label: 'Change password',
              icon: <LockOutlined />,
              onSelect: () => setChangePasswordOpen(true),
            },
            ...(canAccess('SETTINGS_MANAGE')
              ? [
                  {
                    key: 'company-settings',
                    label: 'Company settings',
                    icon: <BankOutlined />,
                    onSelect: () => navigate(ROUTE_PATHS.settings.company),
                  },
                ]
              : []),
            {
              key: 'logout',
              label: 'Log out',
              icon: <LogoutOutlined />,
              danger: true,
              divider: true,
              onSelect: () => setConfirmLogoutOpen(true),
            },
          ]}
        />
      </Actions>

      <ChangePasswordModal open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} />

      <Modal
        open={confirmLogoutOpen}
        title="Log out?"
        onClose={() => setConfirmLogoutOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmLogoutOpen(false)} autoFocus>
              Cancel
            </Button>
            <Button variant="danger" leadingIcon={<LogoutOutlined />} onClick={handleLogout}>
              Log out
            </Button>
          </>
        }
      >
        <p>You'll be signed out and need to sign in again to continue.</p>
      </Modal>
    </Bar>
  );
}
