import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { Button } from '@/components/common/Button/Button';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { FeedbackScreen } from './FeedbackScreen';
import { NotFound } from './NotFound';

/**
 * Router-level `errorElement`: replaces React Router's bare "Unexpected Application Error" screen
 * when a page throws while rendering or loading. Only shown on failure — normal rendering is untouched.
 */
export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFound />;
  }

  if (import.meta.env.DEV) {
    console.error(error);
  }

  return (
    <FeedbackScreen
      code="ERROR"
      title="Something went wrong"
      description="This page hit an unexpected error. Reloading usually fixes it — if it keeps happening, contact your administrator."
      actions={
        <>
          <Button variant="secondary" onClick={() => window.location.assign(ROUTE_PATHS.dashboard)}>
            Go to dashboard
          </Button>
          <Button onClick={() => window.location.reload()}>Reload page</Button>
        </>
      }
    />
  );
}
