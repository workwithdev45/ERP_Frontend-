import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
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
  padding: ${({ theme }) => theme.space[6]};
`;

export function MainLayout() {
  const session = authStorage.getSession();

  return (
    <Shell>
      <Sidebar companyName={session?.tenantName} />
      <Main>
        <Header />
        <Content>
          <Outlet />
        </Content>
      </Main>
    </Shell>
  );
}
