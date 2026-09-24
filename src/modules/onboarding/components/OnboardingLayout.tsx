import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { Card } from '@/components/common/Card/Card';
import { Logo } from '@/components/common/Logo/Logo';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { ThemeToggle } from '@/components/common/ThemeToggle/ThemeToggle';
import { OnboardingBackdrop } from './OnboardingBackdrop';

const Page = styled.div`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[4]};
  background:
    radial-gradient(1200px 600px at 50% -10%, ${({ theme }) => theme.colors.decorGlow}, transparent 60%),
    radial-gradient(800px 500px at 100% 100%, ${({ theme }) => theme.colors.decorGlowAlt}, transparent 60%),
    ${({ theme }) => theme.colors.bgPage};
`;

const CornerToggle = styled(ThemeToggle)`
  position: absolute;
  top: ${({ theme }) => theme.space[4]};
  right: ${({ theme }) => theme.space[4]};
  z-index: 2;
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoRow = styled.div`
  margin-bottom: ${({ theme }) => theme.space[5]};
`;

const Panel = styled(Card)`
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.xl};
  border-color: ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.space[7]} ${({ theme }) => theme.space[6]} ${({ theme }) => theme.space[6]};
  box-shadow:
    0 1px 2px rgba(16, 24, 40, 0.04),
    0 24px 48px -12px rgba(11, 27, 52, 0.14);

  /* Brand accent strip along the top edge */
  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 4px;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.primaryFill} 0%, ${({ theme }) => theme.palette.cobalt500} 55%, ${({ theme }) => theme.colors.accent} 100%);
  }

  @media (max-width: 520px) {
    padding: ${({ theme }) => theme.space[6]} ${({ theme }) => theme.space[5]} ${({ theme }) => theme.space[5]};
  }
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.textStrong};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

const TrustRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space[3]};
  margin-top: ${({ theme }) => theme.space[6]};
  padding-top: ${({ theme }) => theme.space[5]};
  border-top: 1px dashed ${({ theme }) => theme.colors.borderStrong};
  font-size: 12px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  letter-spacing: 0.01em;
  color: ${({ theme }) => theme.colors.textSecondary};

  > span:not(:empty) {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .anticon {
    color: ${({ theme }) => theme.colors.success};
  }
`;

const TrustDot = styled.span`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.borderStrong};
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: ${({ theme }) => theme.space[5]};
  padding: 0 ${({ theme }) => theme.space[1]};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
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
      <CornerToggle />
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
              <span>
                <SafetyCertificateOutlined /> Bank-Grade Security
              </span>
              <TrustDot />
              <span>
                <LockOutlined /> End-to-End Encrypted
              </span>
            </TrustRow>
          )}
        </Panel>
        <Footer>
          <span>
            Need help? <FooterLink to="#">Contact support</FooterLink>
          </span>
          <FooterLink to={ROUTE_PATHS.onboarding.getStarted}>Have a company workspace?</FooterLink>
        </Footer>
      </Content>
    </Page>
  );
}
