import { useEffect, useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { Button } from '@/components/common/Button/Button';
import { FormError } from '@/components/common/FormError/FormError';
import { Input } from '@/components/common/Input/Input';
import { Modal } from '@/components/common/Modal/Modal';
import type { Warehouse, WarehouseRequest } from '../types/inventory.types';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.textBody};
  cursor: pointer;
`;

const FORM_ID = 'warehouse-form';
const emptyForm: WarehouseRequest = { name: '', code: '', location: '', defaultWarehouse: false };

interface WarehouseFormModalProps {
  open: boolean;
  warehouse?: Warehouse | null;
  submitting: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (payload: WarehouseRequest) => void;
}

export function WarehouseFormModal({ open, warehouse, submitting, error, onClose, onSubmit }: WarehouseFormModalProps) {
  const [form, setForm] = useState<WarehouseRequest>(emptyForm);
  const isEdit = !!warehouse;

  useEffect(() => {
    if (!open) return;
    setForm(
      warehouse
        ? { name: warehouse.name, code: warehouse.code, location: warehouse.location ?? '', defaultWarehouse: warehouse.defaultWarehouse }
        : emptyForm,
    );
  }, [open, warehouse]);

  function update<K extends keyof WarehouseRequest>(key: K, value: WarehouseRequest[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const isValid = !!form.name.trim() && !!form.code.trim();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    onSubmit(form);
  }

  return (
    <Modal
      open={open}
      title={isEdit ? 'Edit warehouse' : 'New warehouse'}
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={!isValid} loading={submitting}>
            {isEdit ? 'Save changes' : 'Create warehouse'}
          </Button>
        </>
      }
    >
      <Form id={FORM_ID} onSubmit={handleSubmit}>
        <Input id="warehouseName" label="Name" value={form.name} onChange={(e) => update('name', e.target.value)} required autoFocus />
        <Input id="warehouseCode" label="Code" placeholder="WH-01" value={form.code} onChange={(e) => update('code', e.target.value)} required />
        <Input id="warehouseLocation" label="Location (optional)" value={form.location} onChange={(e) => update('location', e.target.value)} />
        <CheckboxRow>
          <input
            type="checkbox"
            checked={!!form.defaultWarehouse}
            onChange={(e) => update('defaultWarehouse', e.target.checked)}
          />
          Default warehouse
        </CheckboxRow>
        {error && <FormError>{error}</FormError>}
      </Form>
    </Modal>
  );
}
