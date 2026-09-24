import styled from 'styled-components';

/** Inline error banner for a form or modal (announced to screen readers). */
export const FormError = styled.p.attrs({ role: 'alert' })`
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.dangerLight};
  color: ${({ theme }) => theme.colors.dangerDark};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;
