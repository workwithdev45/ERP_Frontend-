import { useCallback, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '@/context/AuthContext';
import { useIdleLogout } from '@/hooks/useIdleLogout';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { authStorage } from '@/utils/authStorage';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

const Shell = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bgPage};
`;

const Main = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

const Content = styled.main`
  flex: 1;
  width: 100%;
  max-width: ${({ theme }) => theme.layout.contentMaxWidth};
  margin: 0 auto;
  padding: ${({ theme }) => theme.space[6]};

  @media (max-width: 900px) {
    padding: ${({ theme }) => theme.space[4]};
  }
`;

export function MainLayout() {
  const session = authStorage.getSession();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleIdle = useCallback(() => {
    logout();
    navigate(ROUTE_PATHS.auth.login, { replace: true });
  }, [logout, navigate]);

  useIdleLogout(handleIdle);

  return (
    <Shell>
      <Sidebar
        companyName={session?.tenantName}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />
      <Main>
        <Header onMenuClick={() => setMobileNavOpen(true)} />
        <Content>
          <Outlet />
        </Content>
      </Main>
    </Shell>
  );
}
