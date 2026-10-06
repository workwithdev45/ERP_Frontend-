import type { ReactNode } from 'react';
import styled from 'styled-components';

const Screen = styled.main`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space[5]};
  background: ${({ theme }) => theme.colors.bgSubtle};
`;

const Panel = styled.div`
  max-width: 460px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};
  text-align: center;
`;

const Code = styled.div`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Heading = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.display};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textStrong};
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSize.md};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${({ theme }) => theme.space[3]};
  margin-top: ${({ theme }) => theme.space[2]};
`;

interface FeedbackScreenProps {
  code: string;
  title: string;
  description: string;
  actions?: ReactNode;
}

/** Full-page message used outside the app shell (unknown URLs, crashed routes). */
export function FeedbackScreen({ code, title, description, actions }: FeedbackScreenProps) {
  return (
    <Screen>
      <Panel>
        <Code>{code}</Code>
        <Heading>{title}</Heading>
        <Description>{description}</Description>
        {actions && <Actions>{actions}</Actions>}
      </Panel>
    </Screen>
  );
}
