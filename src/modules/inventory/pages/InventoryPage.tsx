import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import styled from 'styled-components';
import { Button } from '@/components/common/Button/Button';
import { Card } from '@/components/common/Card/Card';
import { StockItemDetailModal } from '../components/StockItemDetailModal';
import { StockItemFormModal } from '../components/StockItemFormModal';
import { StockItemListTable } from '../components/StockItemListTable';
import { StockMovementForm } from '../components/StockMovementForm';
import { StockTransferForm } from '../components/StockTransferForm';
import { StockTransferListTable } from '../components/StockTransferListTable';
import { WarehouseDetailModal } from '../components/WarehouseDetailModal';
import { WarehouseFormModal } from '../components/WarehouseFormModal';
import { WarehouseListTable } from '../components/WarehouseListTable';
import { inventoryService } from '../services/inventoryService';
import type {
  RecordMovementRequest,
  StockItemDto,
  StockItemUpsertRequest,
  StockTransferDto,
  StockTransferRequest,
  WarehouseDto,
  WarehouseUpsertRequest,
} from '../types/inventory.types';

type TabKey = 'items' | 'warehouses' | 'transfers';

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.space[5]};
`;

const PageTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.navy};
`;

const PageSubtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const HeadActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[3]};
`;

const Tabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[2]};
  margin-bottom: ${({ theme }) => theme.space[5]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};
  font-size: 14px;
  font-weight: 600;
  background: none;
  border: none;
  border-bottom: 2px solid ${({ theme, $active }) => ($active ? theme.colors.primary : 'transparent')};
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.textSecondary)};
  cursor: pointer;
  font-family: inherit;
`;

const TableCard = styled(Card)`
  padding: ${({ theme }) => theme.space[4]};
`;

