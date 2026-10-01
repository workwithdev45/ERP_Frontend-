import { useEffect, useRef, useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { Button } from '@/components/common/Button/Button';
import { FormError } from '@/components/common/FormError/FormError';
import { Input } from '@/components/common/Input/Input';
import { Modal } from '@/components/common/Modal/Modal';
import { Select } from '@/components/common/Select/Select';
import type { DocumentSummary, Party, PaymentMode, PaymentRequest } from '../types/trade.types';
import { PAYMENT_MODE_OPTIONS, formatDate, formatMoney, todayIso } from '../utils/format';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.space[4]};

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const Scroll = styled.div`
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const Grid = styled.table`
  width: 100%;
  min-width: 520px;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.fontSize.sm};

  th {
    text-align: left;
    padding: ${({ theme }) => theme.space[2]};
    font-size: ${({ theme }) => theme.fontSize.xs};
    color: ${({ theme }) => theme.colors.textMuted};
    background: ${({ theme }) => theme.colors.bgSubtle};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  td {
    padding: ${({ theme }) => theme.space[2]};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.textBody};
    vertical-align: middle;
  }

  tr:last-child td {
    border-bottom: none;
  }

  .num {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
`;

const Summary = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Empty = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const FORM_ID = 'payment-form';
const round2 = (value: number) => Math.round(value * 100) / 100;

interface PaymentFormModalProps {
  open: boolean;
  title: string;
  partyLabel: string;
  parties: Party[];
  /** Loads the party's open bills (vendor payments) or invoices (receipts). */
  loadOpenDocuments: (partyId: number) => Promise<DocumentSummary[]>;
  initialPartyId?: number | null;
  initialDocumentId?: number | null;
  submitting: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (payload: PaymentRequest) => void;
}

/** A vendor payment or customer receipt, allocated against open bills/invoices — oldest first by default. */
export function PaymentFormModal({
  open,
  title,
  partyLabel,
  parties,
  loadOpenDocuments,
  initialPartyId,
  initialDocumentId,
  submitting,
  error,
  onClose,
  onSubmit,
}: PaymentFormModalProps) {
  const [partyId, setPartyId] = useState('');
  const [paymentDate, setPaymentDate] = useState(todayIso());
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState<PaymentMode>('BANK_TRANSFER');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [allocations, setAllocations] = useState<Record<number, string>>({});

  const [openDocuments, setOpenDocuments] = useState<DocumentSummary[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  // The first load after opening from a bill/invoice pre-fills its balance.
  const prefillRef = useRef<number | null>(null);
  const loadRef = useRef(loadOpenDocuments);
  loadRef.current = loadOpenDocuments;

  useEffect(() => {
    if (!open) return;
    setPartyId(initialPartyId ? String(initialPartyId) : '');
    setPaymentDate(todayIso());
    setMode('BANK_TRANSFER');
    setReference('');
    setNotes('');
    setAmount('');
    setAllocations({});
    prefillRef.current = initialDocumentId ?? null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open || !partyId) {
      setOpenDocuments([]);
      return;
    }
    let cancelled = false;
    setLoadingDocs(true);
    loadRef
      .current(Number(partyId))
      .then((docs) => {
        if (cancelled) return;
        const sorted = docs.filter((d) => d.balance > 0).sort((a, b) => a.docDate.localeCompare(b.docDate) || a.id - b.id);
        setOpenDocuments(sorted);
        const prefill = sorted.find((d) => d.id === prefillRef.current);
        if (prefill) {
          setAmount(String(prefill.balance));
          setAllocations({ [prefill.id]: String(prefill.balance) });
        }
        prefillRef.current = null;
      })
      .catch(() => {
        if (!cancelled) setOpenDocuments([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingDocs(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, partyId]);

  /** Spreads the amount over open documents, oldest first — but the one the form was opened from comes first. */
  function autoAllocate(total: number) {
    const ordered = [...openDocuments].sort((a, b) => Number(b.id === initialDocumentId) - Number(a.id === initialDocumentId));
    let remaining = total;
    const next: Record<number, string> = {};
    for (const doc of ordered) {
      const take = round2(Math.min(remaining, doc.balance));
      if (take > 0) next[doc.id] = String(take);
      remaining = round2(remaining - take);
    }
    setAllocations(next);
  }

  function changeParty(value: string) {
    setPartyId(value);
    setAllocations({});
    setAmount('');
  }

  function changeAmount(value: string) {
    setAmount(value);
    autoAllocate(Number(value) || 0);
  }

  const amountValue = Number(amount) || 0;
  const allocated = round2(Object.values(allocations).reduce((sum, v) => sum + (Number(v) || 0), 0));
  const overAllocated = allocated > amountValue;
  const badLine = openDocuments.some((d) => (Number(allocations[d.id]) || 0) > d.balance);
  const isValid = !!partyId && amountValue > 0 && !overAllocated && !badLine;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({
      partyId: Number(partyId),
      paymentDate,
      amount: amountValue,
      mode,
      reference: reference.trim() || undefined,
      notes: notes.trim() || undefined,
      allocations: openDocuments
        .filter((d) => (Number(allocations[d.id]) || 0) > 0)
        .map((d) => ({ documentId: d.id, amount: Number(allocations[d.id]) })),
    });
  }

  return (
    <Modal
      open={open}
      size="lg"
      title={title}
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={!isValid} loading={submitting}>
            Save
          </Button>
        </>
      }
    >
      <Form id={FORM_ID} onSubmit={handleSubmit}>
        <Row>
          <Select
            id="paymentParty"
            label={partyLabel}
            placeholder={`Select ${partyLabel.toLowerCase()}`}
            value={partyId}
            options={parties.map((p) => ({ value: String(p.id), label: p.name }))}
            onChange={(e) => changeParty(e.target.value)}
          />
          <Input id="paymentDate" label="Date" type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
        </Row>
        <Row>
          <Input id="paymentAmount" label="Amount ₹" type="number" min={0} step="0.01" value={amount} onChange={(e) => changeAmount(e.target.value)} />
          <Select id="paymentMode" label="Mode" value={mode} options={PAYMENT_MODE_OPTIONS} onChange={(e) => setMode(e.target.value as PaymentMode)} />
        </Row>
        <Row>
          <Input
            id="paymentReference"
            label="Reference (optional)"
            placeholder="UTR / cheque no."
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
          <Input id="paymentNotes" label="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Row>

        {partyId && loadingDocs && <Empty>Loading open documents…</Empty>}
        {partyId &&
          !loadingDocs &&
          (openDocuments.length === 0 ? (
            <Empty>Nothing outstanding for this party — the whole amount will be kept as an advance.</Empty>
          ) : (
            <>
              <Scroll>
                <Grid>
                  <thead>
                    <tr>
                      <th>Document</th>
                      <th>Date</th>
                      <th>Due</th>
                      <th className="num">Balance</th>
                      <th style={{ width: 150 }}>Apply</th>
                    </tr>
                  </thead>
                  <tbody>
                    {openDocuments.map((doc, index) => {
                      const value = Number(allocations[doc.id]) || 0;
                      return (
                        <tr key={doc.id}>
                          <td>{doc.docNumber}</td>
                          <td>{formatDate(doc.docDate)}</td>
                          <td>{formatDate(doc.dueDate)}</td>
                          <td className="num">{formatMoney(doc.balance)}</td>
                          <td>
                            <Input
                              id={`allocate${index}`}
                              aria-label={`Apply to ${doc.docNumber}`}
                              type="number"
                              min={0}
                              step="0.01"
                              value={allocations[doc.id] ?? ''}
                              error={value > doc.balance ? 'More than balance' : undefined}
                              onChange={(e) => setAllocations((prev) => ({ ...prev, [doc.id]: e.target.value }))}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Grid>
              </Scroll>
              <Summary>
                Applied {formatMoney(allocated)} of {formatMoney(amountValue)}
                {amountValue > allocated && !overAllocated && ` — ${formatMoney(round2(amountValue - allocated))} kept as advance`}
              </Summary>
            </>
          ))}
        {overAllocated && <FormError>You've applied more than the payment amount.</FormError>}
        {error && <FormError>{error}</FormError>}
      </Form>
    </Modal>
  );
}
