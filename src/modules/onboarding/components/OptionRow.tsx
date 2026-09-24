import type { ReactNode } from 'react';
import styled from 'styled-components';

const Row = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};
  width: 100%;
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[7]} ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[4]};
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.xs};
  cursor: pointer;
  text-align: left;
  transition:
    border-color ${({ theme }) => theme.transition.fast},
    background ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast},
    transform ${({ theme }) => theme.transition.fast};

  /* Chevron affordance */
  &::after {
    content: '';
    position: absolute;
    right: 22px;
    top: 50%;
    width: 8px;
    height: 8px;
    border-top: 2px solid ${({ theme }) => theme.colors.textDisabled};
    border-right: 2px solid ${({ theme }) => theme.colors.textDisabled};
    transform: translateY(-50%) rotate(45deg);
    transition:
      right ${({ theme }) => theme.transition.fast},
      border-color ${({ theme }) => theme.transition.fast};
  }

  & + & {
    margin-top: ${({ theme }) => theme.space[3]};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryBorder};
    background: ${({ theme }) => theme.colors.primaryLight};
    box-shadow: ${({ theme }) => theme.shadow.md};
    transform: translateY(-1px);
  }

  &:hover::after {
    right: 18px;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.colors.borderFocus};
    box-shadow: ${({ theme }) => theme.shadow.focus};
  }

  &:hover .option-title {
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const IconBox = styled.div<{ $bg: string }>`
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ $bg }) => $bg};
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12), 0 4px 10px -2px rgba(11, 27, 52, 0.25);
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
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textStrong};
  transition: color ${({ theme }) => theme.transition.fast};
`;

const OptionDescription = styled.div`
  font-size: 13px;
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 3px;
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
