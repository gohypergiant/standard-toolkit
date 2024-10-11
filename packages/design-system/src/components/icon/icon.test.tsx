import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Icon } from './icon';
import type { IconProps } from './types';

function setup(props: Partial<IconProps> = {}) {
  render(<Icon {...props} />);

  return props;
}

describe('Icon', () => {
  it('should render', () => {
    const children = 'Hello world';

    setup({ children });

    expect(screen.getByText(children)).toBeInTheDocument();
  });
});
