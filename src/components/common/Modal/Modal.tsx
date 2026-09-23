import styled from 'styled-components';
import { Card } from '@/components/common/Card/Card';
import type { ModalProps } from './Modal.types';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: ${({ theme }) => theme.space[6]} ${({ theme }) => theme.space[4]};
  z-index: 100;
  overflow-y: auto;
`;

const Panel = styled(Card)`
  width: 100%;
  max-width: 480px;
  padding: ${({ theme }) => theme.space[6]};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.space[5]};
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.navy};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space[3]};
  margin-top: ${({ theme }) => theme.space[6]};
`;

export function Modal({ open, title, onClose, children, footer }: ModalProps) {
  if (!open) return null;

  return (
    <Overlay onClick={onClose}>
      <Panel onClick={(e) => e.stopPropagation()}>
        <Header>
          {title && <Title>{title}</Title>}
          <CloseButton type="button" aria-label="Close" onClick={onClose}>
            ✕
          </CloseButton>
        </Header>
        {children}
        {footer && <Footer>{footer}</Footer>}
      </Panel>
    </Overlay>
  );
}
