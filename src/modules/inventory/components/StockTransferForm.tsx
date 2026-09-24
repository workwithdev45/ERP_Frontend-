import { useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common/Input/Input';
import type { StockItemDto, StockTransferRequest, WarehouseDto } from '../types/inventory.types';

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
  max-width: 480px;
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

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Select = styled.select`
  height: 44px;
  padding: 0 ${({ theme }) => theme.space[4]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.bg};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.borderFocus};
  }
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

interface StockTransferFormProps {
  open: boolean;
  items: StockItemDto[];
  warehouses: WarehouseDto[];
  submitting: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (payload: StockTransferRequest) => void;
}

export function StockTransferForm({ open, items, warehouses, submitting, error, onClose, onSubmit }: StockTransferFormProps) {
  const [stockItemId, setStockItemId] = useState('');
  const [sourceWarehouseId, setSourceWarehouseId] = useState('');
  const [destinationWarehouseId, setDestinationWarehouseId] = useState('');
  const [quantity, setQuantity] = useState('');

  if (!open) return null;

  const isValid =
    !!stockItemId &&
    !!sourceWarehouseId &&
    !!destinationWarehouseId &&
    sourceWarehouseId !== destinationWarehouseId &&
    quantity.trim() !== '' &&
    Number(quantity) > 0;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({
      stockItemId: Number(stockItemId),
      sourceWarehouseId: Number(sourceWarehouseId),
      destinationWarehouseId: Number(destinationWarehouseId),
      quantity: Number(quantity),
    });
  }

  return (
    <Overlay onClick={onClose}>
      <Panel onClick={(e) => e.stopPropagation()}>
        <CloseButton type="button" onClick={onClose} aria-label="Close">
          <CloseOutlined />
        </CloseButton>
        <Title>New Stock Transfer</Title>
        <Form onSubmit={handleSubmit}>
          <Field>
            <Label htmlFor="transferItem">Stock Item</Label>
            <Select id="transferItem" value={stockItemId} onChange={(e) => setStockItemId(e.target.value)} required>
              <option value="">Select item…</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.sku} — {item.name}
                </option>
              ))}
            </Select>
          </Field>

          <Row>
            <Field>
              <Label htmlFor="transferSource">Source Warehouse</Label>
              <Select
                id="transferSource"
                value={sourceWarehouseId}
                onChange={(e) => setSourceWarehouseId(e.target.value)}
                required
              >
                <option value="">Select…</option>
                {warehouses.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field>
              <Label htmlFor="transferDestination">Destination Warehouse</Label>
              <Select
                id="transferDestination"
                value={destinationWarehouseId}
                onChange={(e) => setDestinationWarehouseId(e.target.value)}
                required
              >
                <option value="">Select…</option>
                {warehouses.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </Select>
            </Field>
          </Row>

          <Input
            id="transferQuantity"
            label="Quantity"
            type="number"
            placeholder="10"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />

          {error && <ErrorText>{error}</ErrorText>}

          <Actions>
            <Button type="submit" disabled={!isValid} loading={submitting}>
              Create Transfer
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
