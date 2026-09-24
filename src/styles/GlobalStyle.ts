import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html,
  body {
    height: 100%;
  }

  body {
    font-family: ${({ theme }) => theme.font.family};
    font-size: ${({ theme }) => theme.fontSize.md};
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.bgPage};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  #root {
    min-height: 100vh;
  }

  button,
  input,
  select,
  textarea {
    font-family: inherit;
    font-size: inherit;
    color: inherit;
  }

  a {
    color: inherit;
  }

  h1, h2, h3, h4 {
    font-family: ${({ theme }) => theme.font.display};
    color: ${({ theme }) => theme.colors.textStrong};
    line-height: 1.25;
  }

  /* Figures in tables and KPIs line up in columns. */
  table,
  .num {
    font-variant-numeric: tabular-nums;
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.borderFocus};
    outline-offset: 2px;
  }

  ::selection {
    background: ${({ theme }) => theme.colors.primarySoft};
    color: ${({ theme }) => theme.colors.text};
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.borderStrong};
    border-radius: 999px;
    border: 2px solid transparent;
    background-clip: content-box;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Visible to screen readers only (e.g. headers of icon-only columns). */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      transition-duration: 0.01ms !important;
      animation-duration: 0.01ms !important;
    }
  }
`;
