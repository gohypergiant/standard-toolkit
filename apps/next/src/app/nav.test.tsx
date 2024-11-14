import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Nav } from './nav';

describe('Nav', () => {
  it('should render', async () => {
    const onAction = vi.fn();

    render(<Nav onAction={onAction} />);

    const button = screen.getByText('Click me');

    expect(button).toBeInTheDocument();

    await userEvent.click(button);

    const option = screen.getByText('Foo');

    expect(option).toBeInTheDocument();

    await userEvent.click(option);

    expect(onAction).toHaveBeenCalled();

    expect(option).not.toBeInTheDocument();
  });
});
