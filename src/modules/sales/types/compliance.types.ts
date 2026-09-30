export interface EInvoice {
  id: number;
  provider: string;
  irn: string;
  ackNo: string;
  ackDate: string;
  signedQr: string;
  status: 'GENERATED' | 'CANCELLED';
  cancelReason: string | null;
  cancelledAt: string | null;
  cancellableUntil: string;
}

export type TransportMode = 'ROAD' | 'RAIL' | 'AIR' | 'SHIP';

export interface EwayBill {
  id: number;
  provider: string;
  ewbNo: string;
  ewbDate: string;
  validUntil: string;
  transportMode: TransportMode;
  distanceKm: number;
  vehicleNo: string | null;
  transporterId: string | null;
  transporterName: string | null;
  transportDocNo: string | null;
  status: 'ACTIVE' | 'CANCELLED';
  cancelReason: string | null;
  cancelledAt: string | null;
  cancellableUntil: string;
}

export interface Compliance {
  documentId: number;
  einvoice: EInvoice | null;
  ewayBills: EwayBill[];
  einvoiceBlockedReason: string | null;
  ewayBillBlockedReason: string | null;
  goodsValue: number;
  ewayBillRequired: boolean;
}

export interface CancelRequest {
  reasonCode: number;
  remark: string;
}

export interface EwayBillRequest {
  transportMode: TransportMode;
  distanceKm: number;
  vehicleNo?: string;
  transporterId?: string;
  transporterName?: string;
  transportDocNo?: string;
}

export interface PaymentReminder {
  id: number;
  documentId: number;
  documentNumber: string | null;
  partyName: string | null;
  channel: string;
  recipient: string | null;
  triggerType: 'MANUAL' | 'BEFORE_DUE' | 'ON_DUE' | 'OVERDUE';
  status: 'SENT' | 'FAILED' | 'SKIPPED';
  message: string;
  error: string | null;
  sentAt: string;
}

export interface ReminderSettings {
  enabled: boolean;
  daysBeforeDue: number;
  onDueDate: boolean;
  overdueEveryDays: number;
  maxOverdueReminders: number;
}
