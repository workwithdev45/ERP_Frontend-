import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import { ActionMenu } from './ActionMenu';

function renderMenu(onSelect: () => void) {
  return render(
    <ThemeProvider theme={theme}>
      <ActionMenu
        trigger={(open) => (
          <button type="button" onClick={open}>
            Open menu
          </button>
        )}
        items={[
          { key: 'view', label: 'View', onSelect },
          { key: 'delete', label: 'Delete', danger: true, onSelect: vi.fn() },
        ]}
      />
    </ThemeProvider>,
  );
}

describe('ActionMenu', () => {
  it('is closed until the trigger is clicked', () => {
    renderMenu(vi.fn());
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens the menu and lists every item on trigger click', async () => {
    renderMenu(vi.fn());
    await userEvent.click(screen.getByText('Open menu'));

    expect(await screen.findByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'View' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument();
  });

  it('calls onSelect and closes the menu when an item is clicked', async () => {
    const onSelect = vi.fn();
    renderMenu(onSelect);
    await userEvent.click(screen.getByText('Open menu'));
    await userEvent.click(await screen.findByRole('menuitem', { name: 'View' }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('closes when Escape is pressed', async () => {
    renderMenu(vi.fn());
    await userEvent.click(screen.getByText('Open menu'));
    expect(await screen.findByRole('menu')).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });
});
