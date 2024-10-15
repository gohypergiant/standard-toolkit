import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Chip } from './chip';
import type { ChipProps } from './types';

function setup({ children = 'Foo', ...rest }: Partial<ChipProps> = {}) {
  render(<Chip {...rest}>{children}</Chip>);

  return {
    ...rest,
    children,
  };
}

describe('Chip', () => {
  it('should render', () => {
    const { children } = setup();

    expect(screen.getByText(`${children}`)).toBeInTheDocument();
  });
});
