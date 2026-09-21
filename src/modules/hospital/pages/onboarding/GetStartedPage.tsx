import { useNavigate } from 'react-router-dom';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout';
import { OptionRow } from '../../components/onboarding/OptionRow';

export function GetStartedPage() {
  const navigate = useNavigate();

  return (
    <OnboardingLayout
      title="Set up your hospital"
      subtitle="Every hospital gets its own secure portal. Are you setting up a new one, or joining one that already exists?"
      showGlow
      showTrustBadges
    >
      <OptionRow
        icon={<SearchOutlined />}
        iconBg="#0f172a"
        title="Find my hospital's portal"
        description="Join or sign in to an existing hospital portal."
        onClick={() => navigate(ROUTE_PATHS.onboarding.findHospital)}
      />
      <OptionRow
        icon={<PlusOutlined />}
        iconBg="#14b8a6"
        title="Register a new hospital"
        description="Get your hospital set up on MediCore HMS."
        onClick={() => navigate(ROUTE_PATHS.onboarding.register)}
      />
    </OnboardingLayout>
  );
}
