import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PRIMARY_NAV, SECONDARY_NAV } from '@/config/navigation.config';
import { useAuth } from '@/context/AuthContext';
import { ROUTE_PATHS } from '@/routes/routePaths';

const Rail = styled.aside`
  width: 240px;
  flex-shrink: 0;
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.bg};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[5]} ${({ theme }) => theme.space[5]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const BrandMark = styled.div`
  width: 34px;
  height: 34px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
`;

const BrandText = styled.div`
  line-height: 1.2;
`;

const BrandName = styled.div`
  font-weight: 700;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.navy};
`;

const BrandSub = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const NavList = styled.nav`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.space[3]};
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const NavItemLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  padding: 10px ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => theme.colors.bgSubtle};
  }

  &.active {
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
  }
`;

const Icon = styled.span`
  width: 18px;
  text-align: center;
  font-size: 15px;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  padding: 10px ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-family: inherit;

  &:hover {
    background: ${({ theme }) => theme.colors.bgSubtle};
  }
`;

const FooterNav = styled.div`
  padding: ${({ theme }) => theme.space[3]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

interface SidebarProps {
  hospitalName?: string;
  branchName?: string;
}

export function Sidebar({ hospitalName = 'LifeCare HMS', branchName = 'City Branch' }: SidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate(ROUTE_PATHS.auth.login, { replace: true });
  }

  return (
    <Rail>
      <Brand>
        <BrandMark>+</BrandMark>
        <BrandText>
          <BrandName>{hospitalName}</BrandName>
          <BrandSub>{branchName}</BrandSub>
        </BrandText>
      </Brand>
      <NavList>
        {PRIMARY_NAV.map((item) => (
          <NavItemLink key={item.key} to={item.path}>
            <Icon>{item.icon}</Icon>
            {item.label}
          </NavItemLink>
        ))}
      </NavList>
      <FooterNav>
        {SECONDARY_NAV.map((item) => (
          <NavItemLink key={item.key} to={item.path}>
            <Icon>{item.icon}</Icon>
            {item.label}
          </NavItemLink>
        ))}
        <LogoutButton type="button" onClick={handleLogout}>
          <Icon>⏻</Icon>
          Logout
        </LogoutButton>
      </FooterNav>
    </Rail>
  );
}
