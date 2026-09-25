import styled from 'styled-components';
import { Card, CardBody } from '@/components/common/Card/Card';

const Wrap = styled.div`
  max-width: 720px;
  margin: ${({ theme }) => theme.space[8]} auto;
  padding: 0 ${({ theme }) => theme.space[4]};
`;

const Title = styled.h1`
  margin-bottom: ${({ theme }) => theme.space[4]};
  font-size: ${({ theme }) => theme.fontSize.display};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`;

const Notice = styled.p`
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};
  margin-bottom: ${({ theme }) => theme.space[5]};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.warningLight};
  color: ${({ theme }) => theme.colors.warningDark};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const Body = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
`;

interface LegalPageProps {
  title: string;
}

/** G11: placeholder pages linked from the sign-up acceptance checkbox, pending real legal copy. */
export function LegalPage({ title }: LegalPageProps) {
  return (
    <Wrap>
      <Title>{title}</Title>
      <Notice>This page is a placeholder pending final legal copy from MSME ERP.</Notice>
      <Card>
        <CardBody>
          <Body>
            By creating a workspace, you agree to use MSME ERP in accordance with applicable law and
            to keep your account credentials secure. The finalized {title.toLowerCase()} will replace
            this notice before general availability.
          </Body>
        </CardBody>
      </Card>
    </Wrap>
  );
}
