import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

const VIEWPORT_MARGIN = 12;
const MENU_WIDTH = 200;

const Panel = styled.div<{ $top: number; $left: number }>`
  position: fixed;
  top: ${({ $top }) => $top}px;
  left: ${({ $left }) => $left}px;
  width: ${MENU_WIDTH}px;
  padding: ${({ theme }) => theme.space[1]};
  z-index: 300;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.lg};
`;

const MenuItemButton = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  width: 100%;
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: none;
  text-align: left;
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme, $danger }) => ($danger ? theme.colors.danger : theme.colors.textBody)};
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:not(:disabled):hover,
  &:not(:disabled):focus-visible {
    outline: none;
    background: ${({ theme, $danger }) => ($danger ? theme.colors.dangerLight : theme.colors.primaryLight)};
  }
`;

const Divider = styled.div`
  height: 1px;
  margin: ${({ theme }) => theme.space[1]} 0;
  background: ${({ theme }) => theme.colors.border};
`;

export interface ActionMenuItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  divider?: boolean;
  onSelect?: () => void;
}

interface ActionMenuProps {
  trigger: (open: () => void, isOpen: boolean) => ReactNode;
  items: ActionMenuItem[];
}

/** A trigger button plus a portal-rendered dropdown menu — used for row actions and the account menu. */
export function ActionMenu({ trigger, items }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (!triggerRef.current?.contains(target) && !panelRef.current?.contains(target)) {
        setIsOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const menuHeight = items.length * 40 + 16;
    let top = rect.bottom + 4;
    if (top + menuHeight > window.innerHeight - VIEWPORT_MARGIN) {
      top = Math.max(rect.top - menuHeight - 4, VIEWPORT_MARGIN);
    }
    let left = rect.right - MENU_WIDTH;
    if (left < VIEWPORT_MARGIN) left = rect.left;
    setPosition({ top, left });
  }, [isOpen, items.length]);

  return (
    <div ref={triggerRef} style={{ display: 'inline-flex' }}>
      {trigger(() => setIsOpen((v) => !v), isOpen)}
      {isOpen &&
        position &&
        createPortal(
          <Panel ref={panelRef} $top={position.top} $left={position.left} role="menu">
            {items.map((item) => (
              <div key={item.key}>
                {item.divider && <Divider />}
                <MenuItemButton
                  type="button"
                  role="menuitem"
                  $danger={item.danger}
                  disabled={item.disabled}
                  onClick={() => {
                    setIsOpen(false);
                    item.onSelect?.();
                  }}
                >
                  {item.icon}
                  {item.label}
                </MenuItemButton>
              </div>
            ))}
          </Panel>,
          document.body,
        )}
    </div>
  );
}
