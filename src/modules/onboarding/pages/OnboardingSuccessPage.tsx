import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BadgeText } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { useOnboarding } from '../context/OnboardingContext';

const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.space[2]};
`;

const StatusBadgeRow = styled.div`
  margin-bottom: ${({ theme }) => theme.space[3]};
`;

const CheckCircle = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accentLight};
  color: ${({ theme }) => theme.colors.accentDark};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  margin-bottom: ${({ theme }) => theme.space[3]};
`;

const Heading = styled.h2`
  font-size: 22px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.navy};
`;

const Description = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
  margin-top: ${({ theme }) => theme.space[1]};

  strong {
    color: ${({ theme }) => theme.colors.navy};
  }
`;

const ProgressWrap = styled.div`
  width: 100%;
  margin: ${({ theme }) => theme.space[5]} 0 ${({ theme }) => theme.space[2]};
`;

const Countdown = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accentDark};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const ProgressTrack = styled.div`
  height: 6px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.accentLight};
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${({ theme }) => theme.colors.accent};
  transition: width 1s linear;
`;

const ActionWrap = styled.div`
  width: 100%;
  margin-top: ${({ theme }) => theme.space[4]};
`;

const REDIRECT_SECONDS = 3;

export function OnboardingSuccessPage() {
  const navigate = useNavigate();
  const { portalId, portalUrl, reset } = useOnboarding();
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    if (!portalUrl) {
      navigate(ROUTE_PATHS.onboarding.register);
    }
  }, [portalUrl, navigate]);

  function redirectNow() {
    reset();
    navigate(ROUTE_PATHS.dashboard);
  }

  useEffect(() => {
    if (secondsLeft <= 0) {
      redirectNow();
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const progressPct = ((REDIRECT_SECONDS - secondsLeft) / REDIRECT_SECONDS) * 100;

  return (
    <OnboardingLayout>
      <Center>
        <StatusBadgeRow>
          <BadgeText tone="success">● REDIRECTING</BadgeText>
        </StatusBadgeRow>
        <CheckCircle>✓</CheckCircle>
        <Heading>Your company workspace is live!</Heading>
        <Description>
          Redirecting you to <strong>{portalId}</strong> — Sales, Purchase, Inventory, and every other module are
          ready to go.
        </Description>
        <ProgressWrap>
          <Countdown>Redirecting now…</Countdown>
          <ProgressTrack>
            <ProgressFill $pct={progressPct} />
          </ProgressTrack>
        </ProgressWrap>
        <ActionWrap>
          <Button fullWidth variant="success" onClick={redirectNow}>
            Go to dashboard now
          </Button>
        </ActionWrap>
      </Center>
    </OnboardingLayout>
  );
}
