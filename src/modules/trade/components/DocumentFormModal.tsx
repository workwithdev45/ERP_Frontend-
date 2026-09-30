import { useEffect, useMemo, useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button } from '@/components/common/Button/Button';
import { FormError } from '@/components/common/FormError/FormError';
import { IconButton } from '@/components/common/IconButton/IconButton';
import { Input } from '@/components/common/Input/Input';
import { Modal } from '@/components/common/Modal/Modal';
import { Select } from '@/components/common/Select/Select';
import type { Product, Warehouse } from '@/modules/inventory/types/inventory.types';
import type { DocumentRequest, Party } from '../types/trade.types';
import { GST_RATE_OPTIONS, formatMoney, todayIso } from '../utils/format';
import { computeTotals, isInterState, lineTaxable } from '../utils/gst';
import { TotalsPanel } from './TotalsPanel';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

const HeaderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[4]};

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const LinesScroll = styled.div`
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const LinesTable = styled.table`
  width: 100%;
  min-width: 760px;
  border-collapse: collapse;
  table-layout: fixed;

  th {
    text-align: left;
    padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[2]};
    font-size: ${({ theme }) => theme.fontSize.xs};
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.textMuted};
    background: ${({ theme }) => theme.colors.bgSubtle};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  td {
    padding: ${({ theme }) => theme.space[2]};
    vertical-align: top;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const Amount = styled.div`
  padding-top: ${({ theme }) => theme.space[2]};
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space[4]};
  flex-wrap: wrap;
`;

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.textBody};
  cursor: pointer;
