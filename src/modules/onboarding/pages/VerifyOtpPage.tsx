import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { isAxiosError } from 'axios';
import { Button } from '@/components/common/Button/Button';
import { APP_CONFIG } from '@/config/app.config';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { OtpInput } from '../components/OtpInput';
import { useOnboarding } from '../context/OnboardingContext';
import { onboardingService } from '../services/onboardingService';
import type { ApiErrorResponse } from '../types/onboarding.types';

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};
  margin-top: ${({ theme }) => theme.space[6]};
`;

const ResendLink = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    color: ${({ theme }) => theme.colors.textMuted};
    cursor: not-allowed;
  }
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
  text-align: center;
`;

export function VerifyOtpPage() {
  const navigate = useNavigate();
  const { adminEmail, setRegistrationToken, setPortal } = useOnboarding();

  const [otp, setOtp] = useState<string[]>(Array(APP_CONFIG.otpLength).fill(''));
  const [invalid, setInvalid] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState<number>(APP_CONFIG.otpResendCooldownSeconds);

  useEffect(() => {
    if (!adminEmail) {
      navigate(ROUTE_PATHS.onboarding.register);
    }
  }, [adminEmail, navigate]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const code = otp.join('');
  const isComplete = code.length === APP_CONFIG.otpLength;

  async function handleConfirm() {
    if (!isComplete) return;
    setError('');
    setInvalid(false);
    setLoading(true);
    try {
      const { data } = await onboardingService.verifyOtp({ adminEmail, otp: code });
      setRegistrationToken(data.registrationToken ?? '');
      if (data.existingPortalId) {
        // This email already reserved a workspace in an earlier, abandoned signup (G1) —
        // send them straight to set a password instead of making them pick a workspace ID again.
        setPortal(data.existingPortalId, false);
        navigate(ROUTE_PATHS.onboarding.setPassword);
      } else {
        navigate(ROUTE_PATHS.onboarding.claimPortal);
      }
    } catch (err) {
      if (isAxiosError<ApiErrorResponse>(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
      setInvalid(true);
      setOtp(Array(APP_CONFIG.otpLength).fill(''));
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError('');
    setResendCooldown(APP_CONFIG.otpResendCooldownSeconds);
    try {
      await onboardingService.register({ adminEmail });
    } catch {
      setError('Could not resend the code. Please try again.');
    }
  }

  return (
    <OnboardingLayout
      title="Check your inbox"
      subtitle={
        <>
          We&apos;ve sent a 4-digit code to <strong>{adminEmail}</strong>. It expires in 10 minutes.
        </>
      }
    >
      <OtpInput length={APP_CONFIG.otpLength} value={otp} onChange={setOtp} invalid={invalid} />
      {error && <ErrorText>{error}</ErrorText>}
      <Actions>
        <Button fullWidth disabled={!isComplete} loading={loading} onClick={handleConfirm}>
          Confirm code
        </Button>
        <ResendLink type="button" disabled={resendCooldown > 0} onClick={handleResend}>
          {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
        </ResendLink>
      </Actions>
    </OnboardingLayout>
  );
}
