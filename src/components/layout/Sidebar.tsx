import { useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { RightOutlined, PoweroffOutlined } from '@ant-design/icons';
import { PRIMARY_NAV, SECONDARY_NAV, type NavItem } from '@/config/navigation.config';
import { useAuth } from '@/context/AuthContext';
import { usePermission } from '@/hooks/usePermission';
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
  height: 72px;
  flex-shrink: 0;
  padding: 0 ${({ theme }) => theme.space[5]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-sizing: border-box;
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

const IconWrap = styled.span`
  width: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
`;

const NavGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const NavGroupToggle = styled.button<{ $open: boolean }>`
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

  .chevron {
    margin-left: auto;
    display: inline-flex;
    transform: rotate(${({ $open }) => ($open ? '90deg' : '0deg')});
    transition: transform 0.15s ease;
    font-size: 11px;
  }
`;

const NavChildren = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-left: ${({ theme }) => theme.space[5]};
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
  companyName?: string;
}

function filterVisible(items: NavItem[], canAccess: (permission: string) => boolean): NavItem[] {
  return items.reduce<NavItem[]>((visible, item) => {
    const children = item.children ? filterVisible(item.children, canAccess) : undefined;
    const itemVisible = !item.permission || canAccess(item.permission);

    if (item.children) {
      if (children && children.length > 0) visible.push({ ...item, children });
    } else if (itemVisible) {
      visible.push(item);
    }
    return visible;
  }, []);
}

export function Sidebar({ companyName = 'Your Company' }: SidebarProps) {
  const { logout } = useAuth();
  const { canAccess } = usePermission();
  const navigate = useNavigate();
  const location = useLocation();

  const visiblePrimaryNav = useMemo(() => filterVisible(PRIMARY_NAV, canAccess), [canAccess]);
  const visibleSecondaryNav = useMemo(() => filterVisible(SECONDARY_NAV, canAccess), [canAccess]);

  const [openGroup, setOpenGroup] = useState<string | null>(
    () => visiblePrimaryNav.find((item) => item.children?.some((child) => location.pathname.startsWith(child.path)))?.key ?? null,
  );

  function handleLogout() {
    logout();
    navigate(ROUTE_PATHS.auth.login, { replace: true });
  }

  return (
    <Rail>
      <Brand>
        <BrandMark>+</BrandMark>
        <BrandText>
          <BrandName>{companyName}</BrandName>
        </BrandText>
      </Brand>
      <NavList>
        {visiblePrimaryNav.map((item) =>
          item.children ? (
            <NavGroup key={item.key}>
              <NavGroupToggle
                type="button"
                $open={openGroup === item.key}
                onClick={() => setOpenGroup(openGroup === item.key ? null : item.key)}
              >
                <IconWrap>
                  <item.icon />
                </IconWrap>
                {item.label}
                <RightOutlined className="chevron" />
              </NavGroupToggle>
              {openGroup === item.key && (
                <NavChildren>
                  {item.children.map((child) => (
                    <NavItemLink key={child.key} to={child.path}>
                      <IconWrap>
                        <child.icon />
                      </IconWrap>
                      {child.label}
                    </NavItemLink>
                  ))}
                </NavChildren>
              )}
            </NavGroup>
          ) : (
            <NavItemLink key={item.key} to={item.path}>
              <IconWrap>
                <item.icon />
              </IconWrap>
              {item.label}
            </NavItemLink>
          ),
        )}
      </NavList>
      <FooterNav>
        {visibleSecondaryNav.map((item) => (
          <NavItemLink key={item.key} to={item.path}>
            <IconWrap>
              <item.icon />
            </IconWrap>
            {item.label}
          </NavItemLink>
        ))}
        <LogoutButton type="button" onClick={handleLogout}>
          <IconWrap>
            <PoweroffOutlined />
          </IconWrap>
          Logout
        </LogoutButton>
      </FooterNav>
    </Rail>
  );
}
