import styled from 'styled-components';
import { LeftOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common/Input/Input';
import { PAGE_SIZE } from '../hooks/usePagedList';

const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[5]};

  > div:first-child {
    flex: 0 1 320px;
  }
`;

const PagerBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[5]};
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

interface SearchBarProps {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

export function ListSearch({ value, placeholder, onChange }: SearchBarProps) {
  return (
    <Bar>
      <Input
        id={`search-${placeholder}`}
        aria-label={placeholder}
        placeholder={placeholder}
        prefixIcon={<SearchOutlined />}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Bar>
  );
}

interface PagerProps {
  page: number;
  totalPages: number;
  totalElements: number;
  onPage: (page: number) => void;
}

/** "Showing 26–50 of 132" with previous/next — hidden when everything fits on one page. */
export function Pager({ page, totalPages, totalElements, onPage }: PagerProps) {
  if (totalPages <= 1) return null;
  const from = page * PAGE_SIZE + 1;
  const to = Math.min(totalElements, (page + 1) * PAGE_SIZE);
  return (
    <PagerBar role="navigation" aria-label="Pages">
      <span aria-live="polite">
        Showing {from}–{to} of {totalElements}
      </span>
      <Button variant="secondary" size="sm" leadingIcon={<LeftOutlined />} disabled={page === 0} onClick={() => onPage(page - 1)}>
        Previous
      </Button>
      <Button variant="secondary" size="sm" trailingIcon={<RightOutlined />} disabled={page + 1 >= totalPages} onClick={() => onPage(page + 1)}>
        Next
      </Button>
    </PagerBar>
  );
}
