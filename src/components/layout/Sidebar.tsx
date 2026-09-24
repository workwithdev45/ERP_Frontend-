import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { NAV_SECTIONS, SECONDARY_NAV, findNavItem, type NavItem } from '@/config/navigation.config';
import { useAuth } from '@/context/AuthContext';
import { ROUTE_PATHS } from '@/routes/routePaths';

const COLLAPSED_KEY = 'erp.sidebar.collapsed';

function readCollapsed() {
  try {
    return window.localStorage.getItem(COLLAPSED_KEY) === '1';
  } catch {
    return false;
  }
}

function writeCollapsed(value: boolean) {
  try {
    window.localStorage.setItem(COLLAPSED_KEY, value ? '1' : '0');
  } catch {
    // Storage unavailable (private mode) — the preference just won't persist.
  }
}

const Rail = styled.aside<{ $collapsed: boolean }>`
  width: ${({ theme, $collapsed }) => ($collapsed ? theme.layout.sidebarCollapsedWidth : theme.layout.sidebarWidth)};
  flex-shrink: 0;
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.sidebarBg};
  color: ${({ theme }) => theme.colors.sidebarText};
  transition: width ${({ theme }) => theme.transition.base};
  z-index: 20;
`;

const Brand = styled.div<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  height: ${({ theme }) => theme.layout.headerHeight};
  flex-shrink: 0;
  padding: 0 ${({ theme, $collapsed }) => ($collapsed ? '18px' : theme.space[5])};
  border-bottom: 1px solid ${({ theme }) => theme.colors.sidebarBorder};
  overflow: hidden;
`;

const BrandMark = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.palette.cobalt500} 100%);
  color: ${({ theme }) => theme.colors.textOnPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: -0.02em;
  flex-shrink: 0;
`;

const BrandText = styled.div`
  min-width: 0;
  line-height: 1.25;
`;

const BrandName = styled.div`
  font-weight: 600;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textOnDark};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BrandSub = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.sidebarTextMuted};
  white-space: nowrap;
`;

const Scroll = styled.nav`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: ${({ theme }) => theme.space[3]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.sidebarActive};
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SectionLabel = styled.div<{ $collapsed: boolean }>`
  padding: 0 ${({ theme }) => theme.space[3]};
  margin-bottom: ${({ theme }) => theme.space[1]};
  height: 18px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.sidebarTextMuted};
  white-space: nowrap;

  ${({ $collapsed, theme }) =>
    $collapsed &&
    css`
      font-size: 0;
      height: 1px;
      margin: ${theme.space[1]} ${theme.space[3]};
      padding: 0;
      background: ${theme.colors.sidebarBorder};
    `}
`;

const itemStyles = css<{ $active?: boolean; $collapsed: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  height: 40px;
  padding: 0 ${({ theme }) => theme.space[3]};
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.sidebarText};
  text-decoration: none;
  white-space: nowrap;
  background: none;
  border: none;
  width: 100%;
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.transition.fast},
    color ${({ theme }) => theme.transition.fast};

  .anticon {
    font-size: 17px;
    flex-shrink: 0;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.sidebarHover};
    color: ${({ theme }) => theme.colors.textOnDark};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.sidebarIndicator};
    outline-offset: -2px;
  }

  ${({ $active, theme }) =>
    $active &&
    css`
      background: ${theme.colors.sidebarActive};
      color: ${theme.colors.textOnDark};
      font-weight: 600;

      &::before {
        content: '';
        position: absolute;
        left: -12px;
        top: 8px;
        bottom: 8px;
        width: 3px;
        border-radius: 0 3px 3px 0;
        background: ${theme.colors.sidebarIndicator};
      }

      .anticon {
        color: ${theme.colors.sidebarIndicator};
      }
    `}
`;

const ItemLink = styled(Link)<{ $active?: boolean; $collapsed: boolean }>`
  ${itemStyles}
`;

const ItemButton = styled.button<{ $collapsed: boolean }>`
  ${itemStyles}
`;

const Label = styled.span<{ $collapsed: boolean }>`
  display: ${({ $collapsed }) => ($collapsed ? 'none' : 'inline')};
`;

const Footer = styled.div`
  padding: ${({ theme }) => theme.space[3]};
  border-top: 1px solid ${({ theme }) => theme.colors.sidebarBorder};
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

interface SidebarProps {
  companyName?: string;
}

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'ERP'
  );
}

export function Sidebar({ companyName = 'Your Company' }: SidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const activeKey = findNavItem(pathname)?.key;

  function toggleCollapsed() {
    setCollapsed((prev) => {
      writeCollapsed(!prev);
      return !prev;
    });
  }

  function handleLogout() {
    logout();
    navigate(ROUTE_PATHS.auth.login, { replace: true });
  }

  function renderItem(item: NavItem) {
    const Icon = item.icon;
    const active = item.key === activeKey;
    return (
      <ItemLink
        key={item.key}
        to={item.path}
        $active={active}
        $collapsed={collapsed}
        aria-current={active ? 'page' : undefined}
        title={collapsed ? item.label : undefined}
      >
        <Icon />
        <Label $collapsed={collapsed}>{item.label}</Label>
      </ItemLink>
    );
  }

  return (
    <Rail $collapsed={collapsed} aria-label="Main navigation">
      <Brand $collapsed={collapsed}>
        <BrandMark aria-hidden="true">{initials(companyName)}</BrandMark>
        {!collapsed && (
          <BrandText>
            <BrandName>{companyName}</BrandName>
            <BrandSub>MSME ERP · Workspace</BrandSub>
          </BrandText>
        )}
      </Brand>

      <Scroll>
        {NAV_SECTIONS.map((section) => (
          <Section key={section.key}>
            <SectionLabel $collapsed={collapsed}>{section.label}</SectionLabel>
            {section.items.map(renderItem)}
          </Section>
        ))}
      </Scroll>

      <Footer>
        {SECONDARY_NAV.map(renderItem)}
        <ItemButton type="button" $collapsed={collapsed} onClick={handleLogout} title={collapsed ? 'Log out' : undefined}>
          <LogoutOutlined />
          <Label $collapsed={collapsed}>Log out</Label>
        </ItemButton>
        <ItemButton
          type="button"
          $collapsed={collapsed}
          onClick={toggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          <Label $collapsed={collapsed}>Collapse</Label>
        </ItemButton>
      </Footer>
    </Rail>
  );
}
