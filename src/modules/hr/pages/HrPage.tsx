import { TeamOutlined } from '@ant-design/icons';
import { ModulePlaceholder } from '@/components/common/ModulePlaceholder/ModulePlaceholder';

export function HrPage() {
  return (
    <ModulePlaceholder
      icon={<TeamOutlined />}
      title="HR & Payroll"
      description="Employee records, attendance, and payroll runs will live here."
      phase="Phase 3 · Relationships & People"
      features={['Employee records', 'Attendance', 'Payroll runs']}
    />
  );
}
