import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from './input';
import type { InputProps } from './types';

function setup(props: Partial<InputProps> = {}) {
  render(<Input {...props} />);

  return props;
}

describe('Input', () => {
  it('should render', () => {
    setup();

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
