import { useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common/Input/Input';
import type { StockItemUpsertRequest } from '../types/inventory.types';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: ${({ theme }) => theme.space[4]};
`;

const Panel = styled.div`
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.bg};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.space[6]};
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.space[5]};
  right: ${({ theme }) => theme.space[5]};
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.bgSubtle};
  }
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.navy};
  margin-bottom: ${({ theme }) => theme.space[5]};
  padding-right: ${({ theme }) => theme.space[8]};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.space[4]};
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space[3]};
  margin-top: ${({ theme }) => theme.space[2]};
  padding-top: ${({ theme }) => theme.space[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

interface StockItemFormModalProps {
  open: boolean;
  submitting: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (payload: StockItemUpsertRequest) => void;
}

export function StockItemFormModal({ open, submitting, error, onClose, onSubmit }: StockItemFormModalProps) {
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [uom, setUom] = useState('');
  const [reorderThreshold, setReorderThreshold] = useState('');

  if (!open) return null;

  const isValid = !!sku.trim() && !!name.trim() && !!uom.trim() && reorderThreshold.trim() !== '';

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({
      sku: sku.trim().toUpperCase(),
      name: name.trim(),
      category: category.trim() || undefined,
      uom: uom.trim().toUpperCase(),
      reorderThreshold: Number(reorderThreshold),
    });
  }

  return (
    <Overlay onClick={onClose}>
      <Panel onClick={(e) => e.stopPropagation()}>
        <CloseButton type="button" onClick={onClose} aria-label="Close">
          <CloseOutlined />
        </CloseButton>
        <Title>Add Stock Item</Title>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Input id="itemSku" label="SKU" placeholder="SKU-001" value={sku} onChange={(e) => setSku(e.target.value)} required />
            <Input id="itemName" label="Name" placeholder="Item name" value={name} onChange={(e) => setName(e.target.value)} required />
          </Row>
          <Row>
            <Input
              id="itemCategory"
              label="Category (Optional)"
              placeholder="Raw Material"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <Input id="itemUom" label="Unit of Measure" placeholder="PCS" value={uom} onChange={(e) => setUom(e.target.value)} required />
          </Row>
          <Input
            id="itemReorderThreshold"
            label="Reorder Threshold"
            type="number"
            placeholder="10"
            value={reorderThreshold}
            onChange={(e) => setReorderThreshold(e.target.value)}
            required
          />

          {error && <ErrorText>{error}</ErrorText>}

          <Actions>
            <Button type="submit" disabled={!isValid} loading={submitting}>
              Create Item
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </Actions>
        </Form>
      </Panel>
    </Overlay>
  );
}
