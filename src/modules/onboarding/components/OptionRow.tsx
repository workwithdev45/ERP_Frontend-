import type { ReactNode } from 'react';
import styled from 'styled-components';

const Row = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};
  width: 100%;
  padding: ${({ theme }) => theme.space[4]};
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  text-align: left;
  transition: border-color ${({ theme }) => theme.transition.fast};

  & + & {
    margin-top: ${({ theme }) => theme.space[3]};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &:hover .option-title {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const IconBox = styled.div<{ $bg: string }>`
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $bg }) => $bg};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

const Body = styled.div`
  flex: 1;
`;

const OptionTitle = styled.div`
  font-weight: 700;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.navy};
  transition: color ${({ theme }) => theme.transition.fast};
`;

const OptionDescription = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 2px;
`;

interface OptionRowProps {
  icon: ReactNode;
  iconBg: string;
  title: string;
  description: string;
  onClick: () => void;
}

export function OptionRow({ icon, iconBg, title, description, onClick }: OptionRowProps) {
  return (
    <Row type="button" onClick={onClick}>
      <IconBox $bg={iconBg}>{icon}</IconBox>
      <Body>
        <OptionTitle className="option-title">{title}</OptionTitle>
        <OptionDescription>{description}</OptionDescription>
      </Body>
    </Row>
  );
}
