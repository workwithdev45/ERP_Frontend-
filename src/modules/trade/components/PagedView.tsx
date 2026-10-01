import type { ReactNode } from 'react';
import styled from 'styled-components';
import { FormError } from '@/components/common/FormError/FormError';
import type { PagedList } from '../hooks/usePagedList';
import { ListSearch, Pager } from './ListToolbar';

const Message = styled.div`
  padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[5]};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

interface PagedViewProps<T> {
  list: PagedList<T>;
  searchPlaceholder: string;
  /** Shown when the list is empty and nothing is being searched for. */
  empty: ReactNode;
  children: (items: T[]) => ReactNode;
}

/** Search box, the list (or its loading/empty/error state) and the pager for one paged list. */
export function PagedView<T>({ list, searchPlaceholder, empty, children }: PagedViewProps<T>) {
  let body: ReactNode;
  if (list.error) body = <FormError>{list.error}</FormError>;
  else if (!list.loaded) body = <Message>Loading…</Message>;
  else if (list.items.length === 0) body = <Message>{list.searching ? 'Nothing matches your search.' : empty}</Message>;
  else body = children(list.items);

  return (
    <>
      {(list.totalElements > 0 || list.searching) && <ListSearch value={list.search} placeholder={searchPlaceholder} onChange={list.setSearch} />}
      <div aria-busy={list.loading}>{body}</div>
      <Pager page={list.page} totalPages={list.totalPages} totalElements={list.totalElements} onPage={list.setPage} />
    </>
  );
}
