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
  TradeDocument,
} from '@/modules/trade/types/trade.types';

/** Repeats array params (status=A&status=B), which is how Spring binds a list. */
const list = (params?: ListParams) => ({ params, paramsSerializer: { indexes: null } });

const E = API_ENDPOINTS.sales;

export interface ConvertQuotationRequest {
  warehouseId: number;
  dueDate?: string;
  partyReference?: string;
}

export const salesService = {
  getDocument: (id: number) => apiClient.get<ApiResponse<TradeDocument>>(E.document(id)),

  listQuotations: (params?: ListParams) => apiClient.get<ApiResponse<PagedResponse<DocumentSummary>>>(E.quotations, list(params)),
  createQuotation: (payload: DocumentRequest) => apiClient.post<ApiResponse<TradeDocument>>(E.quotations, payload),
  convertQuotation: (id: number, payload: ConvertQuotationRequest) =>
    apiClient.post<ApiResponse<TradeDocument>>(E.convertQuotation(id), payload),
  cancelQuotation: (id: number) => apiClient.post<ApiResponse<TradeDocument>>(E.cancelQuotation(id)),

  listOrders: (params?: ListParams) => apiClient.get<ApiResponse<PagedResponse<DocumentSummary>>>(E.orders, list(params)),
  createOrder: (payload: DocumentRequest) => apiClient.post<ApiResponse<TradeDocument>>(E.orders, payload),
  cancelOrder: (id: number) => apiClient.post<ApiResponse<TradeDocument>>(E.cancelOrder(id)),

  listDeliveries: (params?: ListParams) => apiClient.get<ApiResponse<PagedResponse<DocumentSummary>>>(E.deliveries, list(params)),
  createDelivery: (payload: DocumentRequest) => apiClient.post<ApiResponse<TradeDocument>>(E.deliveries, payload),

  listInvoices: (params?: ListParams) => apiClient.get<ApiResponse<PagedResponse<DocumentSummary>>>(E.invoices, list(params)),
  createInvoice: (payload: DocumentRequest) => apiClient.post<ApiResponse<TradeDocument>>(E.invoices, payload),

  listCreditNotes: (params?: ListParams) => apiClient.get<ApiResponse<PagedResponse<DocumentSummary>>>(E.creditNotes, list(params)),
  createCreditNote: (payload: DocumentRequest) => apiClient.post<ApiResponse<TradeDocument>>(E.creditNotes, payload),

  listReceipts: (params?: ListParams) => apiClient.get<ApiResponse<PagedResponse<Payment>>>(E.receipts, list(params)),
  recordReceipt: (payload: PaymentRequest) => apiClient.post<ApiResponse<Payment>>(E.receipts, payload),

  receivablesAgeing: () => apiClient.get<ApiResponse<AgeingParty[]>>(E.receivablesAgeing),
};
