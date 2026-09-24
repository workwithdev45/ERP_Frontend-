import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';

const VIEWPORT_MARGIN = 12;
const MAX_DROPDOWN_HEIGHT = 220;

const Wrap = styled.div`
  position: relative;
`;

const Box = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[2]};
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space[3]};
  min-height: 44px;
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px 4px 10px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
`;

const ChipRemove = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 12px;
  padding: 0;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  background: transparent;
  flex: 1;
  min-width: 100px;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Dropdown = styled.div<{ $top: number; $left: number; $width: number }>`
  position: fixed;
  top: ${({ $top }) => $top}px;
  left: ${({ $left }) => $left}px;
  width: ${({ $width }) => $width}px;
  z-index: 200;
  max-height: ${MAX_DROPDOWN_HEIGHT}px;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
`;

const Option = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: ${({ theme }) => theme.space[3]};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.bgSubtle};
  }
`;

const EmptyOption = styled.div`
  padding: ${({ theme }) => theme.space[3]};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export interface TagPickerOption {
  id: number;
  label: string;
}

interface TagPickerProps {
  id?: string;
  selected: TagPickerOption[];
  options: TagPickerOption[];
  placeholder?: string;
  onAdd: (id: number) => void;
  onRemove: (id: number) => void;
}

export function TagPicker({ id, selected, options, placeholder = 'Search…', onAdd, onRemove }: TagPickerProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        wrapRef.current &&
        !wrapRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useLayoutEffect(() => {
    if (!isOpen || !wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    let top = rect.bottom + 4;
    if (top + MAX_DROPDOWN_HEIGHT > window.innerHeight - VIEWPORT_MARGIN) {
      top = Math.max(rect.top - MAX_DROPDOWN_HEIGHT - 4, VIEWPORT_MARGIN);
    }
    setPosition({ top, left: rect.left, width: rect.width });
  }, [isOpen, query]);

  const selectedIds = new Set(selected.map((s) => s.id));
  const filtered = options.filter(
    (o) => !selectedIds.has(o.id) && o.label.toLowerCase().includes(query.trim().toLowerCase()),
  );

  function handleSelect(option: TagPickerOption) {
    onAdd(option.id);
    setQuery('');
  }

  return (
    <Wrap ref={wrapRef}>
      <Box id={id} onClick={() => setIsOpen(true)}>
        {selected.map((item) => (
          <Chip key={item.id}>
            {item.label}
            <ChipRemove type="button" onClick={() => onRemove(item.id)} aria-label={`Remove ${item.label}`}>
              <CloseOutlined />
            </ChipRemove>
          </Chip>
        ))}
        <SearchInput
          type="text"
          value={query}
          placeholder={selected.length === 0 ? placeholder : 'Add another…'}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
        />
      </Box>
      {isOpen &&
        position &&
        createPortal(
          <Dropdown ref={dropdownRef} $top={position.top} $left={position.left} $width={position.width}>
            {filtered.length === 0 ? (
              <EmptyOption>No matches</EmptyOption>
            ) : (
              filtered.map((option) => (
                <Option key={option.id} type="button" onClick={() => handleSelect(option)}>
                  {option.label}
                </Option>
              ))
            )}
          </Dropdown>,
          document.body,
        )}
    </Wrap>
  );
}
