import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { isAxiosError } from 'axios';
import { Button } from '@/components/common/Button/Button';
import { Card } from '@/components/common/Card/Card';
import { Input } from '@/components/common/Input/Input';
import { Logo } from '@/components/common/Logo/Logo';
import { useAuth } from '@/context/AuthContext';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { authService } from '../services/authService';
import type { ApiErrorResponse } from '../types/auth.types';

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space[6]} ${({ theme }) => theme.space[4]};
  background: ${({ theme }) => theme.colors.bgPage};
`;

const Panel = styled(Card)`
  width: 100%;
  max-width: 420px;
  padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[6]};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoRow = styled.div`
  margin-bottom: ${({ theme }) => theme.space[5]};
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.navy};
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

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

const ForgotLink = styled.a`
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

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [portalId, setPortalId] = useState('');
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
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
        setError('Invalid portal ID, username/email, or password.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page>
      <Panel>
        <LogoRow>
          <Logo />
        </LogoRow>
        <Title>Welcome back</Title>
        <Subtitle>Sign in to your company portal</Subtitle>
        <Form onSubmit={handleSubmit}>
          <Input
            id="portalId"
            type="text"
            label="Company Portal ID"
            placeholder="e.g. acme-traders"
            prefixIcon="🏢"
            value={portalId}
            onChange={(e) => setPortalId(e.target.value)}
            required
          />
          <Input
            id="usernameOrEmail"
            type="text"
            label="Username or Email"
            placeholder="Enter username or email"
            prefixIcon="✉"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="Password"
            prefixIcon="🔒"
            suffixIcon={showPassword ? '🙈' : '👁'}
            onSuffixIconClick={() => setShowPassword((prev) => !prev)}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <ErrorText>{error}</ErrorText>}
          <Button type="submit" fullWidth loading={loading}>
            Login
          </Button>
          <ForgotLink>Forgot Password?</ForgotLink>
        </Form>
      </Panel>
    </Page>
  );
}
