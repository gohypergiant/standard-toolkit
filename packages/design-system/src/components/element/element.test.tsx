import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Element } from './element';
import type { ElementProps } from './types';

function setup({ as = 'div', ref: _, ...rest }: Partial<ElementProps> = {}) {
  render(<Element {...rest} as={as} />);

  return {
    ...rest,
    as,
  };
}

describe('Element', () => {
  it('should render', () => {
    const children = 'Hello world';
    const { as } = setup({ children });
    const element = screen.getByText(children);

    expect(element).toBeInTheDocument();
    expect(element.tagName.toLowerCase()).toBe(as);
  });
});
