import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { SearchOutlined, BellOutlined, CheckSquareOutlined, DownOutlined } from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';

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
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: saturate(180%) blur(8px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const SearchWrap = styled.label`
  flex: 1;
  min-width: 180px;
  max-width: 440px;
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  height: 38px;
  padding: 0 ${({ theme }) => theme.space[3]};
  background: ${({ theme }) => theme.colors.bgSubtle};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: text;
  transition:
    border-color ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast},
    background ${({ theme }) => theme.transition.fast};

  &:focus-within {
    background: ${({ theme }) => theme.colors.bg};
    border-color: ${({ theme }) => theme.colors.borderFocus};
    box-shadow: ${({ theme }) => theme.shadow.focus};
  }
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.text};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Kbd = styled.kbd`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 11px;
  padding: 1px 6px;
  border-radius: ${({ theme }) => theme.radius.xs};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[1]};
`;

const IconButton = styled.button`
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  cursor: pointer;
  transition: background ${({ theme }) => theme.transition.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Dot = styled.span`
  position: absolute;
  top: 8px;
  right: 9px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.danger};
  box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.bg};
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

export function Header() {
  const { session } = useAuth();
  const searchRef = useRef<HTMLInputElement>(null);
  const displayName = session?.username ?? 'Admin';
  const displayRole = session?.roles[0] ? humanizeRole(session.roles[0]) : 'Administrator';

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <Bar>
      <SearchWrap>
        <SearchOutlined />
        <SearchInput ref={searchRef} type="search" placeholder="Search customers, items, invoices…" aria-label="Search" />
        <Kbd>⌘K</Kbd>
      </SearchWrap>

      <Actions>
        <IconButton type="button" aria-label="Tasks">
          <CheckSquareOutlined />
        </IconButton>
        <IconButton type="button" aria-label="Notifications, unread">
          <BellOutlined />
          <Dot />
        </IconButton>
        <Divider />
        <UserButton type="button" aria-label={`Account menu for ${displayName}`}>
          <Avatar>{initials(displayName)}</Avatar>
          <UserText>
            <UserName>{displayName}</UserName>
            <UserRole>{displayRole}</UserRole>
          </UserText>
          <DownOutlined />
        </UserButton>
      </Actions>
    </Bar>
  );
}
