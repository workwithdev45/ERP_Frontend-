import { useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { Button } from '@/components/common/Button/Button';
import { FormError } from '@/components/common/FormError/FormError';
import { Input } from '@/components/common/Input/Input';
import { Modal } from '@/components/common/Modal/Modal';
import { Select } from '@/components/common/Select/Select';
import type { Product, StockTransferRequest, Warehouse } from '../types/inventory.types';

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

const FORM_ID = 'stock-transfer-form';

interface StockTransferModalProps {
  open: boolean;
  products: Product[];
  warehouses: Warehouse[];
  submitting: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (payload: StockTransferRequest) => void;
}

/** W8: move stock between two warehouses as one atomic transfer. */
export function StockTransferModal({ open, products, warehouses, submitting, error, onClose, onSubmit }: StockTransferModalProps) {
  const [productId, setProductId] = useState('');
  const [fromWarehouseId, setFromWarehouseId] = useState('');
  const [toWarehouseId, setToWarehouseId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');

  const sameWarehouse = !!fromWarehouseId && fromWarehouseId === toWarehouseId;
  const isValid = !!productId && !!fromWarehouseId && !!toWarehouseId && !sameWarehouse && Number(quantity) > 0;

  function reset() {
    setProductId('');
    setFromWarehouseId('');
    setToWarehouseId('');
    setQuantity('');
    setNote('');
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({
      productId: Number(productId),
      fromWarehouseId: Number(fromWarehouseId),
      toWarehouseId: Number(toWarehouseId),
      quantity: Number(quantity),
      reason: note || undefined,
    });
  }

  return (
    <Modal
      open={open}
      title="Transfer stock"
      onClose={handleClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={!isValid} loading={submitting}>
            Transfer
          </Button>
        </>
      }
    >
      <Form id={FORM_ID} onSubmit={handleSubmit}>
        <Select
          id="transferProduct"
          label="Item"
          placeholder="Select item"
          options={products.map((p) => ({ value: String(p.id), label: `${p.name} (${p.sku})` }))}
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          required
        />
        <Row>
          <Select
            id="fromWarehouse"
            label="From warehouse"
            placeholder="Select warehouse"
            options={warehouses.map((w) => ({ value: String(w.id), label: w.name }))}
            value={fromWarehouseId}
            onChange={(e) => setFromWarehouseId(e.target.value)}
            required
          />
          <Select
            id="toWarehouse"
            label="To warehouse"
            placeholder="Select warehouse"
            options={warehouses.map((w) => ({ value: String(w.id), label: w.name }))}
            value={toWarehouseId}
            onChange={(e) => setToWarehouseId(e.target.value)}
            error={sameWarehouse ? 'Pick a different destination warehouse' : undefined}
            required
          />
        </Row>
        <Input id="transferQuantity" type="number" min={1} label="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
        <Input id="transferNote" label="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
        {error && <FormError>{error}</FormError>}
      </Form>
    </Modal>
  );
}
