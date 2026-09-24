import { AccountBookOutlined } from '@ant-design/icons';
import { ModulePlaceholder } from '@/components/common/ModulePlaceholder/ModulePlaceholder';

export function AccountsPage() {
  return (
    <ModulePlaceholder
      icon={<AccountBookOutlined />}
      title="Accounts"
      description="Chart of accounts, journal entries, payments, and GST-ready tax handling will live here."
      phase="Phase 2 · Money & Making"
      features={['Chart of accounts', 'Journal entries', 'Payments', 'GST-ready tax handling']}
    />
  );
}
