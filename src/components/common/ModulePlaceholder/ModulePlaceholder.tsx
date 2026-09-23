import styled from 'styled-components';
import { Card } from '@/components/common/Card/Card';

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
`;

const PanelCard = styled(Card)`
  padding: ${({ theme }) => theme.space[8]};
  max-width: 480px;
  text-align: center;
`;

const IconWrap = styled.div`
  font-size: 40px;
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.navy};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const Description = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

const PhaseBadge = styled.div`
  display: inline-block;
  margin-top: ${({ theme }) => theme.space[4]};
  padding: 4px 12px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.bgSubtle};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  font-weight: 600;
`;

interface ModulePlaceholderProps {
  icon: string;
  title: string;
  description: string;
  phase?: string;
}

export function ModulePlaceholder({ icon, title, description, phase }: ModulePlaceholderProps) {
  return (
    <Wrap>
      <PanelCard>
        <IconWrap>{icon}</IconWrap>
        <Title>{title}</Title>
        <Description>{description}</Description>
        {phase && <PhaseBadge>{phase}</PhaseBadge>}
      </PanelCard>
    </Wrap>
  );
}
