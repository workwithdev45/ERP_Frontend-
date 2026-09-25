import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { EyeInvisibleOutlined, EyeOutlined, LockOutlined, MailOutlined, ShopOutlined } from '@ant-design/icons';
import { isAxiosError } from 'axios';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common/Input/Input';
import { useAuth } from '@/context/AuthContext';
import { OnboardingLayout } from '@/modules/onboarding/components/OnboardingLayout';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { detectWorkspaceFromHost } from '@/utils/subdomain';
import { authService } from '../services/authService';
import type { ApiErrorResponse } from '../types/auth.types';

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
  text-align: center;
`;

const WorkspaceBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primaryDarker};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.md};
`;

const ForgotLink = styled(Link)`
  align-self: flex-end;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

interface LoginLocationState {
  workspaceName?: string;
  email?: string;
}

const subdomainWorkspace = detectWorkspaceFromHost();

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const locationState = (useLocation().state ?? {}) as LoginLocationState;
  const workspaceFromLink = searchParams.get('workspace') ?? '';

  const [portalId, setPortalId] = useState(subdomainWorkspace ?? workspaceFromLink);
  const [usernameOrEmail, setUsernameOrEmail] = useState(locationState.email ?? '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authService.login({ usernameOrEmail, password, portalId });
      login(portalId, data.data);
      navigate(ROUTE_PATHS.dashboard);
    } catch (err) {
      if (isAxiosError<ApiErrorResponse>(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Invalid workspace ID, username/email, or password.');
      }
    } finally {
      setLoading(false);
    }
  }

  const workspaceHint =
    workspaceFromLink && portalId === workspaceFromLink && locationState.workspaceName
      ? `Signing in to ${locationState.workspaceName}`
      : undefined;

  return (
    <OnboardingLayout title="Welcome back" subtitle="Sign in to your company workspace.">
      <Form onSubmit={handleSubmit}>
        {subdomainWorkspace ? (
          <WorkspaceBadge>
            <ShopOutlined /> {subdomainWorkspace}
          </WorkspaceBadge>
        ) : (
          <Input
            id="portalId"
            type="text"
            label="Workspace ID"
            placeholder="e.g. acme-traders"
            prefixIcon={<ShopOutlined />}
            value={portalId}
            onChange={(e) => setPortalId(e.target.value)}
            hint={workspaceHint}
            required
          />
        )}
        <Input
          id="usernameOrEmail"
          type="text"
          label="Username or Email"
          placeholder="Enter username or email"
          prefixIcon={<MailOutlined />}
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          required
        />
        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="Password"
          prefixIcon={<LockOutlined />}
          suffixIcon={showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          onSuffixIconClick={() => setShowPassword((prev) => !prev)}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus={!!workspaceFromLink && !!locationState.email}
          required
        />
        {error && <ErrorText>{error}</ErrorText>}
        <Button type="submit" fullWidth loading={loading}>
          Login
        </Button>
        <ForgotLink
          to={
            portalId.trim()
              ? `${ROUTE_PATHS.auth.forgotPassword}?${new URLSearchParams({ workspace: portalId.trim() })}`
              : ROUTE_PATHS.auth.forgotPassword
          }
          state={{ email: usernameOrEmail.includes('@') ? usernameOrEmail.trim() : '' }}
        >
          Forgot Password?
        </ForgotLink>
      </Form>
    </OnboardingLayout>
  );
}
