import { useCallback, useEffect, useState } from 'react';
import { apiErrorMessage } from '@/api/apiError';
import { companyService } from '@/modules/company/services/companyService';
import { inventoryService } from '@/modules/inventory/services/inventoryService';
import type { Product, Warehouse } from '@/modules/inventory/types/inventory.types';
import { partyService } from '../services/partyService';
import type { Party, PartyType } from '../types/trade.types';

/** Parties of one role plus the items, warehouses and company state every trade document form needs. */
export function useTradeMasters(role: Extract<PartyType, 'CUSTOMER' | 'VENDOR'>) {
  const [parties, setParties] = useState<Party[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [companyState, setCompanyState] = useState<string | null>(null);
  const [error, setError] = useState('');

  const reloadParties = useCallback(async () => {
    const res = await partyService.list(role);
    setParties(res.data.data);
  }, [role]);

  const reload = useCallback(async () => {
    setError('');
    try {
      const [partiesRes, productsRes, warehousesRes, companyRes] = await Promise.all([
        partyService.list(role),
        inventoryService.listProducts(),
        inventoryService.listWarehouses(),
        companyService.get(),
      ]);
      setParties(partiesRes.data.data);
      setProducts(productsRes.data.data);
      setWarehouses(warehousesRes.data.data);
      setCompanyState(companyRes.data.data.state ?? null);
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not load customers, vendors or items.'));
    }
  }, [role]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { parties, products, warehouses, companyState, error, reload, reloadParties };
}
