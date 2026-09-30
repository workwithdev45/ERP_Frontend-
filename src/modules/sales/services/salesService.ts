import { apiClient } from '@/api/apiClient';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import type { ApiResponse } from '@/types/api.types';
import type {
  AgeingParty,
  DocumentRequest,
  DocumentSummary,
  Payment,
  PaymentRequest,
  TradeDocument,
} from '@/modules/trade/types/trade.types';

const E = API_ENDPOINTS.sales;

export interface ConvertQuotationRequest {
  warehouseId: number;
  dueDate?: string;
  partyReference?: string;
}

export const salesService = {
  getDocument: (id: number) => apiClient.get<ApiResponse<TradeDocument>>(E.document(id)),

  listQuotations: () => apiClient.get<ApiResponse<DocumentSummary[]>>(E.quotations),
  createQuotation: (payload: DocumentRequest) => apiClient.post<ApiResponse<TradeDocument>>(E.quotations, payload),
  convertQuotation: (id: number, payload: ConvertQuotationRequest) =>
    apiClient.post<ApiResponse<TradeDocument>>(E.convertQuotation(id), payload),
  cancelQuotation: (id: number) => apiClient.post<ApiResponse<TradeDocument>>(E.cancelQuotation(id)),

  listOrders: () => apiClient.get<ApiResponse<DocumentSummary[]>>(E.orders),
  createOrder: (payload: DocumentRequest) => apiClient.post<ApiResponse<TradeDocument>>(E.orders, payload),
  cancelOrder: (id: number) => apiClient.post<ApiResponse<TradeDocument>>(E.cancelOrder(id)),

  listDeliveries: () => apiClient.get<ApiResponse<DocumentSummary[]>>(E.deliveries),
  createDelivery: (payload: DocumentRequest) => apiClient.post<ApiResponse<TradeDocument>>(E.deliveries, payload),

  listInvoices: () => apiClient.get<ApiResponse<DocumentSummary[]>>(E.invoices),
  createInvoice: (payload: DocumentRequest) => apiClient.post<ApiResponse<TradeDocument>>(E.invoices, payload),

  listCreditNotes: () => apiClient.get<ApiResponse<DocumentSummary[]>>(E.creditNotes),
  createCreditNote: (payload: DocumentRequest) => apiClient.post<ApiResponse<TradeDocument>>(E.creditNotes, payload),

  listReceipts: () => apiClient.get<ApiResponse<Payment[]>>(E.receipts),
  recordReceipt: (payload: PaymentRequest) => apiClient.post<ApiResponse<Payment>>(E.receipts, payload),

  receivablesAgeing: () => apiClient.get<ApiResponse<AgeingParty[]>>(E.receivablesAgeing),
};
