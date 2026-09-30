import { useEffect, useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { Button } from '@/components/common/Button/Button';
import { FormError } from '@/components/common/FormError/FormError';
import { Input } from '@/components/common/Input/Input';
import { Modal } from '@/components/common/Modal/Modal';
import { Select } from '@/components/common/Select/Select';
import type { Warehouse } from '@/modules/inventory/types/inventory.types';
import type { TradeDocument } from '@/modules/trade/types/trade.types';
import type { ConvertQuotationRequest } from '../services/salesService';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

const Intro = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textBody};
`;

const FORM_ID = 'convert-quotation-form';

interface ConvertQuotationModalProps {
  quotation: TradeDocument | null;
  warehouses: Warehouse[];
  submitting: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (payload: ConvertQuotationRequest) => void;
}

/** Quotation → sales order: pick the warehouse whose stock the order reserves. */
export function ConvertQuotationModal({ quotation, warehouses, submitting, error, onClose, onSubmit }: ConvertQuotationModalProps) {
  const [warehouseId, setWarehouseId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [partyReference, setPartyReference] = useState('');

  useEffect(() => {
    if (!quotation) return;
    const preferred = warehouses.find((w) => w.defaultWarehouse) ?? warehouses[0];
    setWarehouseId(preferred ? String(preferred.id) : '');
    setDueDate('');
    setPartyReference('');
  }, [quotation, warehouses]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!warehouseId) return;
    onSubmit({ warehouseId: Number(warehouseId), dueDate: dueDate || undefined, partyReference: partyReference.trim() || undefined });
  }

  return (
    <Modal
      open={!!quotation}
      title={`Convert ${quotation?.docNumber ?? ''} to sales order`}
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={!warehouseId} loading={submitting}>
            Create sales order
          </Button>
        </>
      }
    >
      <Form id={FORM_ID} onSubmit={handleSubmit}>
        <Intro>The order keeps the quoted items and prices, and reserves available stock in the warehouse you choose.</Intro>
        <Select
          id="convertWarehouse"
          label="Ship from"
          placeholder="Select warehouse"
          value={warehouseId}
          options={warehouses.map((w) => ({ value: String(w.id), label: w.name }))}
          onChange={(e) => setWarehouseId(e.target.value)}
        />
        <Input id="convertDue" label="Expected delivery (optional)" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <Input
          id="convertRef"
          label="Customer PO no. (optional)"
          value={partyReference}
          onChange={(e) => setPartyReference(e.target.value)}
        />
        {error && <FormError>{error}</FormError>}
      </Form>
    </Modal>
  );
}
