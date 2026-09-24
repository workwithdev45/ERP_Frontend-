import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';

const VIEWPORT_MARGIN = 12;
const MAX_DROPDOWN_HEIGHT = 220;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textBody};
`;

const Box = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  min-height: 40px;
  padding: 5px ${({ theme }) => theme.space[2]};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.bg};
  box-shadow: ${({ theme }) => theme.shadow.xs};
  cursor: text;
  transition:
    border-color ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.textDisabled};
  }

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.borderFocus};
    box-shadow: ${({ theme }) => theme.shadow.focus};
  }
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 26px;
  padding: 0 6px 0 10px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primaryDarker};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  white-space: nowrap;
`;

const ChipRemove = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  border-radius: ${({ theme }) => theme.radius.xs};
  background: none;
  color: inherit;
  font-size: 10px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primarySoft};
  }
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 100px;
  height: 28px;
  padding: 0 ${({ theme }) => theme.space[1]};
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.text};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Dropdown = styled.div<{ $top: number; $left: number; $width: number }>`
  position: fixed;
  top: ${({ $top }) => $top}px;
  left: ${({ $left }) => $left}px;
  width: ${({ $width }) => $width}px;
  max-height: ${MAX_DROPDOWN_HEIGHT}px;
  overflow-y: auto;
  padding: ${({ theme }) => theme.space[1]};
  z-index: 200;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.lg};
`;

const Option = styled.button`
  display: block;
  width: 100%;
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: none;
  text-align: left;
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.textBody};
  cursor: pointer;

  &:hover,
  &:focus-visible {
    outline: none;
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primaryDarker};
  }
`;

const EmptyOption = styled.div`
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export interface TagPickerOption {
  id: number;
  label: string;
}

interface TagPickerProps {
  id?: string;
  label?: string;
  selected: TagPickerOption[];
  options: TagPickerOption[];
  placeholder?: string;
  onAdd: (id: number) => void;
  onRemove: (id: number) => void;
}

/** Multi-select as removable chips plus a type-to-filter dropdown (rendered in a portal so modals don't clip it). */
export function TagPicker({ id, label, selected, options, placeholder = 'Search…', onAdd, onRemove }: TagPickerProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (!boxRef.current?.contains(target) && !dropdownRef.current?.contains(target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useLayoutEffect(() => {
    if (!isOpen || !boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    let top = rect.bottom + 4;
    if (top + MAX_DROPDOWN_HEIGHT > window.innerHeight - VIEWPORT_MARGIN) {
      top = Math.max(rect.top - MAX_DROPDOWN_HEIGHT - 4, VIEWPORT_MARGIN);
    }
    setPosition({ top, left: rect.left, width: rect.width });
  }, [isOpen, query, selected.length]);

  const selectedIds = new Set(selected.map((s) => s.id));
  const filtered = options.filter(
    (o) => !selectedIds.has(o.id) && o.label.toLowerCase().includes(query.trim().toLowerCase()),
  );

  function handleSelect(option: TagPickerOption) {
    onAdd(option.id);
    setQuery('');
    inputRef.current?.focus();
  }

  return (
    <Field>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Box ref={boxRef} onClick={() => inputRef.current?.focus()}>
        {selected.map((item) => (
          <Chip key={item.id}>
            {item.label}
            <ChipRemove type="button" onClick={() => onRemove(item.id)} aria-label={`Remove ${item.label}`}>
              <CloseOutlined />
            </ChipRemove>
          </Chip>
        ))}
        <SearchInput
          ref={inputRef}
          id={id}
          type="text"
          value={query}
          placeholder={selected.length === 0 ? placeholder : 'Add another…'}
          autoComplete="off"
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsOpen(false);
            if (e.key === 'Enter') {
              e.preventDefault();
              if (filtered[0]) handleSelect(filtered[0]);
            }
            if (e.key === 'Backspace' && !query && selected.length > 0) {
              onRemove(selected[selected.length - 1].id);
            }
          }}
        />
      </Box>
      {isOpen &&
        position &&
        createPortal(
          <Dropdown ref={dropdownRef} role="listbox" $top={position.top} $left={position.left} $width={position.width}>
            {filtered.length === 0 ? (
              <EmptyOption>{options.length === selected.length ? 'All options added' : 'No matches'}</EmptyOption>
            ) : (
              filtered.map((option) => (
                <Option key={option.id} type="button" role="option" aria-selected={false} onClick={() => handleSelect(option)}>
                  {option.label}
                </Option>
              ))
            )}
          </Dropdown>,
          document.body,
        )}
    </Field>
  );
}
