export type ItemType = 'STOCK' | 'NON_STOCK' | 'SERVICE';

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string | null;
  category: string | null;
  itemType: ItemType;
  hsnCode: string | null;
  gstRatePercent: number | null;
  barcode: string | null;
  imageUrl: string | null;
  unitOfMeasure: string | null;
  secondaryUnit: string | null;
  conversionFactor: number | null;
  reorderLevel: number;
  active: boolean;
}

export interface ProductRequest {
  sku: string;
  name: string;
  description?: string;
  category?: string;
  itemType: ItemType;
  hsnCode?: string;
  gstRatePercent?: number;
  barcode?: string;
  imageUrl?: string;
  unitOfMeasure?: string;
  secondaryUnit?: string;
  conversionFactor?: number;
  reorderLevel: number;
  active?: boolean;
  openingStockWarehouseId?: number;
  openingStockQuantity?: number;
  openingStockUnitCost?: number;
}

export interface Warehouse {
  id: number;
  name: string;
  code: string;
  location: string | null;
  defaultWarehouse: boolean;
}

export interface WarehouseRequest {
  name: string;
  code: string;
  location?: string;
  defaultWarehouse?: boolean;
}

export interface InventoryItem {
  id: number;
  productId: number;
  productName: string;
  sku: string;
  warehouseId: number;
  warehouseName: string;
  availableQuantity: number;
  reservedQuantity: number;
  availableToPromise: number;
  averageCost: number | null;
  reorderLevel: number;
  lowStock: boolean;
}

export type AdjustmentReason = 'DAMAGE' | 'LOST' | 'FOUND' | 'RECOUNT' | 'EXPIRED' | 'OTHER';

export interface StockAdjustmentRequest {
  productId: number;
  warehouseId: number;
  quantity: number;
  unitCost?: number;
  reasonCode?: AdjustmentReason;
  reason?: string;
}

export interface StockTransferRequest {
  productId: number;
  fromWarehouseId: number;
  toWarehouseId: number;
  quantity: number;
  reason?: string;
}

export interface StockReservationRequest {
  productId: number;
  warehouseId: number;
  quantity: number;
}

export interface StockMovement {
  id: number;
  productId: number;
  productName: string;
  sku: string;
  warehouseId: number;
  warehouseName: string;
  movementType: string;
  quantity: number;
  unitCost: number | null;
  totalValue: number | null;
  reasonCode: string | null;
  referenceType: string | null;
  referenceId: string | null;
  reason: string | null;
  performedAt: string;
}
