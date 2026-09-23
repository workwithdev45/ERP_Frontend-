import styled from 'styled-components';
import { SearchOutlined, BellOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';

const Bar = styled.header`
  height: 72px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[5]};
  padding: 0 ${({ theme }) => theme.space[6]};
  background: ${({ theme }) => theme.colors.bg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const SearchWrap = styled.div`
  flex: 1;
  max-width: 480px;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  background: ${({ theme }) => theme.colors.bgSubtle};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: ${({ theme }) => theme.space[2]};
`;

const SearchBadge = styled.div`
  width: 38px;
  height: 38px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.navy};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 16px;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Spacer = styled.div`
  flex: 1;
`;

const IconButton = styled.button`
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: none;
  background: ${({ theme }) => theme.colors.bgSubtle};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
`;

const Dot = styled.span`
  position: absolute;
  top: 6px;
  right: 8px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.danger};
`;

const UserBlock = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 15px;
`;

const UserText = styled.div`
  line-height: 1.2;
`;

const UserName = styled.div`
  font-weight: 700;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.navy};
`;

const UserRole = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function Header() {
  const { session } = useAuth();
  const displayName = session?.username ?? 'Dr. Admin';
  const displayRole = session?.roles[0] ?? 'System Admin';

  return (
    <Bar>
      <SearchWrap>
        <SearchBadge>
          <SearchOutlined />
        </SearchBadge>
        <SearchInput placeholder="Search customers, products, or invoices..." />
      </SearchWrap>
      <Spacer />
      <IconButton aria-label="Notifications">
        <BellOutlined />
        <Dot />
      </IconButton>
      <IconButton aria-label="Tasks">
        <CheckCircleOutlined />
      </IconButton>
      <UserBlock>
        <Avatar>{initials(displayName)}</Avatar>
        <UserText>
          <UserName>{displayName}</UserName>
          <UserRole>{displayRole}</UserRole>
        </UserText>
      </UserBlock>
    </Bar>
  );
}
