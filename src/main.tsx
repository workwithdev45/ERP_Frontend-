import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeModeProvider } from './context/ThemeContext';
import { appRouter } from './routes/AppRoutes';
import { GlobalStyle } from './styles/GlobalStyle';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeModeProvider>
      <GlobalStyle />
      <AuthProvider>
        <RouterProvider router={appRouter} />
      </AuthProvider>
    </ThemeModeProvider>
  </StrictMode>,
);
