import { apiClient } from '@/api/apiClient';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import type { ApiResponse } from '@/types/api.types';
import type {
  InventoryItem,
  Product,
  ProductRequest,
  StockAdjustmentRequest,
  StockMovement,
  StockReservationRequest,
  StockTransferRequest,
  Warehouse,
  WarehouseRequest,
} from '../types/inventory.types';

export const inventoryService = {
  listProducts: () => apiClient.get<ApiResponse<Product[]>>(API_ENDPOINTS.inventory.products),

  getProduct: (id: number) => apiClient.get<ApiResponse<Product>>(API_ENDPOINTS.inventory.productById(id)),

  createProduct: (payload: ProductRequest) =>
    apiClient.post<ApiResponse<Product>>(API_ENDPOINTS.inventory.products, payload),

  updateProduct: (id: number, payload: ProductRequest) =>
    apiClient.put<ApiResponse<Product>>(API_ENDPOINTS.inventory.productById(id), payload),

  getProductStock: (id: number) =>
    apiClient.get<ApiResponse<InventoryItem[]>>(API_ENDPOINTS.inventory.productStock(id)),

  getProductMovements: (id: number) =>
    apiClient.get<ApiResponse<StockMovement[]>>(API_ENDPOINTS.inventory.productMovements(id)),

  listWarehouses: () => apiClient.get<ApiResponse<Warehouse[]>>(API_ENDPOINTS.inventory.warehouses),

  createWarehouse: (payload: WarehouseRequest) =>
    apiClient.post<ApiResponse<Warehouse>>(API_ENDPOINTS.inventory.warehouses, payload),

  updateWarehouse: (id: number, payload: WarehouseRequest) =>
    apiClient.put<ApiResponse<Warehouse>>(API_ENDPOINTS.inventory.warehouseById(id), payload),

  listStock: () => apiClient.get<ApiResponse<InventoryItem[]>>(API_ENDPOINTS.inventory.stock),

  listLowStock: () => apiClient.get<ApiResponse<InventoryItem[]>>(API_ENDPOINTS.inventory.lowStock),

  adjustStock: (payload: StockAdjustmentRequest) =>
    apiClient.post<ApiResponse<InventoryItem>>(API_ENDPOINTS.inventory.adjustStock, payload),

  transferStock: (payload: StockTransferRequest) =>
    apiClient.post<ApiResponse<void>>(API_ENDPOINTS.inventory.transferStock, payload),

  reserveStock: (payload: StockReservationRequest) =>
    apiClient.post<ApiResponse<InventoryItem>>(API_ENDPOINTS.inventory.reserveStock, payload),

  releaseStock: (payload: StockReservationRequest) =>
    apiClient.post<ApiResponse<InventoryItem>>(API_ENDPOINTS.inventory.releaseStock, payload),

  listMovements: () => apiClient.get<ApiResponse<StockMovement[]>>(API_ENDPOINTS.inventory.movements),
};
