import { forwardRef } from 'react';
import styled from 'styled-components';
import type { InputProps } from './Input.types';

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

const InputRow = styled.div<{ $hasError?: boolean }>`
  display: flex;
  align-items: center;
  overflow: hidden;
  border: 1px solid ${({ theme, $hasError }) => ($hasError ? theme.colors.danger : theme.colors.borderStrong)};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.bg};
  box-shadow: ${({ theme }) => theme.shadow.xs};
  transition:
    border-color ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast};

  &:hover {
    border-color: ${({ theme, $hasError }) => ($hasError ? theme.colors.danger : theme.colors.textDisabled)};
  }

  &:focus-within {
    border-color: ${({ theme, $hasError }) => ($hasError ? theme.colors.danger : theme.colors.borderFocus)};
    box-shadow: ${({ theme, $hasError }) => ($hasError ? '0 0 0 3px rgba(200, 50, 43, 0.2)' : theme.shadow.focus)};
  }
`;

const StyledInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 40px;
  padding: 0 ${({ theme }) => theme.space[3]};
  border: none;
  background: transparent;
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.text};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  /* The surrounding InputRow draws the focus ring; don't double it on the inner field. */
  &:focus,
  &:focus-visible {
    outline: none;
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
  justify-content: center;
  width: 20px;
  margin-left: ${({ theme }) => theme.space[3]};
  font-size: 16px;
  line-height: 1;
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
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ErrorText = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
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
