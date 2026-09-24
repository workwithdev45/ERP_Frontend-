import { QuestionCircleOutlined } from '@ant-design/icons';
import { ModulePlaceholder } from '@/components/common/ModulePlaceholder/ModulePlaceholder';

export function HelpPage() {
  return (
    <ModulePlaceholder
      icon={<QuestionCircleOutlined />}
      title="Help & Support"
      description="Documentation and support contact options will live here."
    />
  );
}
