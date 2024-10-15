import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Switch } from './switch';
import type { SwitchProps } from './types';

function setup({ children = 'Foo', ...rest }: Partial<SwitchProps> = {}) {
  render(<Switch {...rest}>{children}</Switch>);

  return {
    ...rest,
    children,
  };
}

describe('Switch', () => {
  it('should render', () => {
    const { children } = setup();

    expect(screen.getByRole('switch')).toBeInTheDocument();
    expect(screen.getByText(`${children}`)).toBeInTheDocument();
  });
});