export function InventoryPage() {
  const [tab, setTab] = useState<TabKey>('items');

  const [items, setItems] = useState<StockItemDto[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseDto[]>([]);
  const [transfers, setTransfers] = useState<StockTransferDto[]>([]);

  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [warehouseModalOpen, setWarehouseModalOpen] = useState(false);
  const [movementModalOpen, setMovementModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<StockItemDto | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseDto | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function loadItems() {
    const { data } = await inventoryService.listStockItems(0, 100);
    setItems(data.data.content);
  }

  async function loadWarehouses() {
    const { data } = await inventoryService.listWarehouses();
    setWarehouses(data.data);
  }

  async function loadTransfers() {
    const { data } = await inventoryService.listStockTransfers(0, 100);
    setTransfers(data.data.content);
  }

  useEffect(() => {
    loadItems();
    loadWarehouses();
    loadTransfers();
  }, []);

  function extractError(err: unknown) {
    if (isAxiosError<{ message?: string }>(err) && err.response?.data?.message) {
      return err.response.data.message;
    }
    return 'Something went wrong. Please try again.';
  }

  async function handleCreateItem(payload: StockItemUpsertRequest) {
    setError('');
    setSubmitting(true);
    try {
      await inventoryService.createStockItem(payload);
      setItemModalOpen(false);
      await loadItems();
    } catch (err) {
      setError(extractError(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCreateWarehouse(payload: WarehouseUpsertRequest) {
    setError('');
    setSubmitting(true);
    try {
      await inventoryService.createWarehouse(payload);
      setWarehouseModalOpen(false);
      await loadWarehouses();
    } catch (err) {
      setError(extractError(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRecordMovement(payload: RecordMovementRequest) {
    setError('');
    setSubmitting(true);
    try {
      await inventoryService.recordMovement(payload);
      setMovementModalOpen(false);
      await loadItems();
    } catch (err) {
      setError(extractError(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCreateTransfer(payload: StockTransferRequest) {
    setError('');
    setSubmitting(true);
    try {
      await inventoryService.createStockTransfer(payload);
      setTransferModalOpen(false);
      await loadTransfers();
    } catch (err) {
      setError(extractError(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCompleteTransfer(transfer: StockTransferDto) {
    await inventoryService.completeStockTransfer(transfer.id);
    await Promise.all([loadTransfers(), loadItems()]);
  }

  async function handleCancelTransfer(transfer: StockTransferDto) {
    await inventoryService.cancelStockTransfer(transfer.id);
    await loadTransfers();
  }

  function handleItemUpdated(updated: StockItemDto) {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    setSelectedItem(null);
  }

  function handleItemDeleted(deleted: StockItemDto) {
    setItems((prev) => prev.filter((i) => i.id !== deleted.id));
    setSelectedItem(null);
  }

  function handleWarehouseUpdated(updated: WarehouseDto) {
    setWarehouses((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
    setSelectedWarehouse(null);
  }

  function handleWarehouseDeleted(deleted: WarehouseDto) {
    setWarehouses((prev) => prev.filter((w) => w.id !== deleted.id));
    setSelectedWarehouse(null);
  }

  function openModalForTab() {
    setError('');
    if (tab === 'items') setItemModalOpen(true);
    else if (tab === 'warehouses') setWarehouseModalOpen(true);
    else setTransferModalOpen(true);
  }

  const createLabel = tab === 'items' ? '+ Add stock item' : tab === 'warehouses' ? '+ Add warehouse' : '+ New transfer';

  return (
    <div>
      <Head>
        <div>
          <PageTitle>Inventory</PageTitle>
          <PageSubtitle>Stock items, warehouses, movements, and transfers.</PageSubtitle>
        </div>
        <HeadActions>
          {tab === 'items' && (
            <Button variant="secondary" onClick={() => { setError(''); setMovementModalOpen(true); }}>
              Record movement
            </Button>
          )}
          <Button onClick={openModalForTab}>{createLabel}</Button>
        </HeadActions>
      </Head>

      <Tabs>
        <TabButton type="button" $active={tab === 'items'} onClick={() => setTab('items')}>
          Stock Items
        </TabButton>
        <TabButton type="button" $active={tab === 'warehouses'} onClick={() => setTab('warehouses')}>
          Warehouses
        </TabButton>
        <TabButton type="button" $active={tab === 'transfers'} onClick={() => setTab('transfers')}>
          Transfers
        </TabButton>
      </Tabs>

      {tab === 'items' && (
        <TableCard>
          <StockItemListTable items={items} onViewItem={setSelectedItem} />
        </TableCard>
      )}

      {tab === 'warehouses' && (
        <TableCard>
          <WarehouseListTable warehouses={warehouses} onViewWarehouse={setSelectedWarehouse} />
        </TableCard>
      )}

      {tab === 'transfers' && (
        <TableCard>
          <StockTransferListTable
            transfers={transfers}
            onComplete={handleCompleteTransfer}
            onCancel={handleCancelTransfer}
          />
        </TableCard>
      )}

      <StockItemFormModal
        open={itemModalOpen}
        submitting={submitting}
        error={error}
        onClose={() => setItemModalOpen(false)}
        onSubmit={handleCreateItem}
      />

      <WarehouseFormModal
        open={warehouseModalOpen}
        submitting={submitting}
        error={error}
        onClose={() => setWarehouseModalOpen(false)}
        onSubmit={handleCreateWarehouse}
      />

      <StockMovementForm
        open={movementModalOpen}
        items={items}
        warehouses={warehouses}
        submitting={submitting}
        error={error}
        onClose={() => setMovementModalOpen(false)}
        onSubmit={handleRecordMovement}
      />

      <StockTransferForm
        open={transferModalOpen}
        items={items}
        warehouses={warehouses}
        submitting={submitting}
        error={error}
        onClose={() => setTransferModalOpen(false)}
        onSubmit={handleCreateTransfer}
      />

      {selectedItem && (
        <StockItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onUpdated={handleItemUpdated}
          onDeleted={handleItemDeleted}
        />
      )}

      {selectedWarehouse && (
        <WarehouseDetailModal
          warehouse={selectedWarehouse}
          onClose={() => setSelectedWarehouse(null)}
          onUpdated={handleWarehouseUpdated}
          onDeleted={handleWarehouseDeleted}
        />
      )}
    </div>
  );
}
