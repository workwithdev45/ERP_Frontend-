import type { ReactNode } from 'react';
import styled from 'styled-components';
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Card } from '@/components/common/Card/Card';
import { BadgeText } from '@/components/common/Badge/Badge';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';

const Panel = styled(Card)`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  overflow: hidden;

  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Intro = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space[4]};
  padding: ${({ theme }) => theme.space[7]};
`;

const IconTile = styled.div`
  width: 52px;
  height: 52px;
  border-radius: ${({ theme }) => theme.radius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primaryLight};
  border: 1px solid ${({ theme }) => theme.colors.primaryBorder};
`;

const Heading = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`;

const Description = styled.p`
  max-width: 44ch;
  font-size: ${({ theme }) => theme.fontSize.md};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Planned = styled.div`
  padding: ${({ theme }) => theme.space[7]};
  background: ${({ theme }) => theme.colors.bgSubtle};
  border-left: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 900px) {
    border-left: none;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const PlannedLabel = styled.div`
  margin-bottom: ${({ theme }) => theme.space[3]};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const FeatureList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
`;

const Feature = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textBody};

  .anticon {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

interface ModulePlaceholderProps {
  icon: ReactNode;
  title: string;
  description: string;
  phase?: string;
  /** Capabilities planned for this module, listed on the right-hand panel. */
  features?: string[];
}

export function ModulePlaceholder({ icon, title, description, phase, features }: ModulePlaceholderProps) {
  return (
    <div>
      <PageHeader title={title} eyebrow="Module" />
      <Panel>
        <Intro>
          <IconTile aria-hidden="true">{icon}</IconTile>
          <Heading>{title} is on the roadmap</Heading>
          <Description>{description}</Description>
          {phase && (
            <BadgeText tone="primary">
              <ClockCircleOutlined /> {phase}
            </BadgeText>
          )}
        </Intro>
        {features && features.length > 0 && (
          <Planned>
            <PlannedLabel>Planned capabilities</PlannedLabel>
            <FeatureList>
              {features.map((feature) => (
                <Feature key={feature}>
                  <CheckCircleOutlined />
                  {feature}
                </Feature>
              ))}
            </FeatureList>
          </Planned>
        )}
      </Panel>
    </div>
  );
}
