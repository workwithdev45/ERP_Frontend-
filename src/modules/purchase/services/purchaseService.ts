import { apiClient } from '@/api/apiClient';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import type { ApiResponse } from '@/types/api.types';
import type {
  AgeingParty,
  DocumentRequest,
  DocumentSummary,
  Payment,
  PaymentRequest,
  ReorderSuggestion,
  TradeDocument,
} from '@/modules/trade/types/trade.types';

const E = API_ENDPOINTS.purchase;

export const purchaseService = {
  getDocument: (id: number) => apiClient.get<ApiResponse<TradeDocument>>(E.document(id)),

  listOrders: () => apiClient.get<ApiResponse<DocumentSummary[]>>(E.orders),
  createOrder: (payload: DocumentRequest) => apiClient.post<ApiResponse<TradeDocument>>(E.orders, payload),
  approveOrder: (id: number) => apiClient.post<ApiResponse<TradeDocument>>(E.approveOrder(id)),
  cancelOrder: (id: number) => apiClient.post<ApiResponse<TradeDocument>>(E.cancelOrder(id)),

  listReceipts: () => apiClient.get<ApiResponse<DocumentSummary[]>>(E.receipts),
  createReceipt: (payload: DocumentRequest) => apiClient.post<ApiResponse<TradeDocument>>(E.receipts, payload),

  listBills: () => apiClient.get<ApiResponse<DocumentSummary[]>>(E.bills),
  createBill: (payload: DocumentRequest) => apiClient.post<ApiResponse<TradeDocument>>(E.bills, payload),

  listDebitNotes: () => apiClient.get<ApiResponse<DocumentSummary[]>>(E.debitNotes),
  createDebitNote: (payload: DocumentRequest) => apiClient.post<ApiResponse<TradeDocument>>(E.debitNotes, payload),

  listPayments: () => apiClient.get<ApiResponse<Payment[]>>(E.payments),
  recordPayment: (payload: PaymentRequest) => apiClient.post<ApiResponse<Payment>>(E.payments, payload),

  payablesAgeing: () => apiClient.get<ApiResponse<AgeingParty[]>>(E.payablesAgeing),
  reorderSuggestions: () => apiClient.get<ApiResponse<ReorderSuggestion[]>>(E.reorderSuggestions),
};
