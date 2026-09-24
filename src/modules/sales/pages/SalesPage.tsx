import { RiseOutlined } from '@ant-design/icons';
import { ModulePlaceholder } from '@/components/common/ModulePlaceholder/ModulePlaceholder';

export function SalesPage() {
  return (
    <ModulePlaceholder
      icon={<RiseOutlined />}
      title="Sales"
      description="Quotes, sales orders, invoices, and your customer ledger will live here."
      phase="Phase 1 · Core Operations"
      features={['Quotes', 'Sales orders', 'Invoices', 'Customer ledger']}
    />
  );
}
