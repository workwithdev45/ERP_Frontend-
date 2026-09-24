import styled from 'styled-components';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { useThemeMode } from '@/context/ThemeContext';

const ToggleButton = styled.button`
  width: 38px;
  height: 38px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.transition.fast},
    color ${({ theme }) => theme.transition.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
    color: ${({ theme }) => theme.colors.text};
  }
`;

/** Switches between the light and dark themes; the choice is remembered on this device. */
export function ThemeToggle({ className }: { className?: string }) {
  const { mode, toggleMode } = useThemeMode();
  const label = mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <ToggleButton type="button" className={className} onClick={toggleMode} aria-label={label} title={label}>
      {mode === 'dark' ? <SunOutlined /> : <MoonOutlined />}
    </ToggleButton>
  );
}
