import { InboxOutlined } from '@ant-design/icons';
import { ModulePlaceholder } from '@/components/common/ModulePlaceholder/ModulePlaceholder';

export function InventoryPage() {
  return (
    <ModulePlaceholder
      icon={<InboxOutlined />}
      title="Inventory"
      description="Stock items, warehouses, stock movements, and low-stock alerts will live here."
      phase="Phase 1 · Core Operations"
      features={['Stock items', 'Warehouses', 'Stock movements', 'Low-stock alerts']}
    />
  );
}