`;

const FORM_ID = 'document-form';

interface LineState {
  key: number;
  productId: string;
  quantity: string;
  rate: string;
  discountPercent: string;
  gstRate: string;
}

export interface DocumentFormInitial {
  partyId?: number;
  warehouseId?: number;
  lines?: { productId: number; quantity: number; rate?: number | null; gstRate?: number | null }[];
}

export interface DocumentFormModalProps {
  open: boolean;
  title: string;
  submitLabel: string;
  partyLabel: string;
  parties: Party[];
  products: Product[];
  warehouses: Warehouse[];
  companyState: string | null;
  /** Label for the due-date field; omit to hide it. */
  dueLabel?: string;
  warehouseMode: 'required' | 'optional' | 'hidden';
  warehouseLabel?: string;
  warehouseHint?: string;
  partyReferenceLabel?: string;
  showReverseCharge?: boolean;
  /** Bills and invoices round the total to the nearest rupee. */
  roundToRupee?: boolean;
  initial?: DocumentFormInitial | null;
  submitting: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (payload: DocumentRequest) => void;
}

let nextKey = 1;

function blankLine(): LineState {
  return { key: nextKey++, productId: '', quantity: '1', rate: '', discountPercent: '0', gstRate: '' };
}

/** W6 reusable document form: header, lines grid, taxes and totals. */
export function DocumentFormModal({
  open,
  title,
  submitLabel,
  partyLabel,
  parties,
  products,
  warehouses,
  companyState,
  dueLabel,
  warehouseMode,
  warehouseLabel = 'Warehouse',
  warehouseHint,
  partyReferenceLabel,
  showReverseCharge,
  roundToRupee,
  initial,
  submitting,
  error,
  onClose,
  onSubmit,
}: DocumentFormModalProps) {
  const [partyId, setPartyId] = useState('');
  const [docDate, setDocDate] = useState(todayIso());
  const [dueDate, setDueDate] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [partyReference, setPartyReference] = useState('');
  const [reverseCharge, setReverseCharge] = useState(false);
  const [notes, setNotes] = useState('');
  const [lines, setLines] = useState<LineState[]>([blankLine()]);

  const activeProducts = useMemo(() => products.filter((p) => p.active), [products]);
  const productById = useMemo(() => new Map(products.map((p) => [String(p.id), p])), [products]);

  useEffect(() => {
    if (!open) return;
    const defaultWarehouse = warehouses.find((w) => w.defaultWarehouse) ?? warehouses[0];
    setPartyId(initial?.partyId ? String(initial.partyId) : '');
    setDocDate(todayIso());
    setDueDate('');
    setWarehouseId(
      initial?.warehouseId ? String(initial.warehouseId) : warehouseMode === 'hidden' || !defaultWarehouse ? '' : String(defaultWarehouse.id),
    );
    setPartyReference('');
    setReverseCharge(false);
    setNotes('');
    setLines(
      initial?.lines?.length
        ? initial.lines.map((l) => ({
            key: nextKey++,
            productId: String(l.productId),
            quantity: String(l.quantity),
            rate: l.rate != null ? String(l.rate) : '',
            discountPercent: '0',
            gstRate: String(l.gstRate ?? productById.get(String(l.productId))?.gstRatePercent ?? 0),
          }))
        : [blankLine()],
    );
    // Reset only when the modal opens, not on every parent re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const party = parties.find((p) => String(p.id) === partyId);
  const interState = isInterState(companyState, party?.state);

  function updateLine(key: number, patch: Partial<LineState>) {
    setLines((prev) => prev.map((line) => (line.key === key ? { ...line, ...patch } : line)));
  }

  function chooseProduct(key: number, productId: string) {
    const product = productById.get(productId);
    updateLine(key, { productId, gstRate: String(product?.gstRatePercent ?? 0) });
  }

  const numericLines = lines.map((l) => ({
    quantity: Number(l.quantity) || 0,
    rate: Number(l.rate) || 0,
    discountPercent: Number(l.discountPercent) || 0,
    gstRate: Number(l.gstRate) || 0,
  }));
  const totals = computeTotals(numericLines, { interState, reverseCharge, roundToRupee: !!roundToRupee });

  const linesValid = lines.length > 0 && lines.every((l) => l.productId && Number(l.quantity) >= 1 && l.rate !== '' && Number(l.rate) >= 0);
  const needsWarehouse =
    warehouseMode === 'required' ||
    (warehouseMode === 'optional' && lines.some((l) => productById.get(l.productId)?.itemType === 'STOCK'));
  const isValid = !!partyId && linesValid && (!needsWarehouse || !!warehouseId);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({
      partyId: Number(partyId),
      docDate,
      dueDate: dueDate || undefined,
      warehouseId: warehouseId ? Number(warehouseId) : undefined,
      partyReference: partyReference.trim() || undefined,
      reverseCharge: showReverseCharge ? reverseCharge : undefined,
      notes: notes.trim() || undefined,
      lines: lines.map((l) => ({
        productId: Number(l.productId),
        quantity: Number(l.quantity),
        rate: Number(l.rate),
        discountPercent: Number(l.discountPercent) || 0,
        gstRate: Number(l.gstRate) || 0,
      })),
    });
  }

  const productOptions = activeProducts.map((p) => ({ value: String(p.id), label: `${p.name} (${p.sku})` }));
  const warehouseOptions = warehouses.map((w) => ({ value: String(w.id), label: w.name }));

  return (
    <Modal
      open={open}
      size="xl"
      title={title}
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={!isValid} loading={submitting}>
            {submitLabel}
          </Button>
        </>
      }
    >
      <Form id={FORM_ID} onSubmit={handleSubmit}>
        <HeaderGrid>
          <Select
            id="docParty"
            label={partyLabel}
            placeholder={`Select ${partyLabel.toLowerCase()}`}
            value={partyId}
            options={parties.filter((p) => p.active).map((p) => ({ value: String(p.id), label: p.name }))}
            hint={party ? `${party.state ?? 'No state'} · ${interState ? 'IGST' : 'CGST + SGST'}` : undefined}
            onChange={(e) => setPartyId(e.target.value)}
          />
          <Input id="docDate" label="Date" type="date" value={docDate} onChange={(e) => setDocDate(e.target.value)} />
          {dueLabel ? (
            <Input id="docDue" label={`${dueLabel} (optional)`} type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          ) : (
            <div />
          )}
          {warehouseMode !== 'hidden' && (
            <Select
              id="docWarehouse"
              label={warehouseMode === 'optional' ? `${warehouseLabel} (for stock items)` : warehouseLabel}
              placeholder="Select warehouse"
              value={warehouseId}
              options={warehouseOptions}
              hint={warehouseHint}
              onChange={(e) => setWarehouseId(e.target.value)}
            />
          )}
          {partyReferenceLabel && (
            <Input
              id="docPartyRef"
              label={`${partyReferenceLabel} (optional)`}
              value={partyReference}
              onChange={(e) => setPartyReference(e.target.value)}
            />
          )}
        </HeaderGrid>

        <LinesScroll>
          <LinesTable>
            <thead>
              <tr>
                <th style={{ width: '35%' }}>Item</th>
                <th style={{ width: '10%' }}>Qty</th>
                <th style={{ width: '13%' }}>Rate ₹</th>
                <th style={{ width: '10%' }}>Disc %</th>
                <th style={{ width: '12%' }}>GST</th>
                <th style={{ width: '14%', textAlign: 'right' }}>Amount</th>
                <th style={{ width: '48px' }}>
                  <span className="sr-only">Remove</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line, index) => {
                const product = productById.get(line.productId);
                return (
                  <tr key={line.key}>
                    <td>
                      <Select
                        id={`lineProduct${index}`}
                        aria-label={`Item on line ${index + 1}`}
                        placeholder="Select item"
                        value={line.productId}
                        options={productOptions}
                        hint={product ? [product.hsnCode && `HSN ${product.hsnCode}`, product.unitOfMeasure].filter(Boolean).join(' · ') : undefined}
                        onChange={(e) => chooseProduct(line.key, e.target.value)}
                      />
                    </td>
                    <td>
                      <Input
                        id={`lineQty${index}`}
                        aria-label={`Quantity on line ${index + 1}`}
                        type="number"
                        min={1}
                        value={line.quantity}
                        onChange={(e) => updateLine(line.key, { quantity: e.target.value })}
                      />
                    </td>
                    <td>
                      <Input
                        id={`lineRate${index}`}
                        aria-label={`Rate on line ${index + 1}`}
                        type="number"
                        min={0}
                        step="0.01"
                        value={line.rate}
                        onChange={(e) => updateLine(line.key, { rate: e.target.value })}
                      />
                    </td>
                    <td>
                      <Input
                        id={`lineDisc${index}`}
                        aria-label={`Discount on line ${index + 1}`}
                        type="number"
                        min={0}
                        max={100}
                        step="0.01"
                        value={line.discountPercent}
                        onChange={(e) => updateLine(line.key, { discountPercent: e.target.value })}
                      />
                    </td>
                    <td>
                      <Select
                        id={`lineGst${index}`}
                        aria-label={`GST rate on line ${index + 1}`}
                        value={line.gstRate}
                        options={GST_RATE_OPTIONS}
                        placeholder="GST"
                        onChange={(e) => updateLine(line.key, { gstRate: e.target.value })}
                      />
                    </td>
                    <td>
                      <Amount>{formatMoney(lineTaxable(numericLines[index]))}</Amount>
                    </td>
                    <td>
                      <IconButton
                        type="button"
                        aria-label={`Remove line ${index + 1}`}
                        title="Remove line"
                        disabled={lines.length === 1}
                        onClick={() => setLines((prev) => prev.filter((l) => l.key !== line.key))}
                      >
                        <DeleteOutlined />
                      </IconButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </LinesTable>
        </LinesScroll>

        <Footer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: '1 1 280px' }}>
            <div>
              <Button type="button" variant="secondary" leadingIcon={<PlusOutlined />} onClick={() => setLines((prev) => [...prev, blankLine()])}>
                Add line
              </Button>
            </div>
            {showReverseCharge && (
              <CheckboxRow>
                <input type="checkbox" checked={reverseCharge} onChange={(e) => setReverseCharge(e.target.checked)} />
                Reverse charge — we pay the GST to the government, not the vendor
              </CheckboxRow>
            )}
            <Input id="docNotes" label="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <TotalsPanel totals={totals} interState={interState} reverseCharge={reverseCharge} />
        </Footer>

        {!companyState && (
          <FormError>Add your company's state in Settings → Company first — GST needs it to split CGST + SGST or IGST.</FormError>
        )}
        {error && <FormError>{error}</FormError>}
      </Form>
    </Modal>
  );
}
