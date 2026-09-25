import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CheckCircleOutlined, CheckOutlined } from '@ant-design/icons';
import { isAxiosError } from 'axios';
import { BadgeText } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common/Input/Input';
import { Select } from '@/components/common/Select/Select';
import { APP_CONFIG } from '@/config/app.config';
import { useDebounce } from '@/hooks/useDebounce';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { useOnboarding } from '../context/OnboardingContext';
import { onboardingService } from '../services/onboardingService';
import type { ApiErrorResponse } from '../types/onboarding.types';

const PORTAL_ID_PATTERN = /^[a-z0-9-]{3,}$/;

const BUSINESS_TYPE_OPTIONS = [
  { value: 'TRADER', label: 'Trader — I buy and sell goods' },
  { value: 'MANUFACTURER', label: 'Manufacturer — I produce goods' },
  { value: 'SERVICES', label: 'Services — I don’t hold physical stock' },
];

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
`;

const Muted = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
`;

const AvailabilityHint = styled.p<{ $tone: 'ok' | 'bad' | 'neutral' }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${({ theme, $tone }) =>
    $tone === 'ok' ? theme.colors.success : $tone === 'bad' ? theme.colors.danger : theme.colors.textMuted};
`;

export function ClaimPortalPage() {
  const navigate = useNavigate();
  const { adminEmail, registrationToken, setPortal } = useOnboarding();

  const [portalId, setPortalId] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [startBlank, setStartBlank] = useState(false);
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const debouncedPortalId = useDebounce(portalId, 400);

  useEffect(() => {
    if (!adminEmail || !registrationToken) {
      navigate(ROUTE_PATHS.onboarding.register);
    }
  }, [adminEmail, registrationToken, navigate]);

  useEffect(() => {
    if (!PORTAL_ID_PATTERN.test(debouncedPortalId)) {
      setAvailable(null);
      return;
    }
    let cancelled = false;
    setChecking(true);
    onboardingService
      .checkPortalId(debouncedPortalId)
      .then(({ data }) => {
        if (!cancelled) setAvailable(data.available);
      })
      .catch(() => {
        if (!cancelled) setAvailable(null);
      })
      .finally(() => {
        if (!cancelled) setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedPortalId]);

  const isValidFormat = PORTAL_ID_PATTERN.test(portalId);
  const canSubmit = isValidFormat && available === true && !!businessType && !submitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError('');
    setSubmitting(true);
    try {
      await onboardingService.reservePortal({
        adminEmail,
        registrationToken,
        portalId,
        startBlank,
        businessType,
      });
      setPortal(portalId, startBlank);
      navigate(ROUTE_PATHS.onboarding.setPassword);
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

  let hint: { text: string; tone: 'ok' | 'bad' | 'neutral' } | null = null;
  if (portalId.length > 0 && !isValidFormat) {
    hint = { text: 'Lowercase letters, digits and hyphens only, at least 3 characters.', tone: 'bad' };
  } else if (checking) {
    hint = { text: 'Checking availability…', tone: 'neutral' };
  } else if (available === true) {
    hint = { text: `Your workspace will be live at ${portalId}.${APP_CONFIG.portalDomain}`, tone: 'ok' };
  } else if (available === false) {
    hint = { text: 'That workspace ID is already taken.', tone: 'bad' };
  }

  return (
    <OnboardingLayout
      title="Claim your company's workspace"
      subtitle="Choose a unique ID for your company's ERP workspace."
    >
      <Form onSubmit={handleSubmit}>
        <Input
          id="portalId"
          label="Workspace ID"
          placeholder="acme-traders"
          suffix={`.${APP_CONFIG.portalDomain}`}
          suffixBadge={
            available === true ? (
              <BadgeText tone="success">
                <CheckOutlined /> Available
              </BadgeText>
            ) : available === false ? (
              <BadgeText tone="danger">Taken</BadgeText>
            ) : undefined
          }
          value={portalId}
          onChange={(e) => setPortalId(e.target.value.toLowerCase())}
          required
        />
        {hint && (
          <AvailabilityHint $tone={hint.tone}>
            {hint.tone === 'ok' && <CheckCircleOutlined />}
            {hint.text}
          </AvailabilityHint>
        )}
        <Select
          id="businessType"
          label="What does your business do?"
          placeholder="Select business type"
          options={BUSINESS_TYPE_OPTIONS}
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
          hint="We'll switch on the modules that fit — you can change any of them later."
          required
        />
        <CheckboxRow>
          <input
            type="checkbox"
            checked={startBlank}
            onChange={(e) => setStartBlank(e.target.checked)}
          />
          Start with a blank setup <Muted>(skip demo data)</Muted>
        </CheckboxRow>
        {error && <AvailabilityHint $tone="bad">{error}</AvailabilityHint>}
        <Button type="submit" fullWidth disabled={!canSubmit} loading={submitting}>
          Reserve this workspace
        </Button>
      </Form>
    </OnboardingLayout>
  );
}
