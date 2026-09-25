import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { BankOutlined, MailOutlined, SafetyCertificateOutlined, TeamOutlined, ToolOutlined } from '@ant-design/icons';
import { Card, CardBody, CardHeader, CardSubtitle, CardTitle } from '@/components/common/Card/Card';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { ROUTE_PATHS } from '@/routes/routePaths';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[4]};
  margin-bottom: ${({ theme }) => theme.space[5]};

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const GuideLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  text-decoration: none;
  color: inherit;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
  }

  .anticon {
    font-size: 18px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const GuideText = styled.div`
  flex: 1;
`;

const GuideTitle = styled.div`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textStrong};
`;

const GuideDescription = styled.div`
  margin-top: 2px;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SupportEmail = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  margin-top: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const SUPPORT_EMAIL = 'info@corevibetechnology.com';

const GUIDES = [
  {
    icon: <TeamOutlined />,
    title: 'Invite your team',
    description: 'Add members and assign them a role.',
    to: ROUTE_PATHS.settings.users,
  },
  {
    icon: <SafetyCertificateOutlined />,
    title: 'Set up roles & permissions',
    description: 'Control who can see and do what.',
    to: ROUTE_PATHS.settings.roles,
  },
  {
    icon: <BankOutlined />,
    title: 'Add your company details',
    description: 'GSTIN, address, and financial year — used on invoices.',
    to: ROUTE_PATHS.settings.company,
  },
  {
    icon: <ToolOutlined />,
    title: 'Choose your modules',
    description: 'Switch on only what your business needs.',
    to: ROUTE_PATHS.settings.modules,
  },
];

/** G17: real in-app guides and a working support contact, replacing the "coming soon" placeholder. */
export function HelpPage() {
  return (
    <div>
      <PageHeader eyebrow="Support" title="Help & Support" subtitle="Guides for getting set up, and how to reach us." />

      <Grid>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Getting started guides</CardTitle>
              <CardSubtitle>Quick links to the most common setup tasks</CardSubtitle>
            </div>
          </CardHeader>
          <div>
            {GUIDES.map((guide) => (
              <GuideLink key={guide.title} to={guide.to}>
                {guide.icon}
                <GuideText>
                  <GuideTitle>{guide.title}</GuideTitle>
                  <GuideDescription>{guide.description}</GuideDescription>
                </GuideText>
              </GuideLink>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Contact support</CardTitle>
              <CardSubtitle>We usually reply within one business day</CardSubtitle>
            </div>
          </CardHeader>
          <CardBody>
            <p>Stuck on something, or found a bug? Email us and we'll help you sort it out.</p>
            <SupportEmail href={`mailto:${SUPPORT_EMAIL}`}>
              <MailOutlined /> {SUPPORT_EMAIL}
            </SupportEmail>
          </CardBody>
        </Card>
      </Grid>
    </div>
  );
}
