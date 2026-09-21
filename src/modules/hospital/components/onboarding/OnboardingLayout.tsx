import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Card } from '@/components/common/Card/Card';
import { Logo } from '@/components/common/Logo/Logo';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { OnboardingBackdrop } from './OnboardingBackdrop';

const Page = styled.div`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space[6]} ${({ theme }) => theme.space[4]};
  background: ${({ theme }) => theme.colors.bgPage};
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 460px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoRow = styled.div`
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

const Panel = styled(Card)`
  width: 100%;
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: ${({ theme }) => theme.space[6]};
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.navy};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
  margin-bottom: ${({ theme }) => theme.space[5]};
`;

const TrustRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space[3]};
  margin-top: ${({ theme }) => theme.space[5]};
  padding-top: ${({ theme }) => theme.space[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const TrustDot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.textMuted};
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: ${({ theme }) => theme.space[5]};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

interface OnboardingLayoutProps {
  title?: string;
  subtitle?: ReactNode;
  showTrustBadges?: boolean;
  showGlow?: boolean;
  children: ReactNode;
}

export function OnboardingLayout({ title, subtitle, showTrustBadges, showGlow, children }: OnboardingLayoutProps) {
  return (
    <Page>
      <OnboardingBackdrop showGlow={showGlow} />
      <Content>
        <LogoRow>
          <Logo />
        </LogoRow>
        <Panel>
          {title && <Title>{title}</Title>}
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
          {children}
          {showTrustBadges && (
            <TrustRow>
              <span>🛡 HIPAA &amp; GDPR Compliant</span>
              <TrustDot />
              <span>End-to-End Encrypted</span>
            </TrustRow>
          )}
        </Panel>
        <Footer>
          <span>
            Need help? <FooterLink to="#">Contact support</FooterLink>
          </span>
          <FooterLink to={ROUTE_PATHS.onboarding.getStarted}>Have a hospital portal?</FooterLink>
        </Footer>
      </Content>
    </Page>
  );
}
