import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { isAxiosError } from 'axios';
import { CheckOutlined, EyeInvisibleOutlined, EyeOutlined, LockOutlined } from '@ant-design/icons';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common/Input/Input';
import { OnboardingLayout } from '@/modules/onboarding/components/OnboardingLayout';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { isStrongPassword, PASSWORD_POLICY_HINT } from '@/utils/passwordPolicy';
import { authService } from '../services/authService';
import type { ApiErrorResponse } from '../types/auth.types';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

const ErrorBox = styled.div`
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.dangerLight};
  color: ${({ theme }) => theme.colors.dangerDark};
  font-size: 13px;
  line-height: 1.5;

  a {
    color: inherit;
    font-weight: 600;
  }
`;

const DoneIcon = styled.div`
  width: 56px;
  height: 56px;
  margin-bottom: ${({ theme }) => theme.space[4]};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: ${({ theme }) => theme.colors.successDark};
  background: ${({ theme }) => theme.colors.successLight};
`;

const Heading = styled.h1`
  margin-bottom: ${({ theme }) => theme.space[2]};
  font-size: 26px;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  letter-spacing: -0.02em;
`;

const Text = styled.p`
  margin-bottom: ${({ theme }) => theme.space[5]};
  font-size: 14px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const portalId = searchParams.get('workspace') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const workspaceQuery = portalId ? `?${new URLSearchParams({ workspace: portalId })}` : '';
  const loginHref = `${ROUTE_PATHS.auth.login}${workspaceQuery}`;
  const forgotHref = `${ROUTE_PATHS.auth.forgotPassword}${workspaceQuery}`;

  const meetsRules = isStrongPassword(password);
  const matches = confirm.length > 0 && confirm === password;
  const canSubmit = meetsRules && matches;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError('');
    setSubmitting(true);
    try {
      await authService.resetPassword({ token, newPassword: password }, portalId);
      setDone(true);
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

  if (!token) {
    return (
      <OnboardingLayout title="Reset link is incomplete" subtitle="This link is missing its reset code. Request a new one.">
        <Button fullWidth onClick={() => navigate(forgotHref)}>
          Request a new link
        </Button>
      </OnboardingLayout>
    );
  }

  if (done) {
    return (
      <OnboardingLayout>
        <DoneIcon aria-hidden="true">
          <CheckOutlined />
        </DoneIcon>
        <Heading>Password updated</Heading>
        <Text>Your password has been changed. Sign in with your new password.</Text>
        <Button fullWidth onClick={() => navigate(loginHref)}>
          Go to sign in
        </Button>
      </OnboardingLayout>
    );
  }

  const eyeIcon = showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />;

  return (
    <OnboardingLayout title="Set a new password" subtitle="Choose a new password for your account.">
      <Form onSubmit={handleSubmit}>
        {error && (
          <ErrorBox role="alert">
            {error} <Link to={forgotHref}>Request a new link</Link>
          </ErrorBox>
        )}
        <Input
          id="newPassword"
          type={showPassword ? 'text' : 'password'}
          label="New password"
          placeholder="••••••••"
          prefixIcon={<LockOutlined />}
          suffixIcon={eyeIcon}
          onSuffixIconClick={() => setShowPassword((prev) => !prev)}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hint={PASSWORD_POLICY_HINT}
          autoFocus
          required
        />
        <Input
          id="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          label="Confirm new password"
          placeholder="••••••••"
          prefixIcon={<LockOutlined />}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={confirm.length > 0 && !matches ? "Passwords don't match." : undefined}
          required
        />
        <Button type="submit" fullWidth disabled={!canSubmit} loading={submitting}>
          Update password
        </Button>
      </Form>
    </OnboardingLayout>
  );
}
