import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { isAxiosError } from 'axios';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common/Input/Input';
import { useAuth } from '@/context/AuthContext';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { isStrongPassword, PASSWORD_POLICY_HINT, passwordStrengthScore } from '@/utils/passwordPolicy';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { useOnboarding } from '../context/OnboardingContext';
import { onboardingService } from '../services/onboardingService';
import type { ApiErrorResponse } from '../types/onboarding.types';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
`;

const StrengthTrack = styled.div`
  height: 4px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.border};
  overflow: hidden;
  margin-top: -${({ theme }) => theme.space[1]};
`;

const StrengthFill = styled.div<{ $pct: number; $tone: 'weak' | 'ok' | 'strong' }>`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${({ theme, $tone }) =>
    $tone === 'weak' ? theme.colors.danger : $tone === 'ok' ? theme.colors.warning : theme.colors.accent};
  transition: width ${({ theme }) => theme.transition.base};
`;

export function SetPasswordPage() {
  const navigate = useNavigate();
  const { adminEmail, portalId, registrationToken, setPortalUrl } = useOnboarding();
  const { login } = useAuth();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!adminEmail || !portalId || !registrationToken) {
      navigate(ROUTE_PATHS.onboarding.register);
    }
  }, [adminEmail, portalId, registrationToken, navigate]);

  const isValid = isStrongPassword(password);
  const strengthScore = passwordStrengthScore(password);
  const strengthTone = strengthScore <= 1 ? 'weak' : strengthScore <= 2 ? 'ok' : 'strong';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setError('');
    setSubmitting(true);
    try {
      const { data } = await onboardingService.setAdminPassword({
        adminEmail,
        portalId,
        registrationToken,
        adminPassword: password,
      });
      setPortalUrl(data.portalUrl ?? '');
      // Sign the new admin straight in (G2) so the success screen's redirect to the
      // dashboard lands on a real session instead of bouncing back to /login.
      if (data.accessToken && data.refreshToken) {
        login(portalId, {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          tokenType: data.tokenType ?? 'Bearer',
          expiresIn: data.expiresIn ?? 0,
          tenantId: data.tenantId ?? portalId,
          tenantName: data.tenantName ?? portalId,
          username: data.username ?? adminEmail,
          email: data.email ?? adminEmail,
          roles: data.roles ?? [],
          permissions: data.permissions ?? [],
        });
      }
      navigate(ROUTE_PATHS.onboarding.success);
    } catch (err) {
      if (isAxiosError<ApiErrorResponse>(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <OnboardingLayout
      title="Secure your admin account"
      subtitle="This password signs in the company's Admin account — the account that manages users, roles, and every module."
    >
      <Form onSubmit={handleSubmit}>
        <Input
          id="adminPassword"
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          suffixIcon={showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          onSuffixIconClick={() => setShowPassword((prev) => !prev)}
          hint={PASSWORD_POLICY_HINT}
          required
        />
        {password.length > 0 && (
          <StrengthTrack>
            <StrengthFill $pct={(strengthScore / 4) * 100} $tone={strengthTone} />
          </StrengthTrack>
        )}
        {error && <ErrorText>{error}</ErrorText>}
        <Button type="submit" fullWidth disabled={!isValid} loading={submitting}>
          Create my company workspace
        </Button>
      </Form>
    </OnboardingLayout>
  );
}
