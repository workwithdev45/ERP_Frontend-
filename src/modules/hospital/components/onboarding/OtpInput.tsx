import { useRef } from 'react';
import styled from 'styled-components';

const Row = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[3]};
  justify-content: center;
`;

const Digit = styled.input<{ $invalid?: boolean }>`
  width: 52px;
  height: 56px;
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme, $invalid }) => ($invalid ? theme.colors.danger : theme.colors.border)};
  outline: none;

  &:focus {
    border-color: ${({ theme, $invalid }) => ($invalid ? theme.colors.danger : theme.colors.borderFocus)};
  }
`;

interface OtpInputProps {
  length: number;
  value: string[];
  onChange: (value: string[]) => void;
  invalid?: boolean;
}

export function OtpInput({ length, value, onChange, invalid }: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  function handleChange(index: number, raw: string) {
    const digit = raw.replace(/\D/g, '').slice(-1);
    const next = [...value];
    next[index] = digit;
    onChange(next);
    if (digit && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;
    e.preventDefault();
    onChange(pasted.split('').concat(Array(length).fill('')).slice(0, length));
    refs.current[Math.min(pasted.length, length - 1)]?.focus();
  }

  return (
    <Row>
      {Array.from({ length }).map((_, i) => (
        <Digit
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ''}
          $invalid={invalid}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
        />
      ))}
    </Row>
  );
}
