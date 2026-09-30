import type { ItemType } from '@/modules/inventory/types/inventory.types';

export type PartyType = 'CUSTOMER' | 'VENDOR' | 'BOTH';

export interface Party {
  id: number;
  partyType: PartyType;
  name: string;
  gstin: string | null;
  phone: string | null;
  email: string | null;
  addressLine1: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  paymentTermsDays: number;
  creditLimit: number | null;
  active: boolean;
  /** Unpaid invoices (customers) or bills (vendors). */
  outstanding: number;
}

export interface PartyRequest {
  partyType: PartyType;
  name: string;
  gstin?: string;
  phone?: string;
  email?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  pincode?: string;
  paymentTermsDays?: number;
  creditLimit?: number | null;
  active?: boolean;
}

export type DocType =
  | 'PURCHASE_ORDER'
  | 'GOODS_RECEIPT'
  | 'PURCHASE_BILL'
  | 'DEBIT_NOTE'
  | 'QUOTATION'
  | 'SALES_ORDER'
  | 'DELIVERY_CHALLAN'
  | 'SALES_INVOICE'
  | 'CREDIT_NOTE';

export type DocStatus =
  | 'DRAFT'
  | 'APPROVED'
  | 'PARTIALLY_RECEIVED'
  | 'RECEIVED'
  | 'OPEN'
  | 'CONVERTED'
  | 'CONFIRMED'
  | 'PARTIALLY_DELIVERED'
  | 'DELIVERED'
  | 'POSTED'
  | 'BILLED'
  | 'INVOICED'
  | 'UNPAID'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'CANCELLED';

export interface DocumentSummary {
  id: number;
  docType: DocType;
  docNumber: string;
  status: DocStatus;
  partyId: number;
  partyName: string;
  docDate: string;
  dueDate: string | null;
  warehouseId: number | null;
  warehouseName: string | null;
  sourceDocumentId: number | null;
  sourceDocumentNumber: string | null;
  partyReference: string | null;
  interState: boolean;
  reverseCharge: boolean;
  taxableAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  roundOff: number;
  totalAmount: number;
  settledAmount: number;
  balance: number;
}

export interface DocumentLine {
  id: number;
  lineNo: number;
  productId: number;
  productName: string;
  sku: string | null;
  hsnCode: string | null;
  uom: string | null;
  itemType: ItemType;
  quantity: number;
  fulfilledQuantity: number;
  pendingQuantity: number;
  reservedQuantity: number;
  rate: number;
  discountPercent: number;
  gstRate: number;
  taxableAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  lineTotal: number;
  sourceLineId: number | null;
}

export interface Allocation {
  paymentId: number;
  paymentNumber: string;
  paymentDate: string;
  mode: PaymentMode;
  documentId: number;
  documentNumber: string;
  amount: number;
}

export interface TradeDocument extends DocumentSummary {
  partyGstin: string | null;
  placeOfSupply: string | null;
  notes: string | null;
  createdBy: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  lines: DocumentLine[];
  linkedDocuments: DocumentSummary[];
  payments: Allocation[];
}

export interface DocumentLineRequest {
  productId?: number;
  sourceLineId?: number;
  quantity: number;
  rate?: number;
  discountPercent?: number;
  gstRate?: number;
}

export interface DocumentRequest {
  partyId?: number;
  docDate?: string;
  dueDate?: string;
  warehouseId?: number;
  sourceDocumentId?: number;
  partyReference?: string;
  reverseCharge?: boolean;
  notes?: string;
  lines: DocumentLineRequest[];
}

export type PaymentMode = 'CASH' | 'BANK_TRANSFER' | 'UPI' | 'CHEQUE' | 'CARD';

export interface Payment {
  id: number;
  paymentNumber: string;
  direction: 'RECEIVED' | 'PAID';
  partyId: number;
  partyName: string;
  paymentDate: string;
  amount: number;
  allocatedAmount: number;
  unallocatedAmount: number;
  mode: PaymentMode;
  reference: string | null;
  notes: string | null;
  allocations: Allocation[];
}

export interface PaymentRequest {
  partyId: number;
  paymentDate?: string;
  amount: number;
  mode: PaymentMode;
  reference?: string;
  notes?: string;
  allocations: { documentId: number; amount: number }[];
}

export interface AgeingDocument {
  documentId: number;
  docNumber: string;
  docDate: string;
  dueDate: string;
  totalAmount: number;
  balance: number;
  daysOverdue: number;
  bucket: string;
}

export interface AgeingParty {
  partyId: number;
  partyName: string;
  notDue: number;
  days1To30: number;
  days31To60: number;
  days61To90: number;
  over90: number;
  total: number;
  documents: AgeingDocument[];
}

export interface ReorderSuggestion {
  productId: number;
  productName: string;
  sku: string;
  uom: string | null;
  reorderLevel: number;
  available: number;
  onOrder: number;
  suggestedQuantity: number;
  lastRate: number | null;
  gstRate: number | null;
  lastVendorId: number | null;
  lastVendorName: string | null;
}
