import { useEffect, useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { Button } from '@/components/common/Button/Button';
import { FormError } from '@/components/common/FormError/FormError';
import { Input } from '@/components/common/Input/Input';
import { Modal } from '@/components/common/Modal/Modal';
import { Select } from '@/components/common/Select/Select';
import type { Warehouse } from '@/modules/inventory/types/inventory.types';
import type { DocumentRequest, TradeDocument } from '../types/trade.types';
import { formatMoney, todayIso } from '../utils/format';
import { computeTotals, lineTaxable } from '../utils/gst';
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

const Intro = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textBody};
  font-size: ${({ theme }) => theme.fontSize.md};
`;

const LinesScroll = styled.div`
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const LinesTable = styled.table`
  width: 100%;
  min-width: 640px;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.fontSize.sm};

  th {
    text-align: left;
    padding: ${({ theme }) => theme.space[2]};
    font-size: ${({ theme }) => theme.fontSize.xs};
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.textMuted};
    background: ${({ theme }) => theme.colors.bgSubtle};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  td {
    padding: ${({ theme }) => theme.space[2]};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    vertical-align: middle;
    color: ${({ theme }) => theme.colors.textBody};
  }

  tr:last-child td {
    border-bottom: none;
  }

  .num {
    text-align: right;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[4]};
  flex-wrap: wrap;
`;

const FORM_ID = 'fulfil-document-form';

export interface FulfilDocumentModalProps {
  open: boolean;
  title: string;
  intro: string;
  submitLabel: string;
  source: TradeDocument | null;
  /** Column header for what's already been done against each line, e.g. "Received". */
  doneLabel: string;
  /** Column header for this document's quantity, e.g. "Receive now". */
  quantityLabel: string;
  warehouseMode: 'required' | 'hidden';
  warehouseLabel?: string;
  warehouses?: Warehouse[];
  partyReferenceLabel?: string;
  dueLabel?: string;
  roundToRupee?: boolean;
  /** Pre-fill each line with its pending quantity (receipts, bills, deliveries); returns start at zero. */
  prefillPending?: boolean;
  submitting: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (payload: DocumentRequest) => void;
}

/**
 * Creates a follow-on document from a source one — GRN from a PO, bill from a GRN, delivery from
 * an order, invoice from a challan, or a return — defaulting each line to what's still pending.
 */
export function FulfilDocumentModal({
  open,
  title,
  intro,
  submitLabel,
  source,
  doneLabel,
  quantityLabel,
  warehouseMode,
  warehouseLabel = 'Warehouse',
  warehouses = [],
  partyReferenceLabel,
  dueLabel,
  roundToRupee,
  prefillPending = true,
  submitting,
  error,
  onClose,
  onSubmit,
}: FulfilDocumentModalProps) {
  const [quantities, setQuantities] = useState<Record<number, string>>({});
  const [docDate, setDocDate] = useState(todayIso());
  const [dueDate, setDueDate] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [partyReference, setPartyReference] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!open || !source) return;
    setQuantities(Object.fromEntries(source.lines.map((l) => [l.id, prefillPending ? String(l.pendingQuantity) : ''])));
    setDocDate(todayIso());
    setDueDate('');
    setWarehouseId(source.warehouseId ? String(source.warehouseId) : '');
    setPartyReference('');
    setNotes('');
  }, [open, source, prefillPending]);

  if (!source) return null;

  const lines = source.lines.map((line) => {
    const quantity = Number(quantities[line.id]) || 0;
    return { line, quantity, invalid: quantity < 0 || quantity > line.pendingQuantity };
  });
  const chosen = lines.filter((l) => l.quantity > 0);
  const totals = computeTotals(
    chosen.map(({ line, quantity }) => ({ quantity, rate: line.rate, discountPercent: line.discountPercent, gstRate: line.gstRate })),
    { interState: source.interState, reverseCharge: source.reverseCharge, roundToRupee: !!roundToRupee },
  );
  const isValid = chosen.length > 0 && lines.every((l) => !l.invalid) && (warehouseMode !== 'required' || !!warehouseId);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid || !source) return;
    onSubmit({
      sourceDocumentId: source.id,
      docDate,
      dueDate: dueDate || undefined,
      warehouseId: warehouseId ? Number(warehouseId) : undefined,
      partyReference: partyReference.trim() || undefined,
      notes: notes.trim() || undefined,
      lines: chosen.map(({ line, quantity }) => ({ sourceLineId: line.id, quantity })),
    });
  }

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
        <Intro>{intro}</Intro>
        <HeaderGrid>
          <Input id="fulfilDate" label="Date" type="date" value={docDate} onChange={(e) => setDocDate(e.target.value)} />
          {warehouseMode === 'required' && (
            <Select
              id="fulfilWarehouse"
              label={warehouseLabel}
              placeholder="Select warehouse"
              value={warehouseId}
              options={warehouses.map((w) => ({ value: String(w.id), label: w.name }))}
              onChange={(e) => setWarehouseId(e.target.value)}
            />
          )}
          {partyReferenceLabel && (
            <Input
              id="fulfilPartyRef"
              label={`${partyReferenceLabel} (optional)`}
              value={partyReference}
              onChange={(e) => setPartyReference(e.target.value)}
            />
          )}
          {dueLabel && (
            <Input id="fulfilDue" label={`${dueLabel} (optional)`} type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          )}
        </HeaderGrid>

        <LinesScroll>
          <LinesTable>
            <thead>
              <tr>
                <th>Item</th>
                <th className="num">On {source.docNumber}</th>
                <th className="num">{doneLabel}</th>
                <th className="num">Pending</th>
                <th style={{ width: 130 }}>{quantityLabel}</th>
                <th className="num">Rate</th>
                <th className="num">Amount</th>
              </tr>
            </thead>
            <tbody>
              {lines.map(({ line, quantity, invalid }, index) => (
                <tr key={line.id}>
                  <td>
                    {line.productName}
                    {line.itemType !== 'STOCK' && <span style={{ opacity: 0.6 }}> · no stock</span>}
                  </td>
                  <td className="num">{line.quantity}</td>
                  <td className="num">{line.fulfilledQuantity}</td>
                  <td className="num">{line.pendingQuantity}</td>
                  <td>
                    <Input
                      id={`fulfilQty${index}`}
                      aria-label={`${quantityLabel} for ${line.productName}`}
                      type="number"
                      min={0}
                      max={line.pendingQuantity}
                      value={quantities[line.id] ?? ''}
                      disabled={line.pendingQuantity === 0}
                      error={invalid ? `Max ${line.pendingQuantity}` : undefined}
                      onChange={(e) => setQuantities((prev) => ({ ...prev, [line.id]: e.target.value }))}
                    />
                  </td>
                  <td className="num">{formatMoney(line.rate)}</td>
                  <td className="num">
                    {formatMoney(lineTaxable({ quantity, rate: line.rate, discountPercent: line.discountPercent, gstRate: line.gstRate }))}
                  </td>
                </tr>
              ))}
            </tbody>
          </LinesTable>
        </LinesScroll>

        <Footer>
          <div style={{ flex: '1 1 280px' }}>
            <Input id="fulfilNotes" label="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <TotalsPanel totals={totals} interState={source.interState} reverseCharge={source.reverseCharge} />
        </Footer>
        {error && <FormError>{error}</FormError>}
      </Form>
    </Modal>
  );
}
