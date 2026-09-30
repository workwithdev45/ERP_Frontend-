import styled from 'styled-components';
import type { TabsProps } from './Tabs.types';

const Bar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[1]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  overflow-x: auto;
`;

const TabButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};
  border: none;
  border-bottom: 2px solid ${({ theme, $active }) => ($active ? theme.colors.primary : 'transparent')};
  background: none;
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme, $active }) => ($active ? theme.fontWeight.semibold : theme.fontWeight.medium)};
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.textSecondary)};
  white-space: nowrap;
  cursor: pointer;
  transition: color ${({ theme }) => theme.transition.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

/** A simple, controlled tab bar — used wherever a page needs to switch between a few related views. */
export function Tabs({ items, activeKey, onChange }: TabsProps) {
  return (
    <Bar role="tablist">
      {items.map((item) => (
        <TabButton
          key={item.key}
          type="button"
          role="tab"
          aria-selected={item.key === activeKey}
          $active={item.key === activeKey}
          onClick={() => onChange(item.key)}
        >
          {item.label}
          {item.badge}
        </TabButton>
      ))}
    </Bar>
  );
}
