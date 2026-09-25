import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { isAxiosError } from 'axios';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common/Input/Input';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { useOnboarding } from '../context/OnboardingContext';
import { onboardingService } from '../services/onboardingService';
import type { RegisterCompanyResponse } from '../types/onboarding.types';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

const ErrorBanner = styled.div`
  background: ${({ theme }) => theme.colors.dangerLight};
  color: ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};
  font-size: 13px;
`;

const LoginLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  cursor: pointer;
`;

const TermsRow = styled.label`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space[2]};
  font-size: 13px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
`;

const TermsCheckbox = styled.input`
  margin-top: 3px;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  accent-color: ${({ theme }) => theme.colors.primary};
`;

const TermsLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

export function RegisterCompanyPage() {
  const navigate = useNavigate();
  const { setAdminContact } = useOnboarding();

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingPortalId, setExistingPortalId] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!termsAccepted) return;
    setError('');
    setExistingPortalId('');
    setLoading(true);
    try {
      await onboardingService.register({
        adminEmail,
        adminPhone: adminPhone || undefined,
        termsAccepted,
      });
      setAdminContact(adminEmail, adminPhone);
      navigate(ROUTE_PATHS.onboarding.verifyOtp);
    } catch (err) {
      if (isAxiosError<RegisterCompanyResponse>(err) && err.response?.status === 400) {
        const data = err.response.data;
        setError(data.message);
        if (data.portalId) {
          setExistingPortalId(data.portalId);
        }
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <OnboardingLayout
      title="Tell us about your company"
      subtitle="We'll email a confirmation code to verify this is really you."
    >
      <Form onSubmit={handleSubmit}>
        {error && (
          <ErrorBanner>
            {error}
            {existingPortalId && (
              <>
                {' '}
                <LoginLink onClick={() => navigate(ROUTE_PATHS.auth.login)}>Sign in instead</LoginLink>
              </>
            )}
          </ErrorBanner>
        )}
        <Input
          id="adminEmail"
          type="email"
          label="Administrator email"
          placeholder="admin@acmetraders.in"
          prefixIcon={<MailOutlined />}
          value={adminEmail}
          onChange={(e) => setAdminEmail(e.target.value)}
          required
        />
        <Input
          id="adminPhone"
          type="tel"
          label="Mobile number"
          placeholder="90000 00000"
          prefixBadge={
            <>
              <PhoneOutlined /> +91
            </>
          }
          value={adminPhone}
          onChange={(e) => setAdminPhone(e.target.value)}
        />
        <TermsRow>
          <TermsCheckbox
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />
          <span>
            I agree to the <TermsLink to={ROUTE_PATHS.legal.terms} target="_blank">Terms of Service</TermsLink> and{' '}
            <TermsLink to={ROUTE_PATHS.legal.privacy} target="_blank">Privacy Policy</TermsLink>.
          </span>
        </TermsRow>
        <Button type="submit" fullWidth loading={loading} disabled={!termsAccepted}>
          Send verification code
        </Button>
      </Form>
    </OnboardingLayout>
  );
}
