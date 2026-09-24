export type MovementType = 'RECEIPT' | 'ISSUE' | 'ADJUSTMENT' | 'TRANSFER_OUT' | 'TRANSFER_IN';

export type TransferStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

export interface WarehouseDto {
  id: number;
  name: string;
  code: string;
  location: string | null;
  active: boolean;
}

export interface WarehouseUpsertRequest {
  name: string;
  code: string;
  location?: string;
  active?: boolean;
}

export interface StockItemDto {
  id: number;
  sku: string;
  name: string;
  category: string | null;
  uom: string;
  reorderThreshold: number;
  active: boolean;
  currentStock: number;
  lowStock: boolean;
}

export interface StockItemUpsertRequest {
  sku: string;
  name: string;
  category?: string;
  uom: string;
  reorderThreshold: number;
  active?: boolean;
}

export interface StockBatchDto {
  id: number;
  stockItemId: number;
  stockItemName: string;
  batchNumber: string;
  expiryDate: string | null;
  manufacturedDate: string | null;
}

export interface StockBatchUpsertRequest {
  stockItemId: number;
  batchNumber: string;
  expiryDate?: string;
  manufacturedDate?: string;
}

export interface StockMovementDto {
  id: number;
  stockItemId: number;
  stockItemName: string;
  stockBatchId: number | null;
  batchNumber: string | null;
  warehouseId: number;
  warehouseName: string;
  quantity: number;
  movementType: MovementType;
  referenceNote: string | null;
  createdAt: string;
}

export interface RecordMovementRequest {
  stockItemId: number;
  stockBatchId?: number;
  warehouseId: number;
  quantity: number;
  movementType: MovementType;
  referenceNote?: string;
}

export interface StockTransferDto {
  id: number;
  sourceWarehouseId: number;
  sourceWarehouseName: string;
  destinationWarehouseId: number;
  destinationWarehouseName: string;
  stockItemId: number;
  stockItemName: string;
  stockBatchId: number | null;
  batchNumber: string | null;
  quantity: number;
  status: TransferStatus;
  createdAt: string;
}

export interface StockTransferRequest {
  sourceWarehouseId: number;
  destinationWarehouseId: number;
  stockItemId: number;
  stockBatchId?: number;
  quantity: number;
}
