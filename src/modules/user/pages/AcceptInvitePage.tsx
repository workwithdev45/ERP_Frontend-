import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { isAxiosError } from 'axios';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common/Input/Input';
import { OnboardingLayout } from '@/modules/onboarding/components/OnboardingLayout';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { isStrongPassword, PASSWORD_POLICY_HINT } from '@/utils/passwordPolicy';
import { userService } from '../services/userService';
import type { ApiErrorResponse } from '@/modules/onboarding/types/onboarding.types';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
`;

export function AcceptInvitePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const portalId = searchParams.get('portalId') ?? '';
  const email = searchParams.get('email') ?? '';
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const missingParams = !portalId || !email || !token;
  const isValid = isStrongPassword(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setError('');
    setSubmitting(true);
    try {
      await userService.acceptInvite({ email, inviteToken: token, password }, portalId);
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

  if (missingParams) {
    return (
      <OnboardingLayout title="Invite link is incomplete" subtitle="This invite link is missing required details.">
        <Button fullWidth onClick={() => navigate(ROUTE_PATHS.auth.login)}>
          Go to sign in
        </Button>
      </OnboardingLayout>
    );
  }

  if (done) {
    return (
      <OnboardingLayout title="You're all set!" subtitle="Your account is active — you can sign in now.">
        <Button fullWidth onClick={() => navigate(ROUTE_PATHS.auth.login)}>
          Go to sign in
        </Button>
      </OnboardingLayout>
    );
  }

  return (
    <OnboardingLayout title="Set your password" subtitle={`Create a password for ${email} to join ${portalId}.`}>
      <Form onSubmit={handleSubmit}>
        <Input
          id="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hint={PASSWORD_POLICY_HINT}
          required
        />
        {error && <ErrorText>{error}</ErrorText>}
        <Button type="submit" fullWidth disabled={!isValid} loading={submitting}>
          Activate my account
        </Button>
      </Form>
    </OnboardingLayout>
  );
}
