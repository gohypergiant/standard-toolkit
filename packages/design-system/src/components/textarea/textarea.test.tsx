import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TextArea } from './textarea';
import type { TextAreaProps } from './types';

function setup(props: Partial<TextAreaProps> = {}) {
  render(<TextArea {...props} />);

  return props;
}

describe('TextArea', () => {
  it('should render', () => {
    setup();

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
