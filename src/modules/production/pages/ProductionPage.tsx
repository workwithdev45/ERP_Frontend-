import { BuildOutlined } from '@ant-design/icons';
import { ModulePlaceholder } from '@/components/common/ModulePlaceholder/ModulePlaceholder';

export function ProductionPage() {
  return (
    <ModulePlaceholder
      icon={<BuildOutlined />}
      title="Production"
      description="Bills of materials, work orders, and shop-floor status tracking will live here."
      phase="Phase 2 · Money & Making"
      features={['Bills of materials', 'Work orders', 'Shop-floor status tracking']}
    />
  );
}
