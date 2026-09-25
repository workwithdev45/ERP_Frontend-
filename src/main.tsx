import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { loadRuntimeConfig } from './config/app.config';

/**
 * G24: everything that reads APP_CONFIG.apiBaseUrl (the axios client, most of all) must not be
 * imported until the runtime config has loaded — dynamic imports defer their module evaluation
 * until this await resolves, so the API client picks up the fetched value, not the build-time one.
 */
async function bootstrap() {
  await loadRuntimeConfig();

  const [{ RouterProvider }, { AuthProvider }, { ThemeModeProvider }, { appRouter }, { GlobalStyle }] =
    await Promise.all([
      import('react-router-dom'),
      import('./context/AuthContext'),
      import('./context/ThemeContext'),
      import('./routes/AppRoutes'),
      import('./styles/GlobalStyle'),
    ]);

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
}

bootstrap();
