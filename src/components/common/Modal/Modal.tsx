import styled from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';
import { Card } from '@/components/common/Card/Card';
import type { ModalProps } from './Modal.types';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.overlay};
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 10vh ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[6]};
  z-index: 100;
  overflow-y: auto;
`;

const Panel = styled(Card)`
  width: 100%;
  max-width: 520px;
  padding: ${({ theme }) => theme.space[6]};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  border-color: transparent;
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

export function Modal({ open, title, onClose, children, footer }: ModalProps) {
  if (!open) return null;

  return (
    <Overlay onClick={onClose}>
      <Panel onClick={(e) => e.stopPropagation()}>
        <Header>
          {title && <Title>{title}</Title>}
          <CloseButton type="button" aria-label="Close" onClick={onClose}>
            <CloseOutlined />
          </CloseButton>
        </Header>
        {children}
        {footer && <Footer>{footer}</Footer>}
      </Panel>
    </Overlay>
  );
}
