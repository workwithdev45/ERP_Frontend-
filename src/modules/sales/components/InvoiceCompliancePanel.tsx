import { useCallback, useEffect, useState, type FormEvent } from 'react';
import QRCode from 'qrcode';
import styled from 'styled-components';
import { apiErrorMessage } from '@/api/apiError';
import { BadgeText } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { FormError } from '@/components/common/FormError/FormError';
import { Input } from '@/components/common/Input/Input';
import { Select } from '@/components/common/Select/Select';
import type { TradeDocument } from '@/modules/trade/types/trade.types';
import { complianceService } from '../services/complianceService';
import type { Compliance, EwayBill, PaymentReminder, TransportMode } from '../types/compliance.types';

const Panel = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.space[4]};
`;

const Box = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[4]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.bgSubtle};
  min-width: 0;

  h3 {
    margin: 0;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.space[2]};
    font-size: ${({ theme }) => theme.fontSize.sm};
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.textStrong};
  }
`;

const Muted = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Facts = styled.dl`
  margin: 0;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 4px ${({ theme }) => theme.space[3]};
  font-size: ${({ theme }) => theme.fontSize.sm};

  dt {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  dd {
    margin: 0;
    color: ${({ theme }) => theme.colors.textBody};
    min-width: 0;
    overflow-wrap: anywhere;
  }
`;

const Mono = styled.span`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const QrImage = styled.img`
  width: 132px;
  height: 132px;
  background: #fff;
  padding: 6px;
  border-radius: ${({ theme }) => theme.radius.sm};
`;

const InlineForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
`;

const Row = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[2]};
  flex-wrap: wrap;
`;

const ReminderList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.fontSize.sm};

  li {
    display: flex;
    flex-direction: column;
    gap: 2px;
    color: ${({ theme }) => theme.colors.textBody};
  }
`;

const IRN_CANCEL_REASONS = [
  { value: '1', label: 'Duplicate' },
  { value: '2', label: 'Data entry mistake' },
  { value: '3', label: 'Order cancelled' },
  { value: '4', label: 'Other' },
];

const EWB_CANCEL_REASONS = [
  { value: '1', label: 'Duplicate' },
  { value: '2', label: 'Order cancelled' },
  { value: '3', label: 'Data entry mistake' },
  { value: '4', label: 'Other' },
];

const MODE_OPTIONS: { value: TransportMode; label: string }[] = [
  { value: 'ROAD', label: 'Road' },
  { value: 'RAIL', label: 'Rail' },
  { value: 'AIR', label: 'Air' },
  { value: 'SHIP', label: 'Ship' },
];

