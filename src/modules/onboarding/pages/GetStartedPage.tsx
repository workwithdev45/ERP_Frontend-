import { useNavigate } from 'react-router-dom';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { OptionRow } from '../components/OptionRow';

export function GetStartedPage() {
  const navigate = useNavigate();

  return (
    <OnboardingLayout
      title="Set up your company"
      subtitle="Every company gets its own secure ERP workspace. Are you setting up a new one, or joining one that already exists?"
      showGlow
      showTrustBadges
    >
      <OptionRow
        icon={<SearchOutlined />}
        iconBg="#0B1B34"
        title="Find my company's workspace"
        description="Join or sign in to an existing company workspace."
        onClick={() => navigate(ROUTE_PATHS.onboarding.findCompany)}
      />
      <OptionRow
        icon={<PlusOutlined />}
        iconBg="#1F5AD6"
        title="Register a new company"
        description="Get your company set up on MSME ERP."
        onClick={() => navigate(ROUTE_PATHS.onboarding.register)}
      />
    </OnboardingLayout>
  );
}
