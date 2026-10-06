import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button/Button';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { FeedbackScreen } from './FeedbackScreen';

/** Catch-all for URLs no route matches. Dashboard is protected, so signed-out users land on login. */
export function NotFound() {
  const navigate = useNavigate();
  return (
    <FeedbackScreen
      code="404"
      title="Page not found"
      description="The page you're looking for doesn't exist or has moved."
      actions={
        <>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Go back
          </Button>
          <Button onClick={() => navigate(ROUTE_PATHS.dashboard)}>Go to dashboard</Button>
        </>
      }
    />
  );
}
