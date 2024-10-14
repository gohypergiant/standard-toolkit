import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button, ButtonContext, type ButtonProps } from '../button';
import { Group } from './group';
import type { GroupProps } from './types';

function setup(
  props: Partial<GroupProps<ButtonProps, HTMLButtonElement>> = {},
) {
  render(<Group {...props} />);

  return props;
}

describe('Group', () => {
  it('should render', () => {
    setup({
      children: [
        <Button key='foo'>Foo</Button>,
        <Button key='bar'>Bar</Button>,
      ],
      context: ButtonContext,
      values: { size: 'sm' },
    });

    expect(screen.getByText('Foo')).toBeInTheDocument();
    expect(screen.getByText('Bar')).toBeInTheDocument();
  });
});
