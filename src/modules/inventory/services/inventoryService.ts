import { apiClient } from '@/api/apiClient';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import type { ApiResponse } from '@/types/api.types';
import type { PagedResponse } from '@/types/pagination.types';
import type {
  RecordMovementRequest,
  StockBatchDto,
  StockBatchUpsertRequest,
  StockItemDto,
  StockItemUpsertRequest,
  StockMovementDto,
  StockTransferDto,
  StockTransferRequest,
  WarehouseDto,
  WarehouseUpsertRequest,
} from '../types/inventory.types';

export const inventoryService = {
  listWarehouses: () => apiClient.get<ApiResponse<WarehouseDto[]>>(API_ENDPOINTS.warehouses.list),

  createWarehouse: (payload: WarehouseUpsertRequest) =>
    apiClient.post<ApiResponse<WarehouseDto>>(API_ENDPOINTS.warehouses.list, payload),

  updateWarehouse: (id: number, payload: WarehouseUpsertRequest) =>
    apiClient.put<ApiResponse<WarehouseDto>>(API_ENDPOINTS.warehouses.byId(id), payload),

  deleteWarehouse: (id: number) => apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.warehouses.byId(id)),

  listStockItems: (page = 0, size = 20) =>
    apiClient.get<ApiResponse<PagedResponse<StockItemDto>>>(API_ENDPOINTS.stockItems.list, {
      params: { page, size },
    }),

  getLowStockItems: () => apiClient.get<ApiResponse<StockItemDto[]>>(API_ENDPOINTS.stockItems.lowStock),

  createStockItem: (payload: StockItemUpsertRequest) =>
    apiClient.post<ApiResponse<StockItemDto>>(API_ENDPOINTS.stockItems.list, payload),

  updateStockItem: (id: number, payload: StockItemUpsertRequest) =>
    apiClient.put<ApiResponse<StockItemDto>>(API_ENDPOINTS.stockItems.byId(id), payload),

  deleteStockItem: (id: number) => apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.stockItems.byId(id)),

  listStockBatches: (itemId?: number) =>
    apiClient.get<ApiResponse<StockBatchDto[]>>(API_ENDPOINTS.stockBatches.list, {
      params: itemId ? { itemId } : undefined,
    }),

  getExpiringSoon: (days = 30) =>
    apiClient.get<ApiResponse<StockBatchDto[]>>(API_ENDPOINTS.stockBatches.expiringSoon, { params: { days } }),

  createStockBatch: (payload: StockBatchUpsertRequest) =>
    apiClient.post<ApiResponse<StockBatchDto>>(API_ENDPOINTS.stockBatches.list, payload),

  updateStockBatch: (id: number, payload: StockBatchUpsertRequest) =>
    apiClient.put<ApiResponse<StockBatchDto>>(API_ENDPOINTS.stockBatches.byId(id), payload),

  deleteStockBatch: (id: number) => apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.stockBatches.byId(id)),

  listStockMovements: (itemId?: number, warehouseId?: number, page = 0, size = 20) =>
    apiClient.get<ApiResponse<PagedResponse<StockMovementDto>>>(API_ENDPOINTS.stockMovements.list, {
      params: { itemId, warehouseId, page, size },
    }),

  recordMovement: (payload: RecordMovementRequest) =>
    apiClient.post<ApiResponse<StockMovementDto>>(API_ENDPOINTS.stockMovements.list, payload),

  listStockTransfers: (page = 0, size = 20) =>
    apiClient.get<ApiResponse<PagedResponse<StockTransferDto>>>(API_ENDPOINTS.stockTransfers.list, {
      params: { page, size },
    }),

  createStockTransfer: (payload: StockTransferRequest) =>
    apiClient.post<ApiResponse<StockTransferDto>>(API_ENDPOINTS.stockTransfers.list, payload),

  completeStockTransfer: (id: number) =>
    apiClient.post<ApiResponse<StockTransferDto>>(API_ENDPOINTS.stockTransfers.complete(id)),

  cancelStockTransfer: (id: number) =>
    apiClient.post<ApiResponse<StockTransferDto>>(API_ENDPOINTS.stockTransfers.cancel(id)),
};
