import type { BadgeTone } from '@/components/common/Badge/Badge.types';
import type { DocStatus, DocType, PaymentMode } from '../types/trade.types';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 });

export function formatMoney(value: number | null | undefined): string {
  return value == null ? '—' : money.format(value);
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function todayIso(): string {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export const DOC_LABEL: Record<DocType, string> = {
  PURCHASE_ORDER: 'Purchase order',
  GOODS_RECEIPT: 'Goods receipt',
  PURCHASE_BILL: 'Purchase bill',
  DEBIT_NOTE: 'Debit note',
  QUOTATION: 'Quotation',
  SALES_ORDER: 'Sales order',
  DELIVERY_CHALLAN: 'Delivery challan',
  SALES_INVOICE: 'Tax invoice',
  CREDIT_NOTE: 'Credit note',
};

const STATUS_TONE: Record<DocStatus, BadgeTone> = {
  DRAFT: 'neutral',
  APPROVED: 'info',
  PARTIALLY_RECEIVED: 'warning',
  RECEIVED: 'success',
  OPEN: 'info',
  CONVERTED: 'success',
  CONFIRMED: 'info',
  PARTIALLY_DELIVERED: 'warning',
  DELIVERED: 'success',
  POSTED: 'info',
  BILLED: 'success',
  INVOICED: 'success',
  UNPAID: 'danger',
  PARTIALLY_PAID: 'warning',
  PAID: 'success',
  CANCELLED: 'neutral',
};

export function statusTone(status: DocStatus): BadgeTone {
  return STATUS_TONE[status] ?? 'neutral';
}

export function statusLabel(status: DocStatus): string {
  const text = status.toLowerCase().replace(/_/g, ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export const PAYMENT_MODE_OPTIONS: { value: PaymentMode; label: string }[] = [
  { value: 'BANK_TRANSFER', label: 'Bank transfer (NEFT/RTGS/IMPS)' },
  { value: 'UPI', label: 'UPI' },
  { value: 'CASH', label: 'Cash' },
  { value: 'CHEQUE', label: 'Cheque' },
  { value: 'CARD', label: 'Card' },
];

export function paymentModeLabel(mode: PaymentMode): string {
  return PAYMENT_MODE_OPTIONS.find((o) => o.value === mode)?.label.split(' (')[0] ?? mode;
}

export const GST_RATE_OPTIONS = [0, 5, 12, 18, 28].map((rate) => ({ value: String(rate), label: `${rate}%` }));
