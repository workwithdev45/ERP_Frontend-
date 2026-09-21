import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { isAxiosError } from 'axios';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common/Input/Input';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout';
import { onboardingService } from '../../services/onboardingService';
import type { ApiErrorResponse } from '../../types/onboarding.types';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

const SuccessText = styled.p`
  color: ${({ theme }) => theme.colors.success};
  font-size: 13px;
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
`;

const BackLink = styled.button`
  margin-top: ${({ theme }) => theme.space[5]};
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  cursor: pointer;
`;

export function FindHospitalPage() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const { data } = await onboardingService.find({ userEmail });
      setMessage(data.message);
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

  return (
    <OnboardingLayout
      title="Find your hospital's portal"
      subtitle="Enter your email and we'll send you the list of hospital portals you have staff access to."
    >
      <Form onSubmit={handleSubmit}>
        <Input
          id="userEmail"
          type="email"
          label="Email"
          placeholder="dr.mehta@sunrisehospital.in"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          required
        />
        {message && <SuccessText>{message}</SuccessText>}
        {error && <ErrorText>{error}</ErrorText>}
        <Button type="submit" fullWidth loading={loading}>
          Send me the list
        </Button>
      </Form>
      <BackLink type="button" onClick={() => navigate(ROUTE_PATHS.onboarding.getStarted)}>
        Back
      </BackLink>
    </OnboardingLayout>
  );
}
