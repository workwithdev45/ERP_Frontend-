import { useEffect, useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { apiErrorMessage } from '@/api/apiError';
import { BadgeText } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { FormError } from '@/components/common/FormError/FormError';
import { Input } from '@/components/common/Input/Input';
import { Table, TableScroll, Td, Th } from '@/components/common/Table/Table';
import { complianceService } from '../services/complianceService';
import type { PaymentReminder, ReminderSettings } from '../types/compliance.types';

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[5]};
  padding: ${({ theme }) => theme.space[4]} 0 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
  max-width: 640px;
  padding: 0 ${({ theme }) => theme.space[5]};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: ${({ theme }) => theme.space[4]};
`;

const Check = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.textBody};
  cursor: pointer;
`;

const Note = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Heading = styled.h3`
  margin: 0;
  padding: 0 ${({ theme }) => theme.space[5]};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textStrong};
`;

const Row = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[2]};
  flex-wrap: wrap;
  align-items: center;
`;

const TRIGGER_LABEL: Record<PaymentReminder['triggerType'], string> = {
  MANUAL: 'Manual',
  BEFORE_DUE: 'Before due',
  ON_DUE: 'On due date',
  OVERDUE: 'Overdue',
};

interface RemindersTabProps {
  canEdit: boolean;
  isAdmin: boolean;
}

/** W13 reminder settings: when automatic WhatsApp payment reminders go out, plus what was sent. */
export function RemindersTab({ canEdit, isAdmin }: RemindersTabProps) {
  const [settings, setSettings] = useState<ReminderSettings | null>(null);
  const [log, setLog] = useState<PaymentReminder[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function load() {
    const [s, r] = await Promise.all([complianceService.getSettings(), complianceService.recentReminders()]);
    setSettings(s.data.data);
    setLog(r.data.data);
  }

  useEffect(() => {
    load().catch((err) => setError(apiErrorMessage(err, 'Could not load reminder settings.')));
  }, []);

  function update<K extends keyof ReminderSettings>(key: K, value: ReminderSettings[K]) {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setError('');
    setNotice('');
    try {
      await complianceService.updateSettings(settings);
      setNotice('Reminder settings saved.');
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function runNow() {
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const res = await complianceService.runReminders();
      setNotice(`${res.data.data.attempted} reminder(s) processed for today.`);
      await load();
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (!settings) return error ? <FormError>{error}</FormError> : <Note style={{ padding: 20 }}>Loading…</Note>;

  return (
    <Layout>
      <Form onSubmit={save}>
        <Check>
          <input type="checkbox" checked={settings.enabled} disabled={!canEdit} onChange={(e) => update('enabled', e.target.checked)} />
          Send automatic WhatsApp payment reminders for unpaid invoices
        </Check>
        <Grid>
          <Input
            id="daysBeforeDue"
            label="Days before due date"
            type="number"
            min={0}
            max={30}
            hint="0 = no advance reminder"
            value={String(settings.daysBeforeDue)}
            disabled={!canEdit || !settings.enabled}
            onChange={(e) => update('daysBeforeDue', Number(e.target.value))}
          />
          <Input
            id="overdueEvery"
            label="Repeat when overdue (days)"
            type="number"
            min={0}
            max={60}
            hint="0 = no overdue reminders"
            value={String(settings.overdueEveryDays)}
            disabled={!canEdit || !settings.enabled}
            onChange={(e) => update('overdueEveryDays', Number(e.target.value))}
          />
          <Input
            id="maxOverdue"
            label="Max overdue reminders"
            type="number"
            min={0}
            max={20}
            value={String(settings.maxOverdueReminders)}
            disabled={!canEdit || !settings.enabled}
            onChange={(e) => update('maxOverdueReminders', Number(e.target.value))}
          />
        </Grid>
        <Check>
          <input
            type="checkbox"
            checked={settings.onDueDate}
            disabled={!canEdit || !settings.enabled}
            onChange={(e) => update('onDueDate', e.target.checked)}
          />
          Also remind on the due date
        </Check>
        <Note>
          Reminders go out every morning at 9:00 to the customer's mobile number. Customers without a valid Indian mobile number are skipped.
        </Note>
        {error && <FormError>{error}</FormError>}
        {notice && <Note role="status">{notice}</Note>}
        {canEdit && (
          <Row>
            <Button type="submit" loading={saving}>
              Save settings
            </Button>
            {isAdmin && (
              <Button type="button" variant="secondary" disabled={saving || !settings.enabled} onClick={runNow}>
                Send today's reminders now
              </Button>
            )}
          </Row>
        )}
      </Form>

      <Heading>Recently sent</Heading>
      {log.length === 0 ? (
        <Note style={{ padding: '0 20px 20px' }}>No reminders yet.</Note>
      ) : (
        <TableScroll>
          <Table>
            <thead>
              <tr>
                <Th>When</Th>
                <Th>Invoice</Th>
                <Th>Customer</Th>
                <Th>Trigger</Th>
                <Th>Status</Th>
                <Th>To / reason</Th>
              </tr>
            </thead>
            <tbody>
              {log.map((r) => (
                <tr key={r.id} title={r.message}>
                  <Td $muted>{new Date(r.sentAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</Td>
                  <Td>{r.documentNumber}</Td>
                  <Td>{r.partyName}</Td>
                  <Td $muted>{TRIGGER_LABEL[r.triggerType]}</Td>
                  <Td>
                    <BadgeText tone={r.status === 'SENT' ? 'success' : r.status === 'FAILED' ? 'danger' : 'neutral'}>
                      {r.status === 'SENT' ? 'Sent' : r.status === 'FAILED' ? 'Failed' : 'Skipped'}
                    </BadgeText>
                  </Td>
                  <Td $muted>{r.status === 'SENT' ? r.recipient : r.error}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableScroll>
      )}
    </Layout>
  );
}