const TRIGGER_LABEL: Record<PaymentReminder['triggerType'], string> = {
  MANUAL: 'Sent manually',
  BEFORE_DUE: 'Before due date',
  ON_DUE: 'On due date',
  OVERDUE: 'Overdue',
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function CancelForm({ reasons, onCancel, onSubmit }: { reasons: typeof IRN_CANCEL_REASONS; onCancel: () => void; onSubmit: (reasonCode: number, remark: string) => void }) {
  const [reason, setReason] = useState('2');
  const [remark, setRemark] = useState('');
  function submit(e: FormEvent) {
    e.preventDefault();
    if (remark.trim()) onSubmit(Number(reason), remark.trim());
  }
  return (
    <InlineForm onSubmit={submit}>
      <Select id="cancelReason" label="Reason" value={reason} options={reasons} onChange={(e) => setReason(e.target.value)} />
      <Input id="cancelRemark" label="Remark" value={remark} onChange={(e) => setRemark(e.target.value)} />
      <Row>
        <Button type="submit" variant="danger" disabled={!remark.trim()}>
          Confirm cancellation
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Keep it
        </Button>
      </Row>
    </InlineForm>
  );
}

interface InvoiceCompliancePanelProps {
  invoice: TradeDocument;
  canCreate: boolean;
  canEdit: boolean;
}

/** W13: e-invoice (IRN + QR), e-way bill and WhatsApp payment reminders for one tax invoice. */
export function InvoiceCompliancePanel({ invoice, canCreate, canEdit }: InvoiceCompliancePanelProps) {
  const [compliance, setCompliance] = useState<Compliance | null>(null);
  const [reminders, setReminders] = useState<PaymentReminder[]>([]);
  const [qr, setQr] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [cancelling, setCancelling] = useState<'irn' | number | null>(null);
  const [ewbFormOpen, setEwbFormOpen] = useState(false);
  const [ewb, setEwb] = useState({ transportMode: 'ROAD' as TransportMode, distanceKm: '', vehicleNo: '', transporterName: '', transporterId: '', transportDocNo: '' });

  const load = useCallback(async () => {
    const [c, r] = await Promise.all([complianceService.status(invoice.id), complianceService.invoiceReminders(invoice.id)]);
    setCompliance(c.data.data);
    setReminders(r.data.data);
  }, [invoice.id]);

  useEffect(() => {
    load().catch((err) => setError(apiErrorMessage(err, 'Could not load e-invoice details.')));
  }, [load]);

  useEffect(() => {
    const signed = compliance?.einvoice?.signedQr;
    if (!signed) {
      setQr('');
      return;
    }
    QRCode.toDataURL(signed, { errorCorrectionLevel: 'M', margin: 0, width: 240 }).then(setQr).catch(() => setQr(''));
  }, [compliance?.einvoice?.signedQr]);

  async function act(action: () => Promise<unknown>, success?: string) {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await action();
      await load();
      if (success) setNotice(success);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  function submitEwayBill(e: FormEvent) {
    e.preventDefault();
    act(async () => {
      await complianceService.generateEwayBill(invoice.id, {
        transportMode: ewb.transportMode,
        distanceKm: Number(ewb.distanceKm),
        vehicleNo: ewb.vehicleNo.trim() || undefined,
        transporterName: ewb.transporterName.trim() || undefined,
        transporterId: ewb.transporterId.trim() || undefined,
        transportDocNo: ewb.transportDocNo.trim() || undefined,
      });
      setEwbFormOpen(false);
    }, 'E-way bill generated');
  }

  async function sendReminder() {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const res = await complianceService.sendReminder(invoice.id);
      const reminder = res.data.data;
      if (reminder.status === 'SENT') setNotice(`WhatsApp reminder sent to ${reminder.recipient}`);
      else setError(reminder.error ?? 'Reminder not sent');
      await load();
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  if (!compliance) {
    return error ? <FormError>{error}</FormError> : <Muted>Loading e-invoice details…</Muted>;
  }

  const e = compliance.einvoice;
  const now = Date.now();
  const activeEwb = compliance.ewayBills.find((b) => b.status === 'ACTIVE');
  const unpaid = invoice.status === 'UNPAID' || invoice.status === 'PARTIALLY_PAID';

  function renderEwayBill(bill: EwayBill) {
    return (
      <div key={bill.id}>
        <Facts>
          <dt>EWB no.</dt>
          <dd>
            <Mono>{bill.ewbNo}</Mono> <BadgeText tone={bill.status === 'ACTIVE' ? 'success' : 'neutral'}>{bill.status === 'ACTIVE' ? 'Active' : 'Cancelled'}</BadgeText>
          </dd>
          <dt>Valid until</dt>
          <dd>{formatDateTime(bill.validUntil)}</dd>
          <dt>Transport</dt>
          <dd>
            {bill.transportMode.charAt(0) + bill.transportMode.slice(1).toLowerCase()} · {bill.distanceKm} km
            {bill.vehicleNo && ` · ${bill.vehicleNo}`}
            {bill.transporterName && ` · ${bill.transporterName}`}
          </dd>
          {bill.cancelReason && (
            <>
              <dt>Cancelled</dt>
              <dd>{bill.cancelReason}</dd>
            </>
          )}
        </Facts>
        {bill.status === 'ACTIVE' && canEdit && now < new Date(bill.cancellableUntil).getTime() && cancelling !== bill.id && (
          <div style={{ marginTop: 8 }}>
            <Button variant="secondary" size="sm" disabled={busy} onClick={() => setCancelling(bill.id)}>
              Cancel e-way bill
            </Button>
          </div>
        )}
        {cancelling === bill.id && (
          <CancelForm
            reasons={EWB_CANCEL_REASONS}
            onCancel={() => setCancelling(null)}
            onSubmit={(reasonCode, remark) =>
              act(async () => {
                await complianceService.cancelEwayBill(bill.id, { reasonCode, remark });
                setCancelling(null);
              }, 'E-way bill cancelled')
            }
          />
        )}
      </div>
    );
  }

  return (
    <>
      {error && <FormError>{error}</FormError>}
      {notice && <Muted role="status">{notice}</Muted>}
      <Panel>
        <Box aria-label="E-invoice">
          <h3>
            E-invoice
            {e && <BadgeText tone={e.status === 'GENERATED' ? 'success' : 'neutral'}>{e.status === 'GENERATED' ? 'IRN generated' : 'Cancelled'}</BadgeText>}
            {e && e.provider === 'SANDBOX' && <BadgeText tone="warning">Sandbox</BadgeText>}
          </h3>
          {e ? (
            <>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {qr && e.status === 'GENERATED' && <QrImage src={qr} alt={`Signed QR code for IRN of ${invoice.docNumber}`} />}
                <Facts style={{ flex: '1 1 160px' }}>
                  <dt>IRN</dt>
                  <dd>
                    <Mono>{e.irn}</Mono>
                  </dd>
                  <dt>Ack no.</dt>
                  <dd>
                    <Mono>{e.ackNo}</Mono>
                  </dd>
                  <dt>Ack date</dt>
                  <dd>{formatDateTime(e.ackDate)}</dd>
                  {e.cancelReason && (
                    <>
                      <dt>Cancelled</dt>
                      <dd>{e.cancelReason}</dd>
                    </>
                  )}
                </Facts>
              </div>
              {e.status === 'GENERATED' && canEdit && cancelling !== 'irn' && now < new Date(e.cancellableUntil).getTime() && (
                <div>
                  <Button variant="secondary" size="sm" disabled={busy} onClick={() => setCancelling('irn')}>
                    Cancel IRN
                  </Button>
                  <Muted style={{ marginTop: 4 }}>Allowed until {formatDateTime(e.cancellableUntil)}</Muted>
                </div>
              )}
              {cancelling === 'irn' && (
                <CancelForm
                  reasons={IRN_CANCEL_REASONS}
                  onCancel={() => setCancelling(null)}
                  onSubmit={(reasonCode, remark) =>
                    act(async () => {
                      await complianceService.cancelIrn(invoice.id, { reasonCode, remark });
                      setCancelling(null);
                    }, 'IRN cancelled')
                  }
                />
              )}
            </>
          ) : compliance.einvoiceBlockedReason ? (
            <Muted>{compliance.einvoiceBlockedReason}</Muted>
          ) : (
            <>
              <Muted>Register this invoice with the IRP to get its IRN and signed QR code.</Muted>
              {canCreate && (
                <div>
                  <Button loading={busy} onClick={() => act(() => complianceService.generateIrn(invoice.id), 'IRN generated')}>
                    Generate IRN
                  </Button>
                </div>
              )}
            </>
          )}
        </Box>

        <Box aria-label="E-way bill">
          <h3>
            E-way bill
            {compliance.ewayBillRequired && !activeEwb && <BadgeText tone="warning">Required</BadgeText>}
          </h3>
          {compliance.ewayBills.map(renderEwayBill)}
          {!activeEwb &&
            (compliance.ewayBillBlockedReason ? (
              <Muted>{compliance.ewayBillBlockedReason}</Muted>
            ) : ewbFormOpen ? (
              <InlineForm onSubmit={submitEwayBill}>
                <Row>
                  <div style={{ flex: '1 1 120px' }}>
                    <Select
                      id="ewbMode"
                      label="Mode"
                      value={ewb.transportMode}
                      options={MODE_OPTIONS}
                      onChange={(ev) => setEwb((p) => ({ ...p, transportMode: ev.target.value as TransportMode }))}
                    />
                  </div>
                  <div style={{ flex: '1 1 120px' }}>
                    <Input
                      id="ewbDistance"
                      label="Distance (km)"
                      type="number"
                      min={1}
                      max={4000}
                      value={ewb.distanceKm}
                      onChange={(ev) => setEwb((p) => ({ ...p, distanceKm: ev.target.value }))}
                    />
                  </div>
                </Row>
                {ewb.transportMode === 'ROAD' ? (
                  <Input
                    id="ewbVehicle"
                    label="Vehicle no."
                    placeholder="MH12AB1234"
                    value={ewb.vehicleNo}
                    onChange={(ev) => setEwb((p) => ({ ...p, vehicleNo: ev.target.value.toUpperCase() }))}
                  />
                ) : (
                  <Input
                    id="ewbTransportDoc"
                    label="Transport document no."
                    value={ewb.transportDocNo}
                    onChange={(ev) => setEwb((p) => ({ ...p, transportDocNo: ev.target.value }))}
                  />
                )}
                <Input
                  id="ewbTransporterName"
                  label="Transporter name (optional)"
                  value={ewb.transporterName}
                  onChange={(ev) => setEwb((p) => ({ ...p, transporterName: ev.target.value }))}
                />
                <Input
                  id="ewbTransporterId"
                  label="Transporter ID / GSTIN (optional)"
                  value={ewb.transporterId}
                  onChange={(ev) => setEwb((p) => ({ ...p, transporterId: ev.target.value.toUpperCase() }))}
                />
                <Row>
                  <Button type="submit" loading={busy} disabled={!(Number(ewb.distanceKm) >= 1)}>
                    Generate e-way bill
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => setEwbFormOpen(false)}>
                    Cancel
                  </Button>
                </Row>
              </InlineForm>
            ) : (
              <>
                <Muted>
                  {compliance.ewayBillRequired
                    ? 'Goods worth more than ₹50,000 are moving — an e-way bill is mandatory.'
                    : 'Optional for this invoice — goods value is ₹50,000 or less.'}
                </Muted>
                {canCreate && (
                  <div>
                    <Button variant={compliance.ewayBillRequired ? 'primary' : 'secondary'} onClick={() => setEwbFormOpen(true)}>
                      Generate e-way bill
                    </Button>
                  </div>
                )}
              </>
            ))}
        </Box>

        <Box aria-label="Payment reminders">
          <h3>WhatsApp reminders</h3>
          {unpaid && canCreate ? (
            <div>
              <Button variant="secondary" loading={busy} onClick={sendReminder}>
                Send payment reminder
              </Button>
            </div>
          ) : (
            !unpaid && <Muted>Paid — no reminders needed.</Muted>
          )}
          {reminders.length === 0 ? (
            <Muted>No reminders sent yet.</Muted>
          ) : (
            <ReminderList>
              {reminders.map((r) => (
                <li key={r.id}>
                  <span>
                    <BadgeText tone={r.status === 'SENT' ? 'success' : r.status === 'FAILED' ? 'danger' : 'neutral'}>
                      {r.status === 'SENT' ? 'Sent' : r.status === 'FAILED' ? 'Failed' : 'Skipped'}
                    </BadgeText>{' '}
                    {TRIGGER_LABEL[r.triggerType]} · {formatDateTime(r.sentAt)}
                  </span>
                  <Muted>{r.status === 'SENT' ? `To ${r.recipient}` : r.error}</Muted>
                </li>
              ))}
            </ReminderList>
          )}
        </Box>
      </Panel>
    </>
  );
}
