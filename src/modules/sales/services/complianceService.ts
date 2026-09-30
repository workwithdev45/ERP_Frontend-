import { apiClient } from '@/api/apiClient';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import type { ApiResponse } from '@/types/api.types';
import type {
  CancelRequest,
  Compliance,
  EwayBillRequest,
  PaymentReminder,
  ReminderSettings,
} from '../types/compliance.types';

const E = API_ENDPOINTS.sales;

/** W13: e-invoice, e-way bill and WhatsApp payment reminders for sales invoices. */
export const complianceService = {
  status: (invoiceId: number) => apiClient.get<ApiResponse<Compliance>>(E.compliance(invoiceId)),
  generateIrn: (invoiceId: number) => apiClient.post<ApiResponse<Compliance>>(E.einvoice(invoiceId)),
  cancelIrn: (invoiceId: number, payload: CancelRequest) => apiClient.post<ApiResponse<Compliance>>(E.cancelEinvoice(invoiceId), payload),
  generateEwayBill: (invoiceId: number, payload: EwayBillRequest) => apiClient.post<ApiResponse<Compliance>>(E.ewayBills(invoiceId), payload),
  cancelEwayBill: (ewayBillId: number, payload: CancelRequest) => apiClient.post<ApiResponse<Compliance>>(E.cancelEwayBill(ewayBillId), payload),

  invoiceReminders: (invoiceId: number) => apiClient.get<ApiResponse<PaymentReminder[]>>(E.invoiceReminders(invoiceId)),
  sendReminder: (invoiceId: number) => apiClient.post<ApiResponse<PaymentReminder>>(E.invoiceReminders(invoiceId)),
  recentReminders: () => apiClient.get<ApiResponse<PaymentReminder[]>>(E.reminders),
  runReminders: () => apiClient.post<ApiResponse<{ attempted: number }>>(E.runReminders),
  getSettings: () => apiClient.get<ApiResponse<ReminderSettings>>(E.reminderSettings),
  updateSettings: (payload: ReminderSettings) => apiClient.put<ApiResponse<ReminderSettings>>(E.reminderSettings, payload),
};
