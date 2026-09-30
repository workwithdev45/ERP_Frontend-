import { useCallback, useState } from 'react';
import type { AxiosResponse } from 'axios';
import { apiErrorMessage } from '@/api/apiError';
import type { ApiResponse } from '@/types/api.types';
import type { TradeDocument } from '../types/trade.types';

/** The document open in the detail modal, plus a runner for its workflow actions. */
export function useDocumentDetail(fetchDocument: (id: number) => Promise<AxiosResponse<ApiResponse<TradeDocument>>>) {
  const [document, setDocument] = useState<TradeDocument | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const open = useCallback(
    async (id: number) => {
      setLoading(true);
      setError('');
      try {
        const res = await fetchDocument(id);
        setDocument(res.data.data);
      } catch (err) {
        setError(apiErrorMessage(err, 'Could not load the document.'));
      } finally {
        setLoading(false);
      }
    },
    [fetchDocument],
  );

  /** Runs an action (approve, cancel, ...) and shows the document it returns, or the error. */
  const run = useCallback(async (action: () => Promise<AxiosResponse<ApiResponse<TradeDocument>>>, afterwards?: () => Promise<void>) => {
    setBusy(true);
    setError('');
    try {
      const res = await action();
      setDocument(res.data.data);
      await afterwards?.();
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }, []);

  const close = useCallback(() => {
    setDocument(null);
    setError('');
  }, []);

  return { document, loading, error, busy, open, run, close, setDocument };
}
