import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { isAxiosError } from 'axios';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common/Input/Input';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout';
import { useOnboarding } from '../../context/OnboardingContext';
import { onboardingService } from '../../services/onboardingService';
import type { RegisterHospitalResponse } from '../../types/onboarding.types';

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

export function RegisterHospitalPage() {
  const navigate = useNavigate();
  const { setAdminContact } = useOnboarding();

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingPortalId, setExistingPortalId] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setExistingPortalId('');
    setLoading(true);
    try {
      await onboardingService.register({
        adminEmail,
        adminPhone: adminPhone || undefined,
      });
      setAdminContact(adminEmail, adminPhone);
      navigate(ROUTE_PATHS.onboarding.verifyOtp);
    } catch (err) {
      if (isAxiosError<RegisterHospitalResponse>(err) && err.response?.status === 400) {
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
      title="Tell us about your hospital"
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
          placeholder="admin@sunrisehospital.in"
          prefixIcon="✉"
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
              <span>🇮🇳</span> +91
            </>
          }
          value={adminPhone}
          onChange={(e) => setAdminPhone(e.target.value)}
        />
        <Button type="submit" fullWidth loading={loading}>
          Send verification code
        </Button>
      </Form>
    </OnboardingLayout>
  );
}
