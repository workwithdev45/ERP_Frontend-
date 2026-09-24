import { forwardRef } from 'react';
import styled from 'styled-components';
import { DownOutlined } from '@ant-design/icons';
import type { SelectProps } from './Select.types';

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

const Control = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledSelect = styled.select<{ $hasError?: boolean }>`
  width: 100%;
  height: 40px;
  padding: 0 ${({ theme }) => theme.space[7]} 0 ${({ theme }) => theme.space[3]};
  appearance: none;
  border: 1px solid ${({ theme, $hasError }) => ($hasError ? theme.colors.danger : theme.colors.borderStrong)};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.bg};
  box-shadow: ${({ theme }) => theme.shadow.xs};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition:
    border-color ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.textDisabled};
  }

  &:focus,
  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.colors.borderFocus};
    box-shadow: ${({ theme }) => theme.shadow.focus};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.bgSubtle};
    color: ${({ theme }) => theme.colors.textMuted};
    cursor: not-allowed;
  }
`;

const Chevron = styled(DownOutlined)`
  position: absolute;
  right: ${({ theme }) => theme.space[3]};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  pointer-events: none;
`;

const HintText = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ErrorText = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.danger};
`;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, options, placeholder, id, ...rest }, ref) => (
    <Field>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Control>
        <StyledSelect ref={ref} id={id} $hasError={!!error} aria-invalid={!!error} {...rest}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </StyledSelect>
        <Chevron aria-hidden="true" />
      </Control>
      {error ? <ErrorText>{error}</ErrorText> : hint && <HintText>{hint}</HintText>}
    </Field>
  ),
);

Select.displayName = 'Select';
