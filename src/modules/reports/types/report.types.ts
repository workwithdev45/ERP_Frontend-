export interface MonthlyPoint {
  /** yyyy-MM */
  month: string;
  sales: number;
  purchases: number;
}

export interface Ranked {
  id: number;
  name: string;
  quantity: number | null;
  value: number;
}

export interface DashboardSummary {
  salesThisMonth: number;
  salesLastMonth: number;
  purchasesThisMonth: number;
  purchasesLastMonth: number;
  receivedThisMonth: number;
  paidThisMonth: number;
  receivablesOutstanding: number;
  receivablesOverdue: number;
  overdueInvoices: number;
  payablesOutstanding: number;
  payablesOverdue: number;
  overdueBills: number;
  stockValue: number;
  lowStockItems: number;
  openSalesOrders: number;
  undeliveredOrderValue: number;
  purchaseOrdersAwaitingApproval: number;
  openPurchaseOrders: number;
  trend: MonthlyPoint[];
  topProducts: Ranked[];
  topCustomers: Ranked[];
}

export interface RegisterRow {
  documentId: number | null;
  docType: string | null;
  docNumber: string | null;
  docDate: string | null;
  partyName: string | null;
  partyGstin: string | null;
  placeOfSupply: string | null;
  partyReference: string | null;
  status: string | null;
  reverseCharge: boolean | null;
  taxableAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  roundOff: number;
  totalAmount: number;
}

export interface GstRateSummary {
  gstRate: number;
  taxableAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
}

export interface Register {
  from: string;
  to: string;
  rows: RegisterRow[];
  totals: RegisterRow;
  byGstRate: GstRateSummary[];
}

export interface StockValuationRow {
  productId: number;
  sku: string;
  productName: string;
  category: string | null;
  warehouseName: string;
  uom: string | null;
  quantity: number;
  reserved: number;
  averageCost: number | null;
  value: number;
}

export interface StockValuation {
  rows: StockValuationRow[];
  totalValue: number;
  rowsWithoutCost: number;
}
