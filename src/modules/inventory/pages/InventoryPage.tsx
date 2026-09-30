import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { PlusOutlined, SwapOutlined } from '@ant-design/icons';
import { apiErrorMessage } from '@/api/apiError';
import { Button } from '@/components/common/Button/Button';
import { Card } from '@/components/common/Card/Card';
import { FormError } from '@/components/common/FormError/FormError';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { Tabs } from '@/components/common/Tabs/Tabs';
import { MovementLedgerTable } from '../components/MovementLedgerTable';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { ProductFormModal } from '../components/ProductFormModal';
import { ProductListTable } from '../components/ProductListTable';
import { StockAdjustmentModal } from '../components/StockAdjustmentModal';
import { StockSummaryTable } from '../components/StockSummaryTable';
import { StockTransferModal } from '../components/StockTransferModal';
import { WarehouseFormModal } from '../components/WarehouseFormModal';
import { WarehouseListTable } from '../components/WarehouseListTable';
import { inventoryService } from '../services/inventoryService';
import type {
  InventoryItem,
  Product,
  ProductRequest,
  StockAdjustmentRequest,
  StockMovement,
  StockTransferRequest,
  Warehouse,
  WarehouseRequest,
} from '../types/inventory.types';

const Empty = styled.div`
  padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[5]};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const TabPanel = styled.div`
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[5]} ${({ theme }) => theme.space[2]};
`;

type TabKey = 'items' | 'warehouses' | 'stock' | 'ledger';

export function InventoryPage() {
  const [tab, setTab] = useState<TabKey>('items');

  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [stock, setStock] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [warehouseModalOpen, setWarehouseModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  async function loadAll() {
    setLoading(true);
    setLoadError('');
    try {
      const [productsRes, warehousesRes, stockRes, movementsRes] = await Promise.all([
        inventoryService.listProducts(),
        inventoryService.listWarehouses(),
        inventoryService.listStock(),
        inventoryService.listMovements(),
      ]);
      setProducts(productsRes.data.data);
      setWarehouses(warehousesRes.data.data);
      setStock(stockRes.data.data);
      setMovements(movementsRes.data.data);
    } catch (err) {
      setLoadError(apiErrorMessage(err, 'Could not load inventory. Please refresh the page.'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  function openCreateProduct() {
    setEditingProduct(null);
    setFormError('');
    setProductModalOpen(true);
  }

  function openEditProduct(product: Product) {
    setEditingProduct(product);
    setFormError('');
    setProductModalOpen(true);
  }

  async function handleSubmitProduct(payload: ProductRequest) {
    setSubmitting(true);
    setFormError('');
    try {
      if (editingProduct) {
        await inventoryService.updateProduct(editingProduct.id, payload);
      } else {
        await inventoryService.createProduct(payload);
      }
      setProductModalOpen(false);
      await loadAll();
    } catch (err) {
      setFormError(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  function openCreateWarehouse() {
    setEditingWarehouse(null);
    setFormError('');
    setWarehouseModalOpen(true);
  }

  async function handleSubmitWarehouse(payload: WarehouseRequest) {
    setSubmitting(true);
    setFormError('');
    try {
      if (editingWarehouse) {
        await inventoryService.updateWarehouse(editingWarehouse.id, payload);
      } else {
        await inventoryService.createWarehouse(payload);
      }
      setWarehouseModalOpen(false);
      await loadAll();
    } catch (err) {
      setFormError(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAdjustStock(payload: StockAdjustmentRequest) {
    setSubmitting(true);
    setFormError('');
    try {
      await inventoryService.adjustStock(payload);
      setAdjustModalOpen(false);
      await loadAll();
    } catch (err) {
      setFormError(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleTransferStock(payload: StockTransferRequest) {
    setSubmitting(true);
    setFormError('');
    try {
      await inventoryService.transferStock(payload);
      setTransferModalOpen(false);
      await loadAll();
    } catch (err) {
      setFormError(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  function renderTabActions() {
    if (tab === 'items') {
      return (
        <Button leadingIcon={<PlusOutlined />} onClick={openCreateProduct}>
          New item
        </Button>
      );
    }
    if (tab === 'warehouses') {
      return (
        <Button leadingIcon={<PlusOutlined />} onClick={openCreateWarehouse}>
          New warehouse
        </Button>
      );
    }
    if (tab === 'stock') {
      return (
        <>
          <Button variant="secondary" leadingIcon={<SwapOutlined />} onClick={() => setTransferModalOpen(true)}>
            Transfer
          </Button>
          <Button leadingIcon={<PlusOutlined />} onClick={() => setAdjustModalOpen(true)}>
            Adjust stock
          </Button>
        </>
      );
    }
    return null;
  }

  function renderTabContent() {
    if (loading) return <Empty>Loading…</Empty>;
    if (loadError) return <FormError>{loadError}</FormError>;

    if (tab === 'items') {
      return products.length === 0 ? (
        <Empty>No items yet. Add your first item to get started.</Empty>
      ) : (
        <ProductListTable products={products} onEdit={openEditProduct} onOpenDetail={setDetailProduct} />
      );
    }
    if (tab === 'warehouses') {
      return warehouses.length === 0 ? (
        <Empty>No warehouses yet. Add one before recording stock.</Empty>
      ) : (
        <WarehouseListTable
          warehouses={warehouses}
          onEdit={(w) => {
            setEditingWarehouse(w);
            setFormError('');
            setWarehouseModalOpen(true);
          }}
        />
      );
    }
    if (tab === 'stock') {
      return stock.length === 0 ? <Empty>No stock recorded yet.</Empty> : <StockSummaryTable items={stock} />;
    }
    return movements.length === 0 ? <Empty>No stock movements recorded yet.</Empty> : <MovementLedgerTable movements={movements} />;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Inventory"
        subtitle="Items, warehouses, and the stock ledger — the single source of truth for what's on hand."
        actions={renderTabActions()}
      />

      <Card>
        <TabPanel style={{ paddingBottom: 0 }}>
          <Tabs
            activeKey={tab}
            onChange={(key) => setTab(key as TabKey)}
            items={[
              { key: 'items', label: 'Items' },
              { key: 'warehouses', label: 'Warehouses' },
              { key: 'stock', label: 'Stock summary' },
              { key: 'ledger', label: 'Ledger' },
            ]}
          />
        </TabPanel>
        {renderTabContent()}
      </Card>

      <ProductFormModal
        open={productModalOpen}
        product={editingProduct}
        warehouses={warehouses}
        submitting={submitting}
        error={formError}
        onClose={() => setProductModalOpen(false)}
        onSubmit={handleSubmitProduct}
      />

      <WarehouseFormModal
        open={warehouseModalOpen}
        warehouse={editingWarehouse}
        submitting={submitting}
        error={formError}
        onClose={() => setWarehouseModalOpen(false)}
        onSubmit={handleSubmitWarehouse}
      />

      <StockAdjustmentModal
        open={adjustModalOpen}
        products={products}
        warehouses={warehouses}
        submitting={submitting}
        error={formError}
        onClose={() => setAdjustModalOpen(false)}
        onSubmit={handleAdjustStock}
      />

      <StockTransferModal
        open={transferModalOpen}
        products={products}
        warehouses={warehouses}
        submitting={submitting}
        error={formError}
        onClose={() => setTransferModalOpen(false)}
        onSubmit={handleTransferStock}
      />

      {detailProduct && <ProductDetailModal product={detailProduct} onClose={() => setDetailProduct(null)} />}
    </div>
  );
}
