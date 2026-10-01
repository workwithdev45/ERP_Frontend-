import { apiClient } from '@/api/apiClient';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import type { ApiResponse } from '@/types/api.types';
import type { PagedResponse } from '@/types/pagination.types';
import type {
  AgeingParty,
  DocumentRequest,
  DocumentSummary,
  ListParams,
  Payment,
  PaymentRequest,
  ReorderSuggestion,
  TradeDocument,
} from '@/modules/trade/types/trade.types';

/** Repeats array params (status=A&status=B), which is how Spring binds a list. */
const list = (params?: ListParams) => ({ params, paramsSerializer: { indexes: null } });

const E = API_ENDPOINTS.purchase;

export const purchaseService = {
  getDocument: (id: number) => apiClient.get<ApiResponse<TradeDocument>>(E.document(id)),

  listOrders: (params?: ListParams) => apiClient.get<ApiResponse<PagedResponse<DocumentSummary>>>(E.orders, list(params)),
  createOrder: (payload: DocumentRequest) => apiClient.post<ApiResponse<TradeDocument>>(E.orders, payload),
  approveOrder: (id: number) => apiClient.post<ApiResponse<TradeDocument>>(E.approveOrder(id)),
  cancelOrder: (id: number) => apiClient.post<ApiResponse<TradeDocument>>(E.cancelOrder(id)),

  listReceipts: (params?: ListParams) => apiClient.get<ApiResponse<PagedResponse<DocumentSummary>>>(E.receipts, list(params)),
  createReceipt: (payload: DocumentRequest) => apiClient.post<ApiResponse<TradeDocument>>(E.receipts, payload),

  listBills: (params?: ListParams) => apiClient.get<ApiResponse<PagedResponse<DocumentSummary>>>(E.bills, list(params)),
  createBill: (payload: DocumentRequest) => apiClient.post<ApiResponse<TradeDocument>>(E.bills, payload),

  listDebitNotes: (params?: ListParams) => apiClient.get<ApiResponse<PagedResponse<DocumentSummary>>>(E.debitNotes, list(params)),
  createDebitNote: (payload: DocumentRequest) => apiClient.post<ApiResponse<TradeDocument>>(E.debitNotes, payload),

  listPayments: (params?: ListParams) => apiClient.get<ApiResponse<PagedResponse<Payment>>>(E.payments, list(params)),
  recordPayment: (payload: PaymentRequest) => apiClient.post<ApiResponse<Payment>>(E.payments, payload),

  payablesAgeing: () => apiClient.get<ApiResponse<AgeingParty[]>>(E.payablesAgeing),
  reorderSuggestions: () => apiClient.get<ApiResponse<ReorderSuggestion[]>>(E.reorderSuggestions),
};
