import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';
import { Card } from '@/components/common/Card/Card';
import type { ModalProps } from './Modal.types';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.overlay};
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.space[5]} ${({ theme }) => theme.space[4]};
  z-index: 1000;
  overflow-y: auto;
`;

const PANEL_WIDTH = { md: '520px', lg: '760px', xl: '1040px' } as const;

const Panel = styled(Card)<{ $size: keyof typeof PANEL_WIDTH }>`
  width: 100%;
  max-width: ${({ $size }) => PANEL_WIDTH[$size]};
  /* Auto margins centre the dialog on screen, and let a tall one scroll instead of being clipped. */
  margin: auto 0;
  padding: ${({ theme }) => theme.space[6]};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  border-color: transparent;

  &:focus {
    outline: none;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.space[5]};
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textStrong};
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 14px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space[3]};
  margin-top: ${({ theme }) => theme.space[6]};
`;

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({ open, title, onClose, children, footer, size = 'md' }: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  // Keep the latest onClose without re-running the focus effect when a parent passes a new function.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;

    // Focus the first field (or the dialog itself) unless something inside already asked for focus.
    if (panel && !panel.contains(document.activeElement)) {
      const first = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].find((el) => el.getAttribute('aria-label') !== 'Close');
      (first ?? panel).focus();
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      // Keep Tab inside the dialog.
      if (event.key === 'Tab' && panel) {
        const focusable = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)];
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      // Return focus to whatever opened the dialog.
      previouslyFocused?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  // Portal to <body> so the backdrop covers the whole app (sidebar included), wherever the modal is used.
  return createPortal(
    <Overlay onClick={onClose}>
      <Panel
        ref={panelRef}
        $size={size}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <Header>
          {title && <Title id={titleId}>{title}</Title>}
          <CloseButton type="button" aria-label="Close" onClick={onClose}>
            <CloseOutlined />
          </CloseButton>
        </Header>
        {children}
        {footer && <Footer>{footer}</Footer>}
      </Panel>
    </Overlay>,
    document.body,
  );
}
