import { useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common/Input/Input';
import type { MovementType, RecordMovementRequest, StockItemDto, WarehouseDto } from '../types/inventory.types';

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

const MOVEMENT_TYPES: MovementType[] = ['RECEIPT', 'ISSUE', 'ADJUSTMENT'];

interface StockMovementFormProps {
  open: boolean;
  items: StockItemDto[];
  warehouses: WarehouseDto[];
  submitting: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (payload: RecordMovementRequest) => void;
}

export function StockMovementForm({ open, items, warehouses, submitting, error, onClose, onSubmit }: StockMovementFormProps) {
  const [stockItemId, setStockItemId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [movementType, setMovementType] = useState<MovementType>('RECEIPT');
  const [quantity, setQuantity] = useState('');
  const [referenceNote, setReferenceNote] = useState('');

  if (!open) return null;

  const isValid = !!stockItemId && !!warehouseId && quantity.trim() !== '' && Number(quantity) !== 0;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    const magnitude = Math.abs(Number(quantity));
    const signedQuantity = movementType === 'ISSUE' ? -magnitude : magnitude;
    onSubmit({
      stockItemId: Number(stockItemId),
      warehouseId: Number(warehouseId),
      movementType,
      quantity: signedQuantity,
      referenceNote: referenceNote.trim() || undefined,
    });
  }

  return (
    <Overlay onClick={onClose}>
      <Panel onClick={(e) => e.stopPropagation()}>
        <CloseButton type="button" onClick={onClose} aria-label="Close">
          <CloseOutlined />
        </CloseButton>
        <Title>Record Stock Movement</Title>
        <Form onSubmit={handleSubmit}>
          <Field>
            <Label htmlFor="movementItem">Stock Item</Label>
            <Select id="movementItem" value={stockItemId} onChange={(e) => setStockItemId(e.target.value)} required>
              <option value="">Select item…</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.sku} — {item.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field>
            <Label htmlFor="movementWarehouse">Warehouse</Label>
            <Select id="movementWarehouse" value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)} required>
              <option value="">Select warehouse…</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </Select>
          </Field>

          <Row>
            <Field>
              <Label htmlFor="movementType">Type</Label>
              <Select
                id="movementType"
                value={movementType}
                onChange={(e) => setMovementType(e.target.value as MovementType)}
              >
                {MOVEMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </Field>
            <Input
              id="movementQuantity"
              label="Quantity"
              type="number"
              placeholder="10"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </Row>

          <Input
            id="movementNote"
            label="Reference Note (Optional)"
            placeholder="PO-1023"
            value={referenceNote}
            onChange={(e) => setReferenceNote(e.target.value)}
          />

          {error && <ErrorText>{error}</ErrorText>}

          <Actions>
            <Button type="submit" disabled={!isValid} loading={submitting}>
              Record Movement
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
