import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { isAxiosError } from 'axios';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common/Input/Input';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { OptionRow } from '../components/OptionRow';
import { onboardingService } from '../services/onboardingService';
import type { ApiErrorResponse, WorkspaceSummary } from '../types/onboarding.types';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
`;

const ListLabel = styled.p`
  margin-bottom: ${({ theme }) => theme.space[3]};
  font-size: 13px;
  font-weight: 600;
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

function initial(name: string) {
  return name.trim().charAt(0).toUpperCase() || '#';
}

export function FindCompanyPage() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [workspaces, setWorkspaces] = useState<WorkspaceSummary[]>([]);

  function goToLogin(workspace: WorkspaceSummary) {
    const params = new URLSearchParams({ workspace: workspace.portalId });
    navigate(`${ROUTE_PATHS.auth.login}?${params}`, {
      state: { workspaceName: workspace.name, email: userEmail },
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setWorkspaces([]);
    setLoading(true);
    try {
      const { data } = await onboardingService.find({ userEmail });
      if (!Array.isArray(data.data)) {
        // Server didn't return a workspace list (e.g. an older backend build) — don't claim "not linked".
        setError('Something went wrong. Please try again.');
        return;
      }
      const found = data.data;
      if (found.length === 1) {
        goToLogin(found[0]);
      } else if (found.length > 1) {
        setWorkspaces(found);
      } else {
        setError('This email is not linked to any company workspace.');
      }
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

  if (workspaces.length > 1) {
    return (
      <OnboardingLayout
        title="Choose your workspace"
        subtitle={`${userEmail} has access to ${workspaces.length} workspaces. Pick the one you want to sign in to.`}
      >
        <ListLabel>Your workspaces</ListLabel>
        {workspaces.map((workspace) => (
          <OptionRow
            key={workspace.portalId}
            icon={initial(workspace.name)}
            iconBg="#1F5AD6"
            title={workspace.name}
            description={workspace.portalId}
            onClick={() => goToLogin(workspace)}
          />
        ))}
        <BackLink type="button" onClick={() => setWorkspaces([])}>
          Use a different email
        </BackLink>
      </OnboardingLayout>
    );
  }

  return (
    <OnboardingLayout
      title="Find your company's workspace"
      subtitle="Enter your work email and we'll take you straight to your company's workspace."
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
