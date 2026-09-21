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
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.bgSubtle};
    -webkit-font-smoothing: antialiased;
  }

  #root {
    min-height: 100vh;
  }

  button,
  input {
    font-family: inherit;
  }

  a {
    color: inherit;
  }
`;
