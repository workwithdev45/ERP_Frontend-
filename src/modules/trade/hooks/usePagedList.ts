import { useCallback, useEffect, useRef, useState } from 'react';
import type { AxiosResponse } from 'axios';
import { apiErrorMessage } from '@/api/apiError';
import { useDebounce } from '@/hooks/useDebounce';
import type { ApiResponse } from '@/types/api.types';
import type { PagedResponse } from '@/types/pagination.types';
import type { ListParams } from '../types/trade.types';

export const PAGE_SIZE = 25;

/**
 * W15: one server-paged, searchable list. Fetches only while `enabled` (the visible tab), and
 * re-fetches on page or (debounced) search changes, or when `reload` is called.
 */
export function usePagedList<T>(
  fetcher: (params: ListParams) => Promise<AxiosResponse<ApiResponse<PagedResponse<T>>>>,
  enabled: boolean,
) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');
  const q = useDebounce(search.trim(), 300);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetcherRef.current({ page, size: PAGE_SIZE, q: q || undefined });
      const data = res.data.data;
      setItems(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
      setLoaded(true);
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not load this list. Please refresh the page.'));
    } finally {
      setLoading(false);
    }
  }, [page, q]);

  useEffect(() => {
    if (enabled) load();
  }, [enabled, load]);

  // A new search starts from the first page.
  useEffect(() => {
    setPage(0);
  }, [q]);

  return { items, page, setPage, totalPages, totalElements, search, setSearch, searching: !!q, loading, loaded, error, reload: load };
}

export type PagedList<T> = ReturnType<typeof usePagedList<T>>;
