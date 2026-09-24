import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { isAxiosError } from 'axios';
import { ArrowLeftOutlined, MailOutlined, ShopOutlined } from '@ant-design/icons';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common/Input/Input';
import { OnboardingLayout } from '@/modules/onboarding/components/OnboardingLayout';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { authService } from '../services/authService';
import type { ApiErrorResponse } from '../types/auth.types';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: ${({ theme }) => theme.space[5]};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    text-decoration: underline;
  }
`;

const SentIcon = styled.div`
  width: 56px;
  height: 56px;
  margin-bottom: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primaryLight};
  border: 1px solid ${({ theme }) => theme.colors.primaryBorder};
`;

const Heading = styled.h1`
  margin-bottom: ${({ theme }) => theme.space[2]};
  font-size: 26px;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  letter-spacing: -0.02em;
`;

const SentText = styled.p`
  margin-bottom: ${({ theme }) => theme.space[5]};
  font-size: 14px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};

  strong {
    color: ${({ theme }) => theme.colors.textStrong};
    font-weight: 600;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
`;

interface ForgotLocationState {
  email?: string;
}

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locationState = (useLocation().state ?? {}) as ForgotLocationState;

  const [portalId, setPortalId] = useState(searchParams.get('workspace') ?? '');
  const [email, setEmail] = useState(locationState.email ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const loginHref = portalId
    ? `${ROUTE_PATHS.auth.login}?${new URLSearchParams({ workspace: portalId })}`
    : ROUTE_PATHS.auth.login;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.forgotPassword({ email: email.trim(), portalId: portalId.trim() });
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
        <SentIcon aria-hidden="true">
          <MailOutlined />
        </SentIcon>
        <Heading>Check your email</Heading>
        <SentText>
          If <strong>{email}</strong> has an account in the <strong>{portalId}</strong> workspace, we've sent it a link
          to reset your password. The link expires in 30 minutes and can be used once.
        </SentText>
        <Actions>
          <Button fullWidth onClick={() => navigate(loginHref)}>
            Back to sign in
          </Button>
          <Button variant="ghost" fullWidth onClick={() => setSent(false)}>
            Didn't get it? Try again
          </Button>
        </Actions>
      </OnboardingLayout>
    );
  }

  return (
    <OnboardingLayout
      title="Reset your password"
      subtitle="Enter your workspace and the email you sign in with. We'll email you a link to set a new password."
    >
      <Form onSubmit={handleSubmit}>
        <Input
          id="portalId"
          type="text"
          label="Workspace ID"
          placeholder="e.g. acme-traders"
          prefixIcon={<ShopOutlined />}
          value={portalId}
          onChange={(e) => setPortalId(e.target.value)}
          required
        />
        <Input
          id="email"
          type="email"
          label="Email"
          placeholder="you@acmetraders.in"
          prefixIcon={<MailOutlined />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus={!!portalId}
          required
        />
        {error && <ErrorText>{error}</ErrorText>}
        <Button type="submit" fullWidth loading={loading}>
          Send reset link
        </Button>
      </Form>
      <BackLink to={loginHref}>
        <ArrowLeftOutlined /> Back to sign in
      </BackLink>
    </OnboardingLayout>
  );
}
