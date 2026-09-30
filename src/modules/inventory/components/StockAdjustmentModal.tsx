import { useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { Button } from '@/components/common/Button/Button';
import { FormError } from '@/components/common/FormError/FormError';
import { Input } from '@/components/common/Input/Input';
import { Modal } from '@/components/common/Modal/Modal';
import { Select } from '@/components/common/Select/Select';
import { ADJUSTMENT_REASON_OPTIONS } from '../utils/constants';
import type { AdjustmentReason, Product, StockAdjustmentRequest, Warehouse } from '../types/inventory.types';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.space[4]};

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const DirectionRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[2]};
`;

const DirectionButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
  border: 1px solid ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.borderStrong)};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme, $active }) => ($active ? theme.colors.primaryLight : theme.colors.bg)};
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.textBody)};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  cursor: pointer;
`;

const FORM_ID = 'stock-adjustment-form';

interface StockAdjustmentModalProps {
  open: boolean;
  products: Product[];
  warehouses: Warehouse[];
  submitting: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (payload: StockAdjustmentRequest) => void;
}

/** W8: manual stock-in / stock-out with a reason code, separate from receiving via Purchase. */
export function StockAdjustmentModal({ open, products, warehouses, submitting, error, onClose, onSubmit }: StockAdjustmentModalProps) {
  const [direction, setDirection] = useState<'IN' | 'OUT'>('IN');
  const [productId, setProductId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitCost, setUnitCost] = useState('');
  const [reasonCode, setReasonCode] = useState<AdjustmentReason | ''>('');
  const [note, setNote] = useState('');

  const isValid = !!productId && !!warehouseId && Number(quantity) > 0;

  function reset() {
    setDirection('IN');
    setProductId('');
    setWarehouseId('');
    setQuantity('');
    setUnitCost('');
    setReasonCode('');
    setNote('');
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    const signedQuantity = direction === 'IN' ? Number(quantity) : -Number(quantity);
    onSubmit({
      productId: Number(productId),
      warehouseId: Number(warehouseId),
      quantity: signedQuantity,
      unitCost: direction === 'IN' && unitCost !== '' ? Number(unitCost) : undefined,
      reasonCode: reasonCode || undefined,
      reason: note || undefined,
    });
  }

  return (
    <Modal
      open={open}
      title="Adjust stock"
      onClose={handleClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={!isValid} loading={submitting}>
            Apply adjustment
          </Button>
        </>
      }
    >
      <Form id={FORM_ID} onSubmit={handleSubmit}>
        <DirectionRow>
          <DirectionButton type="button" $active={direction === 'IN'} onClick={() => setDirection('IN')}>
            Add stock
          </DirectionButton>
          <DirectionButton type="button" $active={direction === 'OUT'} onClick={() => setDirection('OUT')}>
            Remove stock
          </DirectionButton>
        </DirectionRow>
        <Select
          id="adjustProduct"
          label="Item"
          placeholder="Select item"
          options={products.map((p) => ({ value: String(p.id), label: `${p.name} (${p.sku})` }))}
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          required
        />
        <Select
          id="adjustWarehouse"
          label="Warehouse"
          placeholder="Select warehouse"
          options={warehouses.map((w) => ({ value: String(w.id), label: w.name }))}
          value={warehouseId}
          onChange={(e) => setWarehouseId(e.target.value)}
          required
        />
        <Row>
          <Input id="adjustQuantity" type="number" min={1} label="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
          {direction === 'IN' ? (
            <Input
              id="adjustUnitCost"
              type="number"
              min={0}
              step="any"
              label="Cost per unit (optional)"
              value={unitCost}
              onChange={(e) => setUnitCost(e.target.value)}
            />
          ) : (
            <Select
              id="adjustReason"
              label="Reason"
              placeholder="Select reason"
              options={ADJUSTMENT_REASON_OPTIONS}
              value={reasonCode}
              onChange={(e) => setReasonCode(e.target.value as AdjustmentReason)}
            />
          )}
        </Row>
        <Input id="adjustNote" label="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
        {error && <FormError>{error}</FormError>}
      </Form>
    </Modal>
  );
}
