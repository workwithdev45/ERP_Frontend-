import { isAxiosError } from 'axios';

/** The backend's `message` for a failed request, or a generic fallback. */
export function apiErrorMessage(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (isAxiosError<{ message?: string }>(err) && err.response?.data?.message) {
    return err.response.data.message;
  }
  return fallback;
}
