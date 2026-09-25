import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { isAxiosError } from 'axios';
import { CheckOutlined } from '@ant-design/icons';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common/Input/Input';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { OnboardingLayout } from '../components/OnboardingLayout';
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

const Text = styled.p`
  margin-bottom: ${({ theme }) => theme.space[5]};
  font-size: 14px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const BackLink = styled.button`
  margin-top: ${({ theme }) => theme.space[5]};
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    text-decoration: underline;
  }
`;

/**
 * The backend never confirms or denies whether an email is linked to a workspace (G4) — it
 * always shows this same message and, if there's a match, emails the sign-in link(s) instead.
 */
export function FindCompanyPage() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onboardingService.find({ userEmail });
      setSent(true);
    } catch (err) {
      if (isAxiosError<ApiErrorResponse>(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <OnboardingLayout>
        <DoneIcon aria-hidden="true">
          <CheckOutlined />
        </DoneIcon>
        <Text>
          If <strong>{userEmail}</strong> is linked to a company workspace, we've sent its sign-in link(s) to that
          address.
        </Text>
        <Button fullWidth onClick={() => navigate(ROUTE_PATHS.auth.login)}>
          Back to sign in
        </Button>
      </OnboardingLayout>
    );
  }

  return (
    <OnboardingLayout
      title="Find your company's workspace"
      subtitle="Enter your work email and, if it's linked to a workspace, we'll email you the sign-in link."
    >
      <Form onSubmit={handleSubmit}>
        <Input
          id="userEmail"
          type="email"
          label="Work email"
          placeholder="you@acmetraders.in"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          required
        />
        {error && <ErrorText>{error}</ErrorText>}
        <Button type="submit" fullWidth loading={loading}>
          Continue
        </Button>
      </Form>
      <BackLink type="button" onClick={() => navigate(ROUTE_PATHS.onboarding.getStarted)}>
        Back
      </BackLink>
    </OnboardingLayout>
  );
}
