import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { apiErrorMessage } from '@/api/apiError';
import { FormError } from '@/components/common/FormError/FormError';
import { Modal } from '@/components/common/Modal/Modal';
import { Tabs } from '@/components/common/Tabs/Tabs';
import { MovementLedgerTable } from './MovementLedgerTable';
import { StockSummaryTable } from './StockSummaryTable';
import { inventoryService } from '../services/inventoryService';
import type { InventoryItem, Product, StockMovement } from '../types/inventory.types';

const Empty = styled.p`
  padding: ${({ theme }) => theme.space[5]};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const TabPanel = styled.div`
  margin-top: ${({ theme }) => theme.space[4]};
`;

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

/** W7: item detail — stock-by-warehouse breakdown plus that item's movement history. */
export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const [tab, setTab] = useState<'stock' | 'movements'>('stock');
  const [stock, setStock] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([inventoryService.getProductStock(product.id), inventoryService.getProductMovements(product.id)])
      .then(([stockRes, movementsRes]) => {
        setStock(stockRes.data.data);
        setMovements(movementsRes.data.data);
      })
      .catch((err) => setError(apiErrorMessage(err, 'Could not load stock details.')))
      .finally(() => setLoading(false));
  }, [product.id]);

  return (
    <Modal open title={product.name} onClose={onClose}>
      <Tabs
        activeKey={tab}
        onChange={(key) => setTab(key as 'stock' | 'movements')}
        items={[
          { key: 'stock', label: 'Stock by warehouse' },
          { key: 'movements', label: 'Movement history' },
        ]}
      />
      <TabPanel>
        {loading ? (
          <Empty>Loading…</Empty>
        ) : error ? (
          <FormError>{error}</FormError>
        ) : tab === 'stock' ? (
          stock.length === 0 ? (
            <Empty>No stock recorded for this item yet.</Empty>
          ) : (
            <StockSummaryTable items={stock} />
          )
        ) : movements.length === 0 ? (
          <Empty>No movements recorded for this item yet.</Empty>
        ) : (
          <MovementLedgerTable movements={movements} />
        )}
      </TabPanel>
    </Modal>
  );
}
