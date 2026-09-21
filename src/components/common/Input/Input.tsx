import { forwardRef } from 'react';
import styled from 'styled-components';
import type { InputProps } from './Input.types';

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const InputRow = styled.div<{ $hasError?: boolean }>`
  display: flex;
  align-items: center;
  overflow: hidden;
  border: 1px solid ${({ theme, $hasError }) => ($hasError ? theme.colors.danger : theme.colors.border)};
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.bg};
  transition: border-color ${({ theme }) => theme.transition.fast};

  &:focus-within {
    border-color: ${({ theme, $hasError }) => (($hasError ? theme.colors.danger : theme.colors.borderFocus))};
  }
`;

const StyledInput = styled.input`
  flex: 1;
  height: 44px;
  padding: 0 ${({ theme }) => theme.space[4]};
  border: none;
  background: transparent;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Suffix = styled.span`
  padding-right: ${({ theme }) => theme.space[4]};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  white-space: nowrap;
`;

const SuffixBadgeWrap = styled.span`
  padding-right: ${({ theme }) => theme.space[2]};
`;

const PrefixIcon = styled.span`
  display: flex;
  align-items: center;
  padding-left: ${({ theme }) => theme.space[4]};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const PrefixBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 ${({ theme }) => theme.space[3]} 0 ${({ theme }) => theme.space[4]};
  margin-right: ${({ theme }) => theme.space[2]};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  white-space: nowrap;
`;

const SuffixIcon = styled.button`
  display: flex;
  align-items: center;
  padding-right: ${({ theme }) => theme.space[4]};
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
`;

const HintText = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ErrorText = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.danger};
`;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, hint, suffix, prefixIcon, prefixBadge, suffixIcon, onSuffixIconClick, suffixBadge, id, ...rest },
    ref,
  ) => {
    return (
      <Field>
        {label && <Label htmlFor={id}>{label}</Label>}
        <InputRow $hasError={!!error}>
          {prefixIcon && <PrefixIcon>{prefixIcon}</PrefixIcon>}
          {prefixBadge && <PrefixBadge>{prefixBadge}</PrefixBadge>}
          <StyledInput ref={ref} id={id} {...rest} />
          {suffix && <Suffix>{suffix}</Suffix>}
          {suffixBadge && <SuffixBadgeWrap>{suffixBadge}</SuffixBadgeWrap>}
          {suffixIcon && (
            <SuffixIcon type="button" onClick={onSuffixIconClick} tabIndex={-1}>
              {suffixIcon}
            </SuffixIcon>
          )}
        </InputRow>
        {error ? <ErrorText>{error}</ErrorText> : hint ? <HintText>{hint}</HintText> : null}
      </Field>
    );
  },
);

Input.displayName = 'Input';
