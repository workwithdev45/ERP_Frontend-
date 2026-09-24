import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

/** Square 32px icon-only control for table rows. Always give it an `aria-label`. */
const iconButtonStyles = css`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.transition.fast},
    color ${({ theme }) => theme.transition.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focus};
  }
`;

export const IconButton = styled.button.attrs({ type: 'button' })`
  ${iconButtonStyles}
`;

export const IconLink = styled(Link)`
  ${iconButtonStyles}
`;
