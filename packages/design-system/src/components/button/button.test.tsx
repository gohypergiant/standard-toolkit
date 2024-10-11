import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from './button';
import type { ButtonProps } from './types';

function setup({ children = 'Foo', ...rest }: Partial<ButtonProps> = {}) {
  render(<Button {...rest}>{children}</Button>);

  return {
    ...rest,
    children,
  };
}

describe('Button', () => {
  it('should render', () => {
    const { children } = setup();

    expect(screen.getByText(`${children}`)).toBeInTheDocument();
  });

  it('should provide children render props', () => {
    const foo = 'Foo';
    const bar = 'Bar';

    setup({
      children: ({ isDisabled }) => (isDisabled ? foo : bar),
      isDisabled: true,
    });

    expect(screen.getByText(foo)).toBeInTheDocument();
  });
});
