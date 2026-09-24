import { SolutionOutlined } from '@ant-design/icons';
import { ModulePlaceholder } from '@/components/common/ModulePlaceholder/ModulePlaceholder';

export function CrmPage() {
  return (
    <ModulePlaceholder
      icon={<SolutionOutlined />}
      title="CRM"
      description="Leads, pipeline stages, and follow-up reminders will live here."
      phase="Phase 3 · Relationships & People"
      features={['Leads', 'Pipeline stages', 'Follow-up reminders']}
    />
  );
}
