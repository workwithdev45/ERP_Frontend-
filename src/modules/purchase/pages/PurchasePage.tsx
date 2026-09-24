import { ShoppingCartOutlined } from '@ant-design/icons';
import { ModulePlaceholder } from '@/components/common/ModulePlaceholder/ModulePlaceholder';

export function PurchasePage() {
  return (
    <ModulePlaceholder
      icon={<ShoppingCartOutlined />}
      title="Purchase"
      description="Vendors, purchase orders, goods receipt, and vendor bills will live here."
      phase="Phase 1 · Core Operations"
      features={['Vendors', 'Purchase orders', 'Goods receipt', 'Vendor bills']}
    />
  );
}
