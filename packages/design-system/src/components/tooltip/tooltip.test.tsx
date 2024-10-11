import { render, screen } from '@testing-library/react';
import { TooltipTrigger } from 'react-aria-components';
import { describe, expect, it } from 'vitest';
import { Tooltip } from './tooltip';
import type { TooltipProps } from './types';

function setup({
  children = 'Foo',
  isOpen = true,
  ...rest
}: Partial<TooltipProps> = {}) {
  render(
    <TooltipTrigger isOpen={isOpen}>
      <Tooltip {...rest}>{children}</Tooltip>
    </TooltipTrigger>,
  );

  return {
    ...rest,
    children,
    isOpen,
  };
}

describe('Tooltip', () => {
  it('should render', () => {
    const { children } = setup();

    expect(screen.getByText(`${children}`)).toBeInTheDocument();
  });
});
