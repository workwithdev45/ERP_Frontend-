import { useEffect, useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { Button } from '@/components/common/Button/Button';
import { FormError } from '@/components/common/FormError/FormError';
import { Input } from '@/components/common/Input/Input';
import { Modal } from '@/components/common/Modal/Modal';
import { Select } from '@/components/common/Select/Select';
import { GST_RATE_OPTIONS, ITEM_TYPE_OPTIONS, UOM_OPTIONS } from '../utils/constants';
import type { ItemType, Product, ProductRequest, Warehouse } from '../types/inventory.types';

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

const SectionLabel = styled.div`
  margin-top: ${({ theme }) => theme.space[1]};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const UOM_LIST_ID = 'uom-suggestions';
const FORM_ID = 'product-form';

const emptyForm: ProductRequest = {
  sku: '',
  name: '',
  description: '',
  category: '',
  itemType: 'STOCK',
  hsnCode: '',
  gstRatePercent: undefined,
  barcode: '',
  unitOfMeasure: '',
  secondaryUnit: '',
  conversionFactor: undefined,
  reorderLevel: 0,
  active: true,
};

interface ProductFormModalProps {
  open: boolean;
  product?: Product | null;
  warehouses: Warehouse[];
  submitting: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (payload: ProductRequest) => void;
}

/** W7: item master — create/edit a product, with opening stock captured only when creating one. */
export function ProductFormModal({ open, product, warehouses, submitting, error, onClose, onSubmit }: ProductFormModalProps) {
  const [form, setForm] = useState<ProductRequest>(emptyForm);
  const isEdit = !!product;

  useEffect(() => {
    if (!open) return;
    if (product) {
      setForm({
        sku: product.sku,
        name: product.name,
        description: product.description ?? '',
        category: product.category ?? '',
        itemType: product.itemType,
        hsnCode: product.hsnCode ?? '',
        gstRatePercent: product.gstRatePercent ?? undefined,
        barcode: product.barcode ?? '',
        unitOfMeasure: product.unitOfMeasure ?? '',
        secondaryUnit: product.secondaryUnit ?? '',
        conversionFactor: product.conversionFactor ?? undefined,
        reorderLevel: product.reorderLevel,
        active: product.active,
      });
    } else {
      setForm(emptyForm);
    }
  }, [open, product]);

  function update<K extends keyof ProductRequest>(key: K, value: ProductRequest[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const isValid = !!form.sku.trim() && !!form.name.trim() && form.reorderLevel >= 0;
  const isStockItem = form.itemType === 'STOCK';

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    onSubmit(form);
  }

  return (
    <Modal
      open={open}
      title={isEdit ? 'Edit item' : 'New item'}
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={!isValid} loading={submitting}>
            {isEdit ? 'Save changes' : 'Create item'}
          </Button>
        </>
      }
    >
      <Form id={FORM_ID} onSubmit={handleSubmit}>
        <Row>
          <Input id="sku" label="SKU" value={form.sku} onChange={(e) => update('sku', e.target.value)} required autoFocus={!isEdit} />
          <Select
            id="itemType"
            label="Item type"
            options={ITEM_TYPE_OPTIONS}
            value={form.itemType}
            onChange={(e) => update('itemType', e.target.value as ItemType)}
          />
        </Row>
        <Input id="name" label="Item name" value={form.name} onChange={(e) => update('name', e.target.value)} required />
        <Row>
          <Input id="category" label="Category (optional)" value={form.category} onChange={(e) => update('category', e.target.value)} />
          <Input id="barcode" label="Barcode (optional)" value={form.barcode} onChange={(e) => update('barcode', e.target.value)} />
        </Row>

        <SectionLabel>GST & units</SectionLabel>
        <Row>
          <Input id="hsnCode" label="HSN/SAC code" value={form.hsnCode} onChange={(e) => update('hsnCode', e.target.value)} />
          <Select
            id="gstRate"
            label="GST rate"
            placeholder="Select rate"
            options={GST_RATE_OPTIONS}
            value={form.gstRatePercent === undefined ? '' : String(form.gstRatePercent)}
            onChange={(e) => update('gstRatePercent', e.target.value === '' ? undefined : Number(e.target.value))}
          />
        </Row>
        <Row>
          <Input
            id="unitOfMeasure"
            label="Base unit"
            placeholder="Pcs"
            list={UOM_LIST_ID}
            value={form.unitOfMeasure}
            onChange={(e) => update('unitOfMeasure', e.target.value)}
          />
          <Input
            id="secondaryUnit"
            label="Alternate unit (optional)"
            placeholder="Box"
            value={form.secondaryUnit}
            onChange={(e) => update('secondaryUnit', e.target.value)}
          />
        </Row>
        {form.secondaryUnit && (
          <Input
            id="conversionFactor"
            type="number"
            min={0}
            step="any"
            label={`1 ${form.secondaryUnit || 'unit'} = how many ${form.unitOfMeasure || 'base units'}?`}
            value={form.conversionFactor ?? ''}
            onChange={(e) => update('conversionFactor', e.target.value === '' ? undefined : Number(e.target.value))}
          />
        )}
        <datalist id={UOM_LIST_ID}>
          {UOM_OPTIONS.map((uom) => (
            <option key={uom} value={uom} />
          ))}
        </datalist>

        {isStockItem && (
          <>
            <SectionLabel>Stock</SectionLabel>
            <Input
              id="reorderLevel"
              type="number"
              min={0}
              label="Reorder level"
              hint="You'll see a low-stock alert at or below this quantity."
              value={form.reorderLevel}
              onChange={(e) => update('reorderLevel', Number(e.target.value))}
              required
            />
            {!isEdit && warehouses.length > 0 && (
              <>
                <SectionLabel>Opening stock (optional)</SectionLabel>
                <Row>
                  <Select
                    id="openingWarehouse"
                    label="Warehouse"
                    placeholder="No opening stock"
                    options={warehouses.map((w) => ({ value: String(w.id), label: w.name }))}
                    value={form.openingStockWarehouseId ? String(form.openingStockWarehouseId) : ''}
                    onChange={(e) => update('openingStockWarehouseId', e.target.value === '' ? undefined : Number(e.target.value))}
                  />
                  <Input
                    id="openingQuantity"
                    type="number"
                    min={0}
                    label="Quantity"
                    value={form.openingStockQuantity ?? ''}
                    onChange={(e) => update('openingStockQuantity', e.target.value === '' ? undefined : Number(e.target.value))}
                  />
                </Row>
                <Input
                  id="openingCost"
                  type="number"
                  min={0}
                  step="any"
                  label="Cost per unit (optional)"
                  hint="Used to value this stock — leave blank if you don't track cost yet."
                  value={form.openingStockUnitCost ?? ''}
                  onChange={(e) => update('openingStockUnitCost', e.target.value === '' ? undefined : Number(e.target.value))}
                />
              </>
            )}
          </>
        )}

        {error && <FormError>{error}</FormError>}
      </Form>
    </Modal>
  );
}
